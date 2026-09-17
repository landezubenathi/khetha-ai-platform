from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class SyncEventIn(BaseModel):
    event_id: UUID
    device_id: str = Field(min_length=1, max_length=160)
    entity_type: Literal["journey_item"]
    entity_id: UUID
    operation: Literal["upsert", "delete"]
    payload: dict
    payload_hash: str = Field(min_length=64, max_length=64)
    client_updated_at: datetime


class SyncEventResult(BaseModel):
    event_id: UUID
    status: Literal["applied", "duplicate", "rejected"]
    server_updated_at: datetime
    message: str | None = None

