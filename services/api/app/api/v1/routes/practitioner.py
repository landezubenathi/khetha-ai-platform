from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import DbSession
from app.core.auth import get_current_user_id
from app.models.entities import PractitionerRequest
from app.schemas.journey import PractitionerRequestIn, PractitionerRequestOut


router = APIRouter()


@router.post("", response_model=PractitionerRequestOut, status_code=status.HTTP_201_CREATED)
async def create_request(
    payload: PractitionerRequestIn,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> PractitionerRequestOut:
    item = PractitionerRequest(user_id=user_id, **payload.model_dump())
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return PractitionerRequestOut(
        id=item.id,
        reason=item.reason,
        status=item.status,
        submitted_at=item.submitted_at,
    )

