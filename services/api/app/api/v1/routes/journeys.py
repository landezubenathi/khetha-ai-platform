from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.api.deps import DbSession
from app.core.auth import get_current_user_id
from app.models.entities import JourneyItem
from app.schemas.journey import JourneyItemOut, JourneyItemUpsert


router = APIRouter()


def as_output(item: JourneyItem) -> JourneyItemOut:
    return JourneyItemOut(
        id=item.id,
        item_type=item.item_type,
        reference_id=item.reference_id,
        title=item.title,
        status=item.status,
        notes=item.notes,
        target_date=item.target_date,
        source_snapshot=item.source_snapshot,
        client_updated_at=item.client_updated_at,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


@router.get("", response_model=list[JourneyItemOut])
async def list_journey(
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> list[JourneyItemOut]:
    result = await session.scalars(
        select(JourneyItem)
        .where(JourneyItem.user_id == user_id, JourneyItem.deleted_at.is_(None))
        .order_by(JourneyItem.updated_at.desc())
    )
    return [as_output(item) for item in result]


@router.put("/{item_id}", response_model=JourneyItemOut)
async def upsert_journey_item(
    item_id: UUID,
    payload: JourneyItemUpsert,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> JourneyItemOut:
    if payload.id != item_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Path and payload IDs must match.")
    item = await session.get(JourneyItem, item_id)
    if item and item.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Journey item not found.")
    if item is None:
        item = JourneyItem(id=item_id, user_id=user_id, created_at=datetime.now(timezone.utc))
        session.add(item)
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    item.deleted_at = datetime.now(timezone.utc) if payload.status == "removed" else None
    await session.commit()
    await session.refresh(item)
    return as_output(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journey_item(
    item_id: UUID,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> None:
    item = await session.get(JourneyItem, item_id)
    if item is None or item.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Journey item not found.")
    item.status = "removed"
    item.deleted_at = datetime.now(timezone.utc)
    await session.commit()

