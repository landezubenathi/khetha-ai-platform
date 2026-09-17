from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ContentVersion(Base):
    __tablename__ = "content_versions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    version_label: Mapped[str] = mapped_column(String(80), unique=True)
    source_name: Mapped[str] = mapped_column(String(160))
    source_uri: Mapped[str | None] = mapped_column(Text)
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    imported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    checksum_sha256: Mapped[str | None] = mapped_column(String(64))
    notes: Mapped[str | None] = mapped_column(Text)


class AppUser(TimestampMixin, Base):
    __tablename__ = "app_users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    external_identity_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    role: Mapped[str] = mapped_column(String(30), default="learner")
    status: Mapped[str] = mapped_column(String(20), default="active")
    preferred_language: Mapped[str] = mapped_column(String(16), default="en-ZA")
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Subject(TimestampMixin, Base):
    __tablename__ = "subjects"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(40), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    content_version_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("content_versions.id"))

    content_version: Mapped[ContentVersion | None] = relationship(lazy="joined")


class Interest(TimestampMixin, Base):
    __tablename__ = "interests"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    content_version_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("content_versions.id"))

    content_version: Mapped[ContentVersion | None] = relationship(lazy="joined")


class Career(TimestampMixin, Base):
    __tablename__ = "careers"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(80), unique=True)
    name: Mapped[str] = mapped_column(String(180))
    summary: Mapped[str] = mapped_column(Text)
    work_environment: Mapped[str | None] = mapped_column(Text)
    source_reference: Mapped[str | None] = mapped_column(String(255))
    content_version_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("content_versions.id"))
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    content_version: Mapped[ContentVersion] = relationship(lazy="joined")
    subject_requirements: Mapped[list[CareerSubjectRequirement]] = relationship(
        back_populates="career", lazy="selectin", cascade="all, delete-orphan"
    )
    interest_links: Mapped[list[CareerInterest]] = relationship(
        back_populates="career", lazy="selectin", cascade="all, delete-orphan"
    )
    qualification_links: Mapped[list[CareerQualification]] = relationship(
        back_populates="career", lazy="selectin", cascade="all, delete-orphan"
    )


class CareerSubjectRequirement(Base):
    __tablename__ = "career_subject_requirements"

    career_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("careers.id", ondelete="CASCADE"), primary_key=True
    )
    subject_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("subjects.id"), primary_key=True)
    requirement_type: Mapped[str] = mapped_column(String(20), primary_key=True)
    minimum_achievement_level: Mapped[int | None] = mapped_column(SmallInteger)
    notes: Mapped[str | None] = mapped_column(Text)

    career: Mapped[Career] = relationship(back_populates="subject_requirements")
    subject: Mapped[Subject] = relationship(lazy="joined")


class CareerInterest(Base):
    __tablename__ = "career_interests"

    career_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("careers.id", ondelete="CASCADE"), primary_key=True
    )
    interest_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("interests.id"), primary_key=True)
    weight: Mapped[float] = mapped_column(Numeric(4, 3), default=1.0)

    career: Mapped[Career] = relationship(back_populates="interest_links")
    interest: Mapped[Interest] = relationship(lazy="joined")


class Qualification(TimestampMixin, Base):
    __tablename__ = "qualifications"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(100), unique=True)
    title: Mapped[str] = mapped_column(String(220))
    nqf_level: Mapped[int | None] = mapped_column(SmallInteger)
    description: Mapped[str | None] = mapped_column(Text)
    typical_duration: Mapped[str | None] = mapped_column(String(80))
    admission_notes: Mapped[str | None] = mapped_column(Text)
    source_reference: Mapped[str | None] = mapped_column(String(255))
    content_version_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("content_versions.id"))
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    content_version: Mapped[ContentVersion] = relationship(lazy="joined")


class CareerQualification(Base):
    __tablename__ = "career_qualifications"

    career_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("careers.id", ondelete="CASCADE"), primary_key=True
    )
    qualification_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("qualifications.id", ondelete="CASCADE"), primary_key=True
    )
    relationship_type: Mapped[str] = mapped_column(String(30), default="possible_pathway")

    career: Mapped[Career] = relationship(back_populates="qualification_links")
    qualification: Mapped[Qualification] = relationship(lazy="joined")


class Provider(TimestampMixin, Base):
    __tablename__ = "providers"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(220))
    provider_type: Mapped[str | None] = mapped_column(String(40))
    province: Mapped[str | None] = mapped_column(String(40))
    website_url: Mapped[str | None] = mapped_column(Text)
    contact_details: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    source_reference: Mapped[str | None] = mapped_column(String(255))
    content_version_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("content_versions.id"))
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    content_version: Mapped[ContentVersion] = relationship(lazy="joined")


class ProviderQualification(Base):
    __tablename__ = "provider_qualifications"

    provider_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("providers.id", ondelete="CASCADE"), primary_key=True
    )
    qualification_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("qualifications.id", ondelete="CASCADE"), primary_key=True
    )
    delivery_modes: Mapped[list[str]] = mapped_column(JSON, default=list)
    application_url: Mapped[str | None] = mapped_column(Text)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AssessmentDefinition(Base):
    __tablename__ = "assessment_definitions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(100))
    version: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(180))
    assessment_type: Mapped[str] = mapped_column(String(30))
    instructions: Mapped[str | None] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    content_version_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("content_versions.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    content_version: Mapped[ContentVersion] = relationship(lazy="joined")
    questions: Mapped[list[AssessmentQuestion]] = relationship(
        back_populates="assessment", lazy="selectin", order_by="AssessmentQuestion.sequence_number"
    )


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessment_definitions.id", ondelete="CASCADE")
    )
    sequence_number: Mapped[int] = mapped_column(Integer)
    prompt: Mapped[str] = mapped_column(Text)
    response_type: Mapped[str] = mapped_column(String(30))
    required: Mapped[bool] = mapped_column(Boolean, default=True)
    question_metadata: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)

    assessment: Mapped[AssessmentDefinition] = relationship(back_populates="questions")
    options: Mapped[list[AssessmentOption]] = relationship(
        back_populates="question", lazy="selectin", order_by="AssessmentOption.sequence_number"
    )


class AssessmentOption(Base):
    __tablename__ = "assessment_options"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    question_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessment_questions.id", ondelete="CASCADE")
    )
    sequence_number: Mapped[int] = mapped_column(Integer)
    label: Mapped[str] = mapped_column(Text)
    value: Mapped[str] = mapped_column(String(100))
    scoring_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    question: Mapped[AssessmentQuestion] = relationship(back_populates="options")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    assessment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("assessment_definitions.id"))
    status: Mapped[str] = mapped_column(String(20), default="in_progress")
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    result_summary: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    client_event_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, unique=True)


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    attempt_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessment_attempts.id", ondelete="CASCADE"), primary_key=True
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessment_questions.id"), primary_key=True
    )
    answer: Mapped[dict[str, Any]] = mapped_column(JSON)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    career_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("careers.id"))
    score: Mapped[int] = mapped_column(SmallInteger)
    confidence: Mapped[str] = mapped_column(String(20))
    reasons: Mapped[list[str]] = mapped_column(JSON, default=list)
    missing_requirements: Mapped[list[str]] = mapped_column(JSON, default=list)
    input_snapshot: Mapped[dict[str, Any]] = mapped_column(JSON)
    algorithm_version: Mapped[str] = mapped_column(String(40))
    content_version_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("content_versions.id"))
    practitioner_review_recommended: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class JourneyItem(TimestampMixin, Base):
    __tablename__ = "journey_items"
    __table_args__ = (UniqueConstraint("user_id", "item_type", "reference_id"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    item_type: Mapped[str] = mapped_column(String(30))
    reference_id: Mapped[uuid.UUID | None] = mapped_column(Uuid)
    title: Mapped[str] = mapped_column(String(220))
    status: Mapped[str] = mapped_column(String(20), default="saved")
    notes: Mapped[str | None] = mapped_column(Text)
    target_date: Mapped[date | None] = mapped_column(Date)
    source_snapshot: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    client_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class PractitionerRequest(Base):
    __tablename__ = "practitioner_requests"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    reason: Mapped[str] = mapped_column(String(60))
    learner_message: Mapped[str | None] = mapped_column(Text)
    preferred_channel: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(20), default="submitted")
    assigned_practitioner_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("app_users.id"))
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    resolution_notes: Mapped[str | None] = mapped_column(Text)


class SyncEvent(Base):
    __tablename__ = "sync_events"

    event_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    device_id: Mapped[str] = mapped_column(String(160))
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[uuid.UUID | None] = mapped_column(Uuid)
    operation: Mapped[str] = mapped_column(String(20))
    payload: Mapped[dict[str, Any]] = mapped_column(JSON)
    payload_hash: Mapped[str] = mapped_column(String(64))
    client_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    processing_status: Mapped[str] = mapped_column(String(20), default="accepted")
    error_message: Mapped[str | None] = mapped_column(Text)
