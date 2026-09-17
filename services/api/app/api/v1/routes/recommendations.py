from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import DbSession
from app.core.auth import get_current_user_id
from app.core.config import get_settings
from app.models.entities import Recommendation
from app.repositories.catalogue import CatalogueRepository
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation import ALGORITHM_VERSION, recommend


router = APIRouter()


@router.post("", response_model=RecommendationResponse)
async def create_recommendations(
    request: RecommendationRequest,
    session: DbSession,
    user_id: Annotated[UUID, Depends(get_current_user_id)],
) -> RecommendationResponse:
    careers = await CatalogueRepository(session).careers()
    results = recommend(careers, request)
    for result in results:
        session.add(
            Recommendation(
                user_id=user_id,
                career_id=result.career.id,
                score=result.score,
                confidence=result.confidence,
                reasons=result.reasons,
                missing_requirements=result.missing_requirements,
                input_snapshot=request.model_dump(),
                algorithm_version=ALGORITHM_VERSION,
                content_version_id=result.career.source.version_id,
                practitioner_review_recommended=result.practitioner_review_recommended,
            )
        )
    await session.commit()
    mode = "approved" if get_settings().content_source_mode == "approved" else "demo"
    return RecommendationResponse(
        results=results,
        algorithm_version=ALGORITHM_VERSION,
        guidance_notice=(
            "Exploration support only. Verify requirements using authorised DHET/NCAP information "
            "or a career practitioner before making study decisions."
        ),
        content_source_mode=mode,
    )

