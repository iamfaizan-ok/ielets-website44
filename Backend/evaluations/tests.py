"""Security & concurrency tests: IDOR, anti-cheat timer, atomic credit lock, refund, payload guard, throttling."""

import time
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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
