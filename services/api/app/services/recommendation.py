from dataclasses import dataclass

from app.models.entities import Career
from app.schemas.recommendation import RecommendationRequest, RecommendationResult
from app.services.catalogue_mapper import career_out


ALGORITHM_VERSION = "rules-v1"
LOW_CONFIDENCE_THRESHOLD = 45


@dataclass(frozen=True)
class ScoreParts:
    subject_score: float
    interest_score: float
    profile_score: float


def score_career(career: Career, request: RecommendationRequest) -> RecommendationResult:
    learner_subjects = {value.casefold().strip() for value in request.subject_codes}
    learner_interests = {value.casefold().strip() for value in request.interest_codes}

    required_links = [x for x in career.subject_requirements if x.requirement_type == "required"]
    recommended_links = [x for x in career.subject_requirements if x.requirement_type == "recommended"]
    required = {x.subject.code.casefold() for x in required_links}
    recommended = {x.subject.code.casefold() for x in recommended_links}
    career_interests = {x.interest.code.casefold() for x in career.interest_links}

    required_matches = learner_subjects & required
    recommended_matches = learner_subjects & recommended
    required_coverage = len(required_matches) / len(required) if required else 1.0
    recommended_coverage = len(recommended_matches) / len(recommended) if recommended else 0.0
    subject_score = required_coverage * 0.8 + recommended_coverage * 0.2

    interest_matches = learner_interests & career_interests
    interest_score = (
        len(interest_matches) / min(len(learner_interests), len(career_interests))
        if learner_interests and career_interests
        else 0.0
    )
    profile_score = 1.0 if learner_interests else 0.5
    parts = ScoreParts(subject_score, interest_score, profile_score)
    score = round((parts.subject_score * 0.6 + parts.interest_score * 0.3 + parts.profile_score * 0.1) * 100)

    missing = sorted(link.subject.name for link in required_links if link.subject.code.casefold() not in learner_subjects)
    reasons: list[str] = []
    if required_matches:
        names = [link.subject.name for link in required_links if link.subject.code.casefold() in required_matches]
        reasons.append("Matches selected subjects: " + ", ".join(sorted(names)))
    if recommended_matches:
        names = [link.subject.name for link in recommended_links if link.subject.code.casefold() in recommended_matches]
        reasons.append("Includes useful supporting subjects: " + ", ".join(sorted(names)))
    if interest_matches:
        names = [link.interest.name for link in career.interest_links if link.interest.code.casefold() in interest_matches]
        reasons.append("Matches interests: " + ", ".join(sorted(names)))
    if not reasons:
        reasons.append("Shown for exploration; the current profile has limited matching evidence.")

    confidence = "high" if score >= 75 and not missing else "medium" if score >= 45 else "low"
    return RecommendationResult(
        career=career_out(career),
        score=score,
        confidence=confidence,
        reasons=reasons,
        missing_requirements=missing,
        practitioner_review_recommended=score < LOW_CONFIDENCE_THRESHOLD or bool(missing),
    )


def recommend(careers: list[Career], request: RecommendationRequest) -> list[RecommendationResult]:
    return sorted(
        (score_career(career, request) for career in careers),
        key=lambda result: (-result.score, result.career.name),
    )[:5]

