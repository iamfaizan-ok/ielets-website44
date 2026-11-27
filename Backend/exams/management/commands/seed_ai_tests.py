"""Management command to bulk-generate IELTS tests via OpenAI Structured Outputs."""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from openai import OpenAI
from pydantic import BaseModel, Field

from exams.models import IELTSTest, Question
from exams.services import upload_media_to_r2


class GeneratedQuestionSchema(BaseModel):
    question_type: str = Field(pattern="^(TFNG|MCQ|FILL|MATCHING)$")
    prompt: str
    options: list[str]
    correct_answer: str
    explanation: str


class GeneratedObjectiveTestSchema(BaseModel):
    title: str
    category: str = Field(pattern="^(ACADEMIC|GENERAL)$")
    passage_or_transcript: str
    questions: list[GeneratedQuestionSchema] = Field(min_length=4, max_length=8)
    self_check_passed: bool


class GeneratedSubjectiveTestSchema(BaseModel):
    title: str
    category: str = Field(pattern="^(ACADEMIC|GENERAL)$")
    content: dict


class Command(BaseCommand):
    help = "Bulk-generate IELTS tests via AI and save to PostgreSQL (and R2 TTS for listening)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--module",
            type=str,
            required=True,
            choices=IELTSTest.Module.values,
            help="Target IELTS module: reading, listening, writing, or speaking.",
        )
        parser.add_argument(
            "--count",
            type=int,
            default=10,
            help="Number of tests to generate (e.g. 50 or 100).",
        )

    def handle(self, *args, **options):
        if not settings.OPENAI_API_KEY:
            raise CommandError("OPENAI_API_KEY must be set in environment.")

        module: str = options["module"]
        count: int = max(1, options["count"])
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        created = 0

        for idx in range(1, count + 1):
            try:
                if module in (IELTSTest.Module.READING, IELTSTest.Module.LISTENING):
                    created += self._create_objective(client, module, idx)
                else:
                    created += self._create_subjective(client, module, idx)
            except Exception as exc:
                self.stderr.write(self.style.WARNING(f"[{idx}/{count}] Skipped: {exc}"))

        self.stdout.write(self.style.SUCCESS(f"Seeded {created}/{count} '{module}' tests."))

    def _create_objective(self, client: OpenAI, module: str, idx: int) -> int:
        resp = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            temperature=0.4,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Generate an authentic IELTS {module} test with a realistic "
                        f"{'academic passage' if module == 'reading' else 'spoken transcript'} "
                        "and 5 verifiable questions. Confirm self_check_passed=true only if "
                        "every correct_answer is directly supported by the text."
                    ),
                },
                {"role": "user", "content": f"Generate unique IELTS {module} test #{idx}."},
            ],
            response_format=GeneratedObjectiveTestSchema,
        )
        data = resp.choices[0].message.parsed
        if not data.self_check_passed or not data.questions:
            return 0

        media_key, media_url = "", ""
        if module == IELTSTest.Module.LISTENING:
            speech = client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=data.passage_or_transcript[:4000],
            )
            media_key, media_url = upload_media_to_r2(
                speech.content,
                folder="listening/audio",
                extension="mp3",
                content_type="audio/mpeg",
            )

        with transaction.atomic():
            test = IELTSTest.objects.create(
                module=module,
                title=data.title[:255],
                book_series="AI Seeded Bank",
                category=data.category,
                content={"text": data.passage_or_transcript},
                media_key=media_key,
                media_url=media_url,
            )
            Question.objects.bulk_create(
                [
                    Question(
                        test=test,
                        order=i,
                        question_type=q.question_type,
                        prompt=q.prompt,
                        options=q.options,
                        correct_answer=q.correct_answer,
                        explanation=q.explanation,
                    )
                    for i, q in enumerate(data.questions, start=1)
                ]
            )
        return 1

    def _create_subjective(self, client: OpenAI, module: str, idx: int) -> int:
        prompt_spec = (
            "keys: task1_type, task1_prompt, task2_type, task2_prompt, sample_outline"
            if module == IELTSTest.Module.WRITING
            else "keys: part1_questions, part2_cue_card, part3_questions"
        )
        resp = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            temperature=0.5,
            messages=[
                {
                    "role": "system",
                    "content": f"Generate an authentic IELTS {module} test JSON with {prompt_spec}.",
                },
                {"role": "user", "content": f"Generate unique IELTS {module} test #{idx}."},
            ],
            response_format=GeneratedSubjectiveTestSchema,
        )
        data = resp.choices[0].message.parsed
        IELTSTest.objects.create(
            module=module,
            title=data.title[:255],
            book_series="AI Seeded Bank",
            category=data.category,
            content=data.content,
        )
        return 1
