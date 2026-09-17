from fastapi import APIRouter

from app.api.v1.routes import assessments, catalogue, health, journeys, practitioner, recommendations, sync


router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(catalogue.router, prefix="/catalog", tags=["catalogue"])
router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
router.include_router(journeys.router, prefix="/journey", tags=["journey"])
router.include_router(practitioner.router, prefix="/practitioner-requests", tags=["practitioner"])
router.include_router(sync.router, prefix="/sync", tags=["sync"])
