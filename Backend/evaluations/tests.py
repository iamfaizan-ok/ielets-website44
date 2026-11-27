"""Core end-to-end tests: strict user isolation (IDOR prevention), anti-cheat, and grading."""

from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from exams.models import IELTSTest, Question

User = get_user_model()


class IELTSPlatformSecurityAndFlowTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="user_a", email="a@example.com", password="StrongPass123!"
        )
        self.user_b = User.objects.create_user(
            username="user_b", email="b@example.com", password="StrongPass123!"
        )

        self.reading_test = IELTSTest.objects.create(
            module=IELTSTest.Module.READING,
            title="Urban Micro-Forests",
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
            content={"task1": "Bar chart", "task2": "Public libraries essay"},
        )

    def test_anti_cheat_next_exam_and_user_isolation(self):
        self.client.force_authenticate(user=self.user_a)

        # 1. Next unattempted exam must NOT leak correct_answer or explanation
        next_res = self.client.get(reverse("exams:next-exam", kwargs={"module": "reading"}))
        self.assertEqual(next_res.status_code, status.HTTP_200_OK)
        q_payload = next_res.data["questions"][0]
        self.assertNotIn("correct_answer", q_payload)
        self.assertNotIn("explanation", q_payload)

        # 2. User A submits objective reading test
        submit_res = self.client.post(
            reverse("evaluations:submit-objective"),
            {"test_id": self.reading_test.id, "answers": {str(self.q1.id): "TRUE"}},
            format="json",
        )
        self.assertEqual(submit_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(submit_res.data["band_score"], "9.0")
        attempt_id = submit_res.data["attempt_id"]

        # 3. IDOR check: User B must NOT see User A's attempt or analytics
        self.client.force_authenticate(user=self.user_b)
        detail_res = self.client.get(
            reverse("evaluations:history-detail", kwargs={"pk": attempt_id})
        )
        self.assertEqual(detail_res.status_code, status.HTTP_404_NOT_FOUND)

        history_res = self.client.get(reverse("evaluations:history-list"))
        self.assertEqual(history_res.status_code, status.HTTP_200_OK)
        self.assertEqual(history_res.data["count"], 0)

    @patch("evaluations.views.evaluate_writing_with_openai")
    def test_writing_credit_deduction_and_zero_credit_block(self, mock_eval):
        mock_eval.return_value = {
            "band_score": 7.5,
            "task_achievement": 7.5,
            "coherence_cohesion": 7.5,
            "lexical_resource": 7.5,
            "grammatical_range": 7.5,
            "sentence_corrections": ["Use 'allocate' instead of 'put'."],
            "upgraded_vocabulary": ["alleviate congestion"],
            "model_sample_band_8_5": "Sample essay...",
            "summary": "Strong response.",
        }

        self.client.force_authenticate(user=self.user_a)
        res = self.client.post(
            reverse("evaluations:submit-writing"),
            {
                "test_id": self.writing_test.id,
                "task1_response": "Summary of solar energy chart...",
                "task2_response": "Public libraries remain vital community hubs in digital cities.",
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["remaining_credits"], 2)

        # Zero-credit FREE user must be blocked
        self.user_a.ai_credits = 0
        self.user_a.save(update_fields=["ai_credits"])
        blocked = self.client.post(
            reverse("evaluations:submit-writing"),
            {
                "test_id": self.writing_test.id,
                "task2_response": "Another essay attempt with zero credits.",
            },
            format="json",
        )
        self.assertEqual(blocked.status_code, status.HTTP_403_FORBIDDEN)
