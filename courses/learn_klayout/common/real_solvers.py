"""Track A real-KLayout evidence solvers — CLI recipe + checked-in log goldens."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"

GOLDEN_RECIPE_IDS = [
    "stream_gds",
    "load_drc",
    "run_drc",
    "markers",
    "drc_done",
]


def load_goldens() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def stage(name: str, g: dict[str, Any] | None = None) -> dict[str, Any]:
    g = g or load_goldens()
    return dict(g["stages"][name])


def recipe_prefix_ok(learner_ids: list[str], n: int | None = None) -> bool:
    want = GOLDEN_RECIPE_IDS if n is None else GOLDEN_RECIPE_IDS[:n]
    return list(learner_ids[: len(want)]) == want


def pass_cli_check(learner_ids: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_ids if learner_ids is not None else GOLDEN_RECIPE_IDS[:2]
    ok = recipe_prefix_ok(ids, 2)
    return {
        "ok": ok,
        "learner": ids,
        "want": GOLDEN_RECIPE_IDS[:2],
        "klayout_invocation": "klayout -b -r tiny_rect.drc",
        "gds_file": g["gds_file"],
        "drc_script": g["drc_script"],
        "cell": g["cell"],
    }


def pass_gds_vocab() -> dict[str, Any]:
    g = load_goldens()
    gv = stage("gds_vocab", g)
    ok = gv["layer_count"] == 2 and gv["shape_count"] == 2 and gv["dbu"] == 0.001
    return {"ok": ok, **gv}


def pass_real_stream_gds() -> dict[str, Any]:
    g = load_goldens()
    rs = stage("stream_gds", g)
    ok = rs["stream_ok"] is True and rs["shape_count"] == 2 and rs["cell"] == g["cell"]
    return {"ok": ok, **rs}


def pass_real_drc_script() -> dict[str, Any]:
    g = load_goldens()
    dr = stage("drc_script", g)
    ok = dr["width_violations"] == 1 and dr["violation_shape"] == "m0"
    return {"ok": ok, **dr}


def pass_real_markers() -> dict[str, Any]:
    g = load_goldens()
    mr = stage("markers", g)
    ok = mr["marker_count"] == 1 and mr["marker_shape"] == "m0"
    return {"ok": ok, **mr}


def real_klayout_engine(learner_recipe: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_recipe if learner_recipe is not None else GOLDEN_RECIPE_IDS
    checks = [
        pass_cli_check(ids[:2]),
        pass_gds_vocab(),
        pass_real_stream_gds(),
        pass_real_drc_script(),
        pass_real_markers(),
    ]
    ok = all(c["ok"] for c in checks) and recipe_prefix_ok(ids) and g["engine_ok"] is True
    return {
        "ok": ok,
        "recipe_ok": recipe_prefix_ok(ids),
        "shape_count": g["shape_count"],
        "width_violations": g["width_violations"],
        "marker_count": g["marker_count"],
        "goldens": g,
    }


def _selftest() -> None:
    assert pass_cli_check()["ok"]
    assert pass_gds_vocab()["ok"]
    assert pass_real_stream_gds()["ok"]
    assert pass_real_drc_script()["ok"]
    assert pass_real_markers()["ok"]
    eng = real_klayout_engine()
    assert eng["ok"], eng
    print(
        "REAL_KLAYOUT_OK",
        {k: eng[k] for k in ("ok", "shape_count", "width_violations", "marker_count")},
    )


if __name__ == "__main__":
    _selftest()
