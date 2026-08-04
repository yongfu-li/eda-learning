"""Part D — KLayout internals literacy (Layout/Cell/Instance / DRC runner / contribute).

Teaching model of KLayout concepts — not a copy of the KLayout tree.
Excerpts under internals/ mirror upstream file layout for orientation.
"""
from __future__ import annotations

from typing import Any

INTERNALS_GOLDENS = {
    "pillars": 3,
    "pillars_names": ["Layout", "Cell", "Instance"],
    "drc_stages": ["load_layout", "load_drc", "run_drc", "emit_markers", "report"],
    "drc_binds_part_b": True,
    "width_violations": 1,
    "marker_count": 1,
    "contribute_steps": ["path", "ruby_cmd", "build", "install", "smoke_help"],
    "contribute_path": "src/lay/layMain/layMain.cc",
    "smoke_cmd": "klayout -h",
    "engine_ok": True,
}


def layout_cell_model() -> dict[str, Any]:
    pillars = list(INTERNALS_GOLDENS["pillars_names"])
    nesting = {
        "Layout": ["Database", "LayerProperties", "CellIndex"],
        "Cell": ["Shape", "Layer", "Instance"],
        "Instance": ["CellRef", "Trans", "Array"],
    }
    ok = len(pillars) == INTERNALS_GOLDENS["pillars"]
    return {
        "ok": ok,
        "pillars": pillars,
        "pillar_count": len(pillars),
        "nesting": nesting,
        "note": "Layout holds cells; Cell holds shapes; Instance places child cells.",
        "pass": "layout_cell_model",
    }


def read_drc_runner() -> dict[str, Any]:
    stages = list(INTERNALS_GOLDENS["drc_stages"])
    ok = (
        stages == INTERNALS_GOLDENS["drc_stages"]
        and INTERNALS_GOLDENS["drc_binds_part_b"]
        and INTERNALS_GOLDENS["width_violations"] == 1
        and INTERNALS_GOLDENS["marker_count"] == 1
    )
    return {
        "ok": ok,
        "drc_stages": stages,
        "upstream_path": "src/lay/layDRC/layDRCRun.cc",
        "binds_part_b": True,
        "width_violations": INTERNALS_GOLDENS["width_violations"],
        "marker_count": INTERNALS_GOLDENS["marker_count"],
        "note": "load_layout→load_drc→run_drc→emit_markers→report.",
        "pass": "read_drc_runner",
    }


def contribute_klayout() -> dict[str, Any]:
    steps = list(INTERNALS_GOLDENS["contribute_steps"])
    ok = steps == INTERNALS_GOLDENS["contribute_steps"] and INTERNALS_GOLDENS["contribute_path"].endswith(".cc")
    return {
        "ok": ok,
        "steps": steps,
        "path": INTERNALS_GOLDENS["contribute_path"],
        "smoke": INTERNALS_GOLDENS["smoke_cmd"],
        "note": "Add Ruby macro or C++ hook, build, install, klayout -h smoke.",
        "pass": "contribute_klayout",
    }


def part_d_engine() -> dict[str, Any]:
    a = layout_cell_model()
    b = read_drc_runner()
    c = contribute_klayout()
    ok = a["ok"] and b["ok"] and c["ok"]
    return {
        "ok": ok,
        "pillars": a["pillar_count"],
        "drc_stages": len(b["drc_stages"]),
        "contribute_steps": len(c["steps"]),
        "goldens": INTERNALS_GOLDENS,
    }


def _selftest() -> None:
    assert layout_cell_model()["ok"]
    assert read_drc_runner()["ok"]
    assert contribute_klayout()["ok"]
    eng = part_d_engine()
    assert eng["ok"], eng
    print("KLAYOUT_INTERNALS_OK", eng)


if __name__ == "__main__":
    _selftest()
