from collections import Counter
from collections.abc import Iterable, Mapping
from typing import Any


def summarise_interest_codes(
    selected_metadata: Iterable[Mapping[str, Any]],
) -> dict[str, object]:
    """Build a small, explainable interest summary from approved option metadata."""

    counts: Counter[str] = Counter()
    for metadata in selected_metadata:
        for code in metadata.get("interest_codes", []):
            if isinstance(code, str) and code:
                counts[code] += 1
    ranked = sorted(counts, key=lambda code: (-counts[code], code))
    return {
        "interest_codes": ranked,
        "interest_scores": {code: counts[code] for code in ranked},
        "scoring_method": "demo-interest-count-v1",
        "notice": "Prototype summary only; this is not a validated psychometric result.",
    }
