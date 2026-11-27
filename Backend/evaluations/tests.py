"""Security & concurrency tests: IDOR, anti-cheat timer, atomic credit lock, refund, payload guard, throttling."""

import re
import time
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import EmailOTP
from accounts.services import PaymentRequiredException, verify_and_deduct_ai_credit
from evaluations.models import TestAttempt
from evaluations.tasks import process_writing_evaluation
from exams.models import IELTSTest, Question

User = get_user_model()


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class IELTSHighConcurrencySecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user_a = User.objects.create_user(
            username="user_a", email="a@example.com", password="StrongPass123!"
        )
        self.user_b = User.objects.create_user(
            username="user_b", email="b@example.com", password="StrongPass123!"
        )
        self.reading_test = IELTSTest.objects.create(
            module=IELTSTest.Module.READING,
            title="Urban Micro-Forests",
            duration_minutes=60,
            content={"text": "Micro-forests cool cities by 3.2C."},
        )
        self.q1 = Question.objects.create(
            test=self.reading_test,
            order=1,
            question_type=Question.QuestionType.TFNG,
            prompt="Micro-forests cool cities.",
            options=["TRUE", "FALSE", "NOT GIVEN"],
            correct_answer="TRUE",
            explanation="Stated directly in the passage.",
        )
        self.writing_test = IELTSTest.objects.create(
            module=IELTSTest.Module.WRITING,
            title="Cambridge 19 Test 1",
            duration_minutes=60,
            content={"task1": "Bar chart", "task2": "Public libraries essay"},
        )

    def test_unauthenticated_guests_receive_401(self):
        self.assertEqual(
            self.client.get(reverse("exams:next-exam", kwargs={"module": "reading"})).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.get(reverse("exams:lesson-detail", kwargs={"slug": "writing-1"})).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.get(reverse("exams:teacher-links")).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.get(reverse("evaluations:history-list")).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_anti_cheat_idor_and_server_timer(self):
        self.client.force_authenticate(user=self.user_a)

        # 1. Active exam must omit correct_answer & explanation
        next_res = self.client.get(reverse("exams:next-exam", kwargs={"module": "reading"}))
        self.assertEqual(next_res.status_code, status.HTTP_200_OK)
        q_payload = next_res.data["questions"][0]
        self.assertNotIn("correct_answer", q_payload)
        self.assertNotIn("explanation", q_payload)

        # 2. Submit within timer
        submit_res = self.client.post(
            reverse("evaluations:submit-objective"),
            {"test_id": self.reading_test.id, "answers": {str(self.q1.id): "TRUE"}},
            format="json",
        )
        self.assertEqual(submit_res.status_code, status.HTTP_201_CREATED)
        attempt_id = submit_res.data["attempt_id"]

        # 3. Expired timer (> 60m + 2m grace) must be rejected
        cache.set(f"exam_timer:{self.user_a.id}:{self.reading_test.id}", time.time() - 4000)
        expired_res = self.client.post(
            reverse("evaluations:submit-objective"),
            {"test_id": self.reading_test.id, "answers": {str(self.q1.id): "TRUE"}},
            format="json",
        )
        self.assertEqual(expired_res.status_code, status.HTTP_400_BAD_REQUEST)

        # 4. IDOR protection: User B gets 404 on history & status endpoints
        self.client.force_authenticate(user=self.user_b)
        self.assertEqual(
            self.client.get(reverse("evaluations:history-detail", kwargs={"pk": attempt_id})).status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertEqual(
            self.client.get(reverse("evaluations:eval-status", kwargs={"pk": attempt_id})).status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_atomic_credit_locking_and_payload_bomb_guard(self):
        self.user_a.ai_credits = 1
        self.user_a.save(update_fields=["ai_credits"])

        # Strictly 1 succeeds; second call with 0 remaining raises PaymentRequiredException
        self.assertTrue(verify_and_deduct_ai_credit(self.user_a))
        with self.assertRaises(PaymentRequiredException):
            verify_and_deduct_ai_credit(self.user_a)

        # Payload bombing (> 8,000 chars) rejected before AI call
        self.user_a.ai_credits = 2
        self.user_a.save(update_fields=["ai_credits"])
        self.client.force_authenticate(user=self.user_a)
        bomb_res = self.client.post(
            reverse("evaluations:submit-writing"),
            {"test_id": self.writing_test.id, "task2_response": "word " * 1300},
            format="json",
        )
        self.assertEqual(bomb_res.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("evaluations.tasks.evaluate_writing_with_openai", side_effect=RuntimeError("OpenAI timeout"))
    def test_async_writing_and_auto_refund_on_ai_failure(self, _mock_eval):
        self.user_a.ai_credits = 2
        self.user_a.save(update_fields=["ai_credits"])
        self.client.force_authenticate(user=self.user_a)

        with patch("evaluations.views.process_writing_evaluation.delay") as mock_delay:
            res = self.client.post(
                reverse("evaluations:submit-writing"),
                {
                    "test_id": self.writing_test.id,
                    "task2_response": "Public libraries remain vital community hubs in digital cities.",
                },
                format="json",
            )
            self.assertEqual(res.status_code, status.HTTP_202_ACCEPTED)
            self.assertEqual(res.data["status"], TestAttempt.Status.PROCESSING)
            attempt_id = res.data["attempt_id"]
            mock_delay.assert_called_once_with(attempt_id, True)

        # Simulate Celery worker failure -> credit must automatically refund back to 2
        process_writing_evaluation(attempt_id, True)
        self.user_a.refresh_from_db()
        attempt = TestAttempt.objects.get(pk=attempt_id)
        self.assertEqual(attempt.status, TestAttempt.Status.FAILED)
        self.assertEqual(self.user_a.ai_credits, 2)

    def test_auth_rate_throttling(self):
        url = reverse("accounts:login")
        for i in range(10):
            res = self.client.post(url, {"username": "nope", "password": "wrong"})
            self.assertNotEqual(res.status_code, status.HTTP_429_TOO_MANY_REQUESTS, f"Throttled early at {i}")
        throttled = self.client.post(url, {"username": "nope", "password": "wrong"})
        self.assertEqual(throttled.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_4_digit_otp_signup_lockout_and_verification(self):
        mail.outbox.clear()
        signup_res = self.client.post(
            reverse("accounts:signup"),
            {
                "username": "otp_user",
                "email": "otp_user@gmail.com",
                "first_name": "Faizan",
                "password": "StrongPass123!",
            },
            format="json",
        )
        self.assertEqual(signup_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)
        match = re.search(r"\b(\d{4})\b", mail.outbox[0].body)
        self.assertIsNotNone(match)
        real_otp = match.group(1)

        # OTP must be hashed, never stored in plaintext
        otp_row = EmailOTP.objects.get(email="otp_user@gmail.com")
        self.assertNotEqual(otp_row.otp_hash, real_otp)

        # Unverified user cannot log in yet
        login_blocked = self.client.post(
            reverse("accounts:login"),
            {"username": "otp_user", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(login_blocked.status_code, status.HTTP_403_FORBIDDEN)

        # Wrong OTP rejected
        wrong_otp = "0000" if real_otp != "0000" else "9999"
        bad_res = self.client.post(
            reverse("accounts:verify-otp"),
            {"email": "otp_user@gmail.com", "otp": wrong_otp},
            format="json",
        )
        self.assertEqual(bad_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(bad_res.data["valid"])

        # Valid 4-digit OTP issues JWT tokens & verifies user
        ok_res = self.client.post(
            reverse("accounts:verify-otp"),
            {"email": "otp_user@gmail.com", "otp": real_otp},
            format="json",
        )
        self.assertEqual(ok_res.status_code, status.HTTP_200_OK)
        self.assertTrue(ok_res.data["valid"])
        self.assertIn("access", ok_res.data)
        self.assertTrue(User.objects.get(email="otp_user@gmail.com").is_verified)

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        GOOGLE_OAUTH_CLIENT_ID="test-client-id",
        GOOGLE_OAUTH_CLIENT_SECRET="test-client-secret",
    )
    def test_auth_security_matrix_and_google_oauth(self):
        # Weak password & duplicate email/username checks
        weak = self.client.post(
            reverse("accounts:signup"),
            {"email": "weak@gmail.com", "password": "123", "confirm_password": "123"},
            format="json",
        )
        self.assertEqual(weak.status_code, status.HTTP_400_BAD_REQUEST)

        self.user_a.is_verified = True
        self.user_a.save(update_fields=["is_verified"])
        dup_email = self.client.post(
            reverse("accounts:signup"),
            {"email": "a@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(dup_email.status_code, status.HTTP_400_BAD_REQUEST)

        dup_user = self.client.post(
            reverse("accounts:signup"),
            {"username": "user_a", "email": "new@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(dup_user.status_code, status.HTTP_400_BAD_REQUEST)

        # Login by email, wrong password, inactive user, last_login, and logout blacklist
        bad_pw = self.client.post(
            reverse("accounts:login"),
            {"email": "a@example.com", "password": "WrongPassword!"},
            format="json",
        )
        self.assertEqual(bad_pw.status_code, status.HTTP_401_UNAUTHORIZED)

        login_ok = self.client.post(
            reverse("accounts:login"),
            {"email": "a@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(login_ok.status_code, status.HTTP_200_OK)
        self.user_a.refresh_from_db()
        self.assertIsNotNone(self.user_a.last_login)

        refresh_tok = login_ok.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_ok.data['access']}")
        self.assertEqual(
            self.client.post(reverse("accounts:logout"), {"refresh": refresh_tok}, format="json").status_code,
            status.HTTP_200_OK,
        )
        self.client.credentials()
        self.assertEqual(
            self.client.post(reverse("accounts:token-refresh"), {"refresh": refresh_tok}, format="json").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.user_b.is_active = False
        self.user_b.is_verified = True
        self.user_b.save(update_fields=["is_active", "is_verified"])
        self.assertEqual(
            self.client.post(
                reverse("accounts:login"),
                {"email": "b@example.com", "password": "StrongPass123!"},
                format="json",
            ).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        # Password reset request + confirm
        mail.outbox.clear()
        self.assertEqual(
            self.client.post(
                reverse("accounts:password-reset"), {"email": "a@example.com"}, format="json"
            ).status_code,
            status.HTTP_200_OK,
        )
        reset_otp = re.search(r"\b(\d{4})\b", mail.outbox[0].body).group(1)
        self.assertEqual(
            self.client.post(
                reverse("accounts:password-reset-confirm"),
                {
                    "email": "a@example.com",
                    "otp": reset_otp,
                    "password": "NewStrongPass456!",
                    "confirm_password": "NewStrongPass456!",
                },
                format="json",
            ).status_code,
            status.HTTP_200_OK,
        )

        # Google OAuth: cancelled, invalid state, invalid token, signup, and existing-email link
        cache.clear()
        self.assertEqual(
            self.client.post(
                reverse("accounts:google-callback"), {"error": "access_denied"}, format="json"
            ).status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            self.client.post(
                reverse("accounts:google-callback"),
                {"code": "abc", "state": "bad-state"},
                format="json",
            ).status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        init_res = self.client.get(reverse("accounts:google-url"))
        state = re.search(r"state=([^&]+)", init_res.data["auth_url"]).group(1)
        with patch("accounts.views.http_requests.post") as mock_tok, patch(
            "accounts.views.google_id_token.verify_oauth2_token"
        ) as mock_verify:
            mock_tok.return_value.ok = True
            mock_tok.return_value.json.return_value = {"id_token": "fake-id-token"}
            mock_verify.side_effect = ValueError("Expired token")
            self.assertEqual(
                self.client.post(
                    reverse("accounts:google-callback"),
                    {"code": "good-code", "state": state},
                    format="json",
                ).status_code,
                status.HTTP_401_UNAUTHORIZED,
            )

        init_res2 = self.client.get(reverse("accounts:google-url"))
        state2 = re.search(r"state=([^&]+)", init_res2.data["auth_url"]).group(1)
        with patch("accounts.views.http_requests.post") as mock_tok, patch(
            "accounts.views.google_id_token.verify_oauth2_token"
        ) as mock_verify:
            mock_tok.return_value.ok = True
            mock_tok.return_value.json.return_value = {"id_token": "good-id-token"}
            mock_verify.return_value = {
                "iss": "https://accounts.google.com",
                "sub": "google-sub-123",
                "email": "googleuser@gmail.com",
                "email_verified": True,
                "given_name": "Google",
                "family_name": "Learner",
            }
            g_res = self.client.post(
                reverse("accounts:google-callback"),
                {"code": "good-code", "state": state2},
                format="json",
            )
            self.assertEqual(g_res.status_code, status.HTTP_200_OK)
            g_user = User.objects.get(email="googleuser@gmail.com")
            self.assertFalse(g_user.has_usable_password())
            self.assertEqual(g_user.google_sub, "google-sub-123")

        # Direct Google Identity Services ID token endpoint (/api/accounts/google-auth/)
        with patch("accounts.views.google_id_token.verify_oauth2_token") as mock_verify:
            mock_verify.side_effect = ValueError("Invalid token")
            self.assertEqual(
                self.client.post(
                    reverse("accounts:google-auth"),
                    {"credential": "bad-jwt"},
                    format="json",
                ).status_code,
                status.HTTP_401_UNAUTHORIZED,
            )

            mock_verify.side_effect = None
            mock_verify.return_value = {
                "iss": "accounts.google.com",
                "sub": "google-gis-sub-456",
                "email": "gisuser@gmail.com",
                "email_verified": True,
                "given_name": "GIS",
                "family_name": "Tester",
            }
            gis_res = self.client.post(
                reverse("accounts:google-auth"),
                {"credential": "valid-gis-jwt"},
                format="json",
            )
            self.assertEqual(gis_res.status_code, status.HTTP_200_OK)
            self.assertIn("access", gis_res.data)
            self.assertIn("refresh", gis_res.data)
            gis_user = User.objects.get(email="gisuser@gmail.com")
            self.assertTrue(gis_user.is_verified)
