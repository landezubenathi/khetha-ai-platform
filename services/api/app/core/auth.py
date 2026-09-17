from typing import Annotated
from uuid import UUID

from fastapi import Header, HTTPException, status

from app.core.config import get_settings


async def get_current_user_id(
    x_demo_user_id: Annotated[str | None, Header()] = None,
) -> UUID:
    """Development identity boundary.

    Production must replace this branch with verified OIDC claims. Keeping the
    boundary explicit prevents a demo header from silently becoming production auth.
    """

    settings = get_settings()
    if not settings.is_development:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Production OIDC authentication is not configured.",
        )
    if not x_demo_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-Demo-User-ID is required in development.",
        )
    try:
        return UUID(x_demo_user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Demo-User-ID must be a UUID.",
        ) from exc

