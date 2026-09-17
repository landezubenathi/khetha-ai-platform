from app.services.assessment import summarise_interest_codes


def test_interest_summary_is_ranked_and_explainable() -> None:
    result = summarise_interest_codes(
        [
            {"interest_codes": ["technology", "building"]},
            {"interest_codes": ["technology", "problem-solving"]},
            {"interest_codes": ["data", "technology"]},
        ]
    )

    assert result["interest_codes"] == ["technology", "building", "data", "problem-solving"]
    assert result["interest_scores"] == {
        "technology": 3,
        "building": 1,
        "data": 1,
        "problem-solving": 1,
    }
    assert "not a validated psychometric result" in str(result["notice"])
