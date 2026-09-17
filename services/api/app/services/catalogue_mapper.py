from app.models.entities import Career, ContentVersion, Provider, Qualification
from app.schemas.catalogue import (
    CareerOut,
    ContentSource,
    ProviderOut,
    QualificationOut,
    SubjectRequirementOut,
)


def source_out(source: ContentVersion) -> ContentSource:
    return ContentSource(
        version_id=source.id,
        version_label=source.version_label,
        source_name=source.source_name,
        source_uri=source.source_uri,
        is_official=source.is_official,
    )


def qualification_out(item: Qualification) -> QualificationOut:
    return QualificationOut(
        id=item.id,
        code=item.code,
        title=item.title,
        nqf_level=item.nqf_level,
        description=item.description,
        typical_duration=item.typical_duration,
        admission_notes=item.admission_notes,
        source=source_out(item.content_version),
    )


def provider_out(item: Provider) -> ProviderOut:
    return ProviderOut(
        id=item.id,
        code=item.code,
        name=item.name,
        provider_type=item.provider_type,
        province=item.province,
        website_url=item.website_url,
        contact_details=item.contact_details,
        source=source_out(item.content_version),
    )


def career_out(career: Career) -> CareerOut:
    return CareerOut(
        id=career.id,
        code=career.code,
        name=career.name,
        summary=career.summary,
        work_environment=career.work_environment,
        subject_requirements=[
            SubjectRequirementOut(
                code=link.subject.code,
                name=link.subject.name,
                requirement_type=link.requirement_type,
                minimum_achievement_level=link.minimum_achievement_level,
            )
            for link in career.subject_requirements
        ],
        interest_codes=[link.interest.code for link in career.interest_links],
        qualifications=[qualification_out(link.qualification) for link in career.qualification_links],
        source=source_out(career.content_version),
    )

