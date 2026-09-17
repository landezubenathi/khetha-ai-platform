import uuid

from app.models.entities import (
    Career,
    CareerInterest,
    CareerSubjectRequirement,
    ContentVersion,
    Interest,
    Subject,
)
from app.schemas.recommendation import RecommendationRequest
from app.services.recommendation import recommend


def build_career(
    *,
    code: str,
    name: str,
    required: list[tuple[str, str]],
    recommended: list[tuple[str, str]],
    interests: list[tuple[str, str]],
) -> Career:
    source = ContentVersion(
        id=uuid.uuid4(),
        version_label="demo-test",
        source_name="Test catalogue",
        is_official=False,
    )
    career = Career(
        id=uuid.uuid4(),
        code=code,
        name=name,
        summary="Test summary",
        content_version_id=source.id,
        content_version=source,
    )
    career.subject_requirements = [
        CareerSubjectRequirement(
            career_id=career.id,
            subject_id=(subject_id := uuid.uuid4()),
            requirement_type=kind,
            subject=Subject(id=subject_id, code=subject_code, name=subject_name),
        )
        for kind, values in (("required", required), ("recommended", recommended))
        for subject_code, subject_name in values
    ]
    career.interest_links = [
        CareerInterest(
            career_id=career.id,
            interest_id=(interest_id := uuid.uuid4()),
            interest=Interest(id=interest_id, code=interest_code, name=interest_name),
        )
        for interest_code, interest_name in interests
    ]
    career.qualification_links = []
    return career


def test_matching_is_ranked_explainable_and_safe() -> None:
    software = build_career(
        code="software-developer",
        name="Software Developer",
        required=[("mathematics", "Mathematics")],
        recommended=[("information-technology", "Information Technology")],
        interests=[("technology", "Technology"), ("problem-solving", "Problem solving")],
    )
    teacher = build_career(
        code="teacher",
        name="Teacher",
        required=[("english", "English")],
        recommended=[],
        interests=[("helping-people", "Helping people")],
    )
    request = RecommendationRequest(
        subject_codes=["mathematics", "information-technology"],
        interest_codes=["technology", "problem-solving"],
    )

    results = recommend([teacher, software], request)

    assert results[0].career.code == "software-developer"
    assert results[0].score > results[1].score
    assert results[0].reasons
    assert results[0].career.source.is_official is False
    assert results[1].practitioner_review_recommended is True

