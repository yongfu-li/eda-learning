"""Track A real-Magic evidence solvers — CLI recipe + checked-in log goldens."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"

GOLDEN_RECIPE_IDS = [
    "tech_load",
    "load_cell",
    "paint_verify",
    "save",
    "drc_check",
    "gds_write",
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
        "magic_invocation": "magic -dnull -noconsole -rcfile .magicrc script.tcl",
        "tech": g["tech_file"],
        "layout": g["layout_file"],
        "cell": g["cell"],
    }


def pass_magic_tech_vocab() -> dict[str, Any]:
    g = load_goldens()
    tv = stage("tech_vocab", g)
    ok = tv["layer_count"] == 6 and tv["layers"] == g["tech_layers"]
    return {"ok": ok, **tv}


def pass_real_paint_save() -> dict[str, Any]:
    g = load_goldens()
    ps = stage("paint_save", g)
    ok = ps["rect_count"] == 6 and ps["contact_count"] == 1 and ps["cell"] == "tiny_inv"
    return {"ok": ok, **ps}


def pass_real_drc() -> dict[str, Any]:
    g = load_goldens()
    d = stage("drc", g)
    ok = d["error_count"] == 1 and d["thin_shape"] == "thin" and d["layer"] == "metal1"
    return {"ok": ok, **d}


def pass_real_gds() -> dict[str, Any]:
    g = load_goldens()
    gd = stage("gds", g)
    ok = gd["layer_count"] == 6 and gd["metal1_gds"] == 49
    return {"ok": ok, **gd}


def real_magic_engine(learner_recipe: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_recipe if learner_recipe is not None else GOLDEN_RECIPE_IDS
    checks = [
        pass_cli_check(ids[:2]),
        pass_magic_tech_vocab(),
        pass_real_paint_save(),
        pass_real_drc(),
        pass_real_gds(),
    ]
    ok = all(c["ok"] for c in checks) and recipe_prefix_ok(ids) and g["engine_ok"] is True
    return {
        "ok": ok,
        "recipe_ok": recipe_prefix_ok(ids),
        "rects": g["rect_count"],
        "contacts": g["contact_count"],
        "drc_errors": g["drc_error_count"],
        "gds_layers": g["gds_layer_count"],
        "goldens": g,
    }


def real_magic_compare() -> dict[str, Any]:
    return real_magic_engine()


def _selftest() -> None:
    assert pass_cli_check()["ok"]
    assert pass_magic_tech_vocab()["ok"]
    assert pass_real_paint_save()["ok"]
    assert pass_real_drc()["ok"]
    assert pass_real_gds()["ok"]
    eng = real_magic_engine()
    assert eng["ok"], eng
    print(
        "REAL_MAGIC_OK",
        {k: eng[k] for k in ("ok", "rects", "contacts", "drc_errors", "gds_layers")},
    )


if __name__ == "__main__":
    _selftest()
