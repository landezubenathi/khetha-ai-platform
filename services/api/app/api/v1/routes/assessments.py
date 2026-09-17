from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.api.deps import DbSession
from app.core.auth import get_current_user_id
from app.models.entities import (
    AssessmentAnswer,
    AssessmentAttempt,
    AssessmentDefinition,
)
from app.schemas.assessment import (
    AssessmentAttemptIn,
    AssessmentAttemptOut,
    AssessmentOptionOut,
    AssessmentOut,
    AssessmentQuestionOut,
)
from app.services.assessment import summarise_interest_codes
from app.services.catalogue_mapper import source_out


router = APIRouter()


@router.get("/{code}", response_model=AssessmentOut)
async def get_assessment(code: str, session: DbSession) -> AssessmentOut:
    result = await session.scalars(
        select(AssessmentDefinition).where(
            AssessmentDefinition.code == code,
            AssessmentDefinition.active.is_(True),
        )
    )
    assessment = result.first()
    if assessment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assessment not found.")
    return AssessmentOut(
        id=assessment.id,
        code=assessment.code,
        version=assessment.version,
        title=assessment.title,
        assessment_type=assessment.assessment_type,
        instructions=assessment.instructions,
        questions=[
            AssessmentQuestionOut(
                id=question.id,
                sequence_number=question.sequence_number,
                prompt=question.prompt,
                response_type=question.response_type,
                required=question.required,
                options=[
                    AssessmentOptionOut(
                        id=option.id,
                        label=option.label,
                        value=option.value,
                        scoring_metadata=option.scoring_metadata,
                    )
                    for option in question.options
                ],
            )
            for question in assessment.questions
        ],
        source=source_out(assessment.content_version),
    )


@router.post(
    "/{code}/attempts",
    response_model=AssessmentAttemptOut,
    status_code=status.HTTP_201_CREATED,
)
async def submit_assessment(
    code: str,
    payload: AssessmentAttemptIn,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> AssessmentAttemptOut:
    existing = await session.scalar(
        select(AssessmentAttempt).where(
            AssessmentAttempt.user_id == user_id,
            AssessmentAttempt.client_event_id == payload.client_event_id,
        )
    )
    if existing is not None:
        return attempt_out(existing)

    assessment = await session.scalar(
        select(AssessmentDefinition).where(
            AssessmentDefinition.code == code,
            AssessmentDefinition.active.is_(True),
        )
    )
    if assessment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assessment not found.")

    questions = {question.id: question for question in assessment.questions}
    if len({answer.question_id for answer in payload.answers}) != len(payload.answers):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Each question may be answered once.")
    required_ids = {question.id for question in assessment.questions if question.required}
    submitted_ids = {answer.question_id for answer in payload.answers}
    if missing_ids := required_ids - submitted_ids:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"Missing {len(missing_ids)} required answer(s).",
        )

    selected = []
    normalised_answers: list[tuple[UUID, dict[str, str]]] = []
    for answer in payload.answers:
        question = questions.get(answer.question_id)
        if question is None:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Unknown question.")
        option = next((item for item in question.options if item.id == answer.option_id), None)
        if option is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "The selected option does not belong to its question.",
            )
        selected.append(option.scoring_metadata)
        normalised_answers.append(
            (question.id, {"option_id": str(option.id), "value": option.value})
        )

    completed_at = datetime.now(timezone.utc)
    attempt = AssessmentAttempt(
        user_id=user_id,
        assessment_id=assessment.id,
        status="completed",
        completed_at=completed_at,
        result_summary=summarise_interest_codes(selected),
        client_event_id=payload.client_event_id,
    )
    session.add(attempt)
    await session.flush()
    session.add_all(
        AssessmentAnswer(attempt_id=attempt.id, question_id=question_id, answer=answer)
        for question_id, answer in normalised_answers
    )
    await session.commit()
    return attempt_out(attempt)


def attempt_out(attempt: AssessmentAttempt) -> AssessmentAttemptOut:
    if attempt.completed_at is None:
        raise RuntimeError("Completed assessment is missing its completion timestamp.")
    return AssessmentAttemptOut(
        id=attempt.id,
        status=attempt.status,
        completed_at=attempt.completed_at,
        result_summary=attempt.result_summary,
    )
