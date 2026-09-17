from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.catalogue import CareerOut


class RecommendationRequest(BaseModel):
    subject_codes: list[str] = Field(min_length=1, max_length=12)
    interest_codes: list[str] = Field(default_factory=list, max_length=12)
    preferred_language: str = Field(default="en-ZA", max_length=16)


class RecommendationResult(BaseModel):
    career: CareerOut
    score: int = Field(ge=0, le=100)
    confidence: Literal["low", "medium", "high"]
    reasons: list[str]
    missing_requirements: list[str]
    practitioner_review_recommended: bool


class RecommendationResponse(BaseModel):
    results: list[RecommendationResult]
    algorithm_version: str
    guidance_notice: str
    content_source_mode: Literal["demo", "approved"]

