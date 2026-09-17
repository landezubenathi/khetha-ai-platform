from fastapi import APIRouter

from app.core.config import get_settings


router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
        "content_source_mode": settings.content_source_mode,
    }

