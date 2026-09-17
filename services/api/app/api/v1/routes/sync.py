from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import DbSession
from app.core.auth import get_current_user_id
from app.models.entities import JourneyItem, SyncEvent
from app.schemas.journey import JourneyItemUpsert
from app.schemas.sync import SyncEventIn, SyncEventResult


router = APIRouter()


@router.post("", response_model=SyncEventResult)
async def apply_sync_event(
    payload: SyncEventIn,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> SyncEventResult:
    existing = await session.get(SyncEvent, payload.event_id)
    if existing:
        if existing.payload_hash != payload.payload_hash:
            return SyncEventResult(
                event_id=payload.event_id,
                status="rejected",
                server_updated_at=existing.received_at,
                message="This event ID was already used with different content.",
            )
        return SyncEventResult(
            event_id=payload.event_id,
            status="duplicate",
            server_updated_at=existing.received_at,
        )

    event = SyncEvent(user_id=user_id, **payload.model_dump())
    session.add(event)
    try:
        item = await session.get(JourneyItem, payload.entity_id)
        if item is not None and item.user_id != user_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Journey item not found.")
        if payload.operation == "delete":
            if item:
                item.status = "removed"
                item.deleted_at = datetime.now(timezone.utc)
        else:
            incoming = JourneyItemUpsert.model_validate(payload.payload)
            if item is None:
                item = JourneyItem(user_id=user_id, **incoming.model_dump())
                session.add(item)
            elif incoming.client_updated_at >= item.client_updated_at:
                for field, value in incoming.model_dump().items():
                    setattr(item, field, value)
        event.processing_status = "applied"
        await session.commit()
        return SyncEventResult(
            event_id=payload.event_id,
            status="applied",
            server_updated_at=datetime.now(timezone.utc),
        )
    except Exception:
        await session.rollback()
        raise
