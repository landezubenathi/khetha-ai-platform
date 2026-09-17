from uuid import UUID

from pydantic import BaseModel


class ContentSource(BaseModel):
    version_id: UUID
    version_label: str
    source_name: str
    source_uri: str | None
    is_official: bool


class SubjectOut(BaseModel):
    id: UUID
    code: str
    name: str
    source: ContentSource | None


class InterestOut(BaseModel):
    id: UUID
    code: str
    name: str
    source: ContentSource | None


class SubjectRequirementOut(BaseModel):
    code: str
    name: str
    requirement_type: str
    minimum_achievement_level: int | None


class QualificationOut(BaseModel):
    id: UUID
    code: str
    title: str
    nqf_level: int | None
    description: str | None
    typical_duration: str | None
    admission_notes: str | None
    source: ContentSource


class ProviderOut(BaseModel):
    id: UUID
    code: str
    name: str
    provider_type: str | None
    province: str | None
    website_url: str | None
    contact_details: dict
    source: ContentSource


class CareerOut(BaseModel):
    id: UUID
    code: str
    name: str
    summary: str
    work_environment: str | None
    subject_requirements: list[SubjectRequirementOut]
    interest_codes: list[str]
    qualifications: list[QualificationOut]
    source: ContentSource
