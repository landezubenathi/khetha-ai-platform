from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.catalogue import ContentSource


class AssessmentOptionOut(BaseModel):
    id: UUID
    label: str
    value: str
    scoring_metadata: dict


class AssessmentQuestionOut(BaseModel):
    id: UUID
    sequence_number: int
    prompt: str
    response_type: str
    required: bool
    options: list[AssessmentOptionOut]


class AssessmentOut(BaseModel):
    id: UUID
    code: str
    version: str
    title: str
    assessment_type: str
    instructions: str | None
    questions: list[AssessmentQuestionOut]
    source: ContentSource


class AssessmentAnswerIn(BaseModel):
    question_id: UUID
    option_id: UUID


class AssessmentAttemptIn(BaseModel):
    client_event_id: UUID
    answers: list[AssessmentAnswerIn] = Field(min_length=1, max_length=100)


class AssessmentAttemptOut(BaseModel):
    id: UUID
    status: str
    completed_at: datetime
    result_summary: dict
