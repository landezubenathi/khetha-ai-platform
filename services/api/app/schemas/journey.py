from datetime import date, datetime
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class JourneyItemUpsert(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    item_type: Literal["career", "qualification", "provider", "task"]
    reference_id: UUID | None = None
    title: str = Field(min_length=1, max_length=220)
    status: Literal["saved", "exploring", "planned", "completed", "removed"] = "saved"
    notes: str | None = Field(default=None, max_length=2000)
    target_date: date | None = None
    source_snapshot: dict = Field(default_factory=dict)
    client_updated_at: datetime


class JourneyItemOut(JourneyItemUpsert):
    created_at: datetime
    updated_at: datetime


class PractitionerRequestIn(BaseModel):
    reason: Literal[
        "low_confidence", "subject_choice", "career_choice", "job_fit", "accessibility", "other"
    ]
    learner_message: str | None = Field(default=None, max_length=2000)
    preferred_channel: Literal["phone", "email", "in_app", "none"] = "in_app"


class PractitionerRequestOut(BaseModel):
    id: UUID
    reason: str
    status: str
    submitted_at: datetime

