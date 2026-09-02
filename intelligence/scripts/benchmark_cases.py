from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from app.config import load_algorithm_config
from app.models import AnalysisRequest
from app.services.analysis import AnalysisService


def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate NAUTRACE attribution on labelled incident JSON files."
    )
    parser.add_argument("--cases", required=True, type=Path, help="Directory containing *.json AnalysisRequest files")
    parser.add_argument(
        "--labels",
        required=True,
        type=Path,
        help='JSON map: {"incident_id": "true_vessel_id"} or null for Unknown/Non-AIS',
    )
    parser.add_argument("--output", type=Path, help="Optional JSON report path")
    args = parser.parse_args()

    labels: dict[str, str | None] = load_json(args.labels)
    service = AnalysisService(load_algorithm_config())

    total = 0
    known_total = 0
    rank1_hits = 0
    rank3_hits = 0
    reciprocal_rank_sum = 0.0
    unknown_total = 0
    unknown_hits = 0
    rows: list[dict[str, Any]] = []

    labels_path = args.labels.resolve()
    for path in sorted(args.cases.glob("*.json")):
        if path.resolve() == labels_path:
            continue
        request = AnalysisRequest.model_validate(load_json(path))
        if request.incident_id not in labels:
            continue
        result = service.analyze(request)
        truth = labels[request.incident_id]
        total += 1

        row: dict[str, Any] = {
            "incident_id": request.incident_id,
            "truth": truth,
            "decision": result.decision.outcome,
            "unknown_median": result.decision.unknown_median,
            "ranked_vessels": [c.vessel_id for c in result.candidates],
        }

        if truth is None:
            unknown_total += 1
            hit = result.decision.outcome == "UNKNOWN_NON_AIS"
            unknown_hits += int(hit)
            row["correct"] = hit
        else:
            known_total += 1
            ranks = {candidate.vessel_id: candidate.rank for candidate in result.candidates}
            rank = ranks.get(truth)
            row["true_rank"] = rank
            if rank is not None:
                rank1_hits += int(rank == 1)
                rank3_hits += int(rank <= 3)
                reciprocal_rank_sum += 1.0 / rank
            row["correct"] = rank == 1 and result.decision.outcome == "RANKED_CANDIDATES"
        rows.append(row)

    report = {
        "cases_evaluated": total,
        "known_source_cases": known_total,
        "unknown_source_cases": unknown_total,
        "rank_at_1": (rank1_hits / known_total) if known_total else None,
        "rank_at_3": (rank3_hits / known_total) if known_total else None,
        "mrr": (reciprocal_rank_sum / known_total) if known_total else None,
        "unknown_accuracy": (unknown_hits / unknown_total) if unknown_total else None,
        "cases": rows,
    }

    rendered = json.dumps(report, indent=2)
    print(rendered)
    if args.output:
        args.output.write_text(rendered)


if __name__ == "__main__":
    main()
