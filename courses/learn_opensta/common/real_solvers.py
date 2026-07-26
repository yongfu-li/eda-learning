"""Track A real-OpenSTA evidence solvers — CLI recipe + report goldens."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"

GOLDEN_RECIPE_IDS = [
    "read_liberty",
    "read_verilog",
    "link_design",
    "create_clock",
    "set_input_delay",
    "set_output_delay",
    "report_checks",
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
    ids = learner_ids if learner_ids is not None else GOLDEN_RECIPE_IDS[:3]
    ok = recipe_prefix_ok(ids, 3)
    return {
        "ok": ok,
        "learner": ids,
        "want": GOLDEN_RECIPE_IDS[:3],
        "sta_invocation": "sta -no_splash -exit script.tcl",
        "rtl": g["rtl_file"],
        "lib": g["lib_file"],
        "top": g["top"],
    }


def pass_liberty_vocab() -> dict[str, Any]:
    g = load_goldens()
    cells = list(g["liberty_cells"])
    ok = cells == ["AND2", "BUF", "INV"] and g["after_read_cells"] == 3
    return {
        "ok": ok,
        "liberty_cells": cells,
        "after_read_cells": g["after_read_cells"],
        "lib_file": g["lib_file"],
    }


def pass_real_read_netlist() -> dict[str, Any]:
    g = load_goldens()
    rl = stage("read_link", g)
    ok = rl["cell_count"] == 3 and rl["top"] == "tiny_combo" and set(rl["cell_names"]) == {
        "u1",
        "u2",
        "u3",
    }
    return {"ok": ok, **rl}


def pass_real_sdc() -> dict[str, Any]:
    g = load_goldens()
    s = stage("sdc", g)
    ok = s["clock"] == "clk" and float(s["period"]) == 10.0
    return {"ok": ok, **s}


def pass_real_report_checks() -> dict[str, Any]:
    g = load_goldens()
    r = stage("report_checks", g)
    ok = (
        r["endpoint"] == "y"
        and abs(float(r["path_delay"]) - 2.0) < 1e-6
        and abs(float(r["slack"]) - 8.0) < 1e-6
        and r["met"] is True
    )
    return {"ok": ok, **r}


def real_opensta_engine(learner_recipe: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_recipe if learner_recipe is not None else GOLDEN_RECIPE_IDS
    checks = [
        pass_cli_check(ids[:3]),
        pass_liberty_vocab(),
        pass_real_read_netlist(),
        pass_real_sdc(),
        pass_real_report_checks(),
    ]
    ok = all(c["ok"] for c in checks) and recipe_prefix_ok(ids) and g["engine_ok"] is True
    return {
        "ok": ok,
        "recipe_ok": recipe_prefix_ok(ids),
        "cells": g["after_read_cells"],
        "path_delay": g["path_delay"],
        "slack": g["slack"],
        "endpoint": g["endpoint"],
        "goldens": g,
    }


def real_opensta_compare() -> dict[str, Any]:
    return real_opensta_engine()


def _selftest() -> None:
    assert pass_cli_check()["ok"]
    assert pass_liberty_vocab()["ok"]
    assert pass_real_read_netlist()["ok"]
    assert pass_real_sdc()["ok"]
    assert pass_real_report_checks()["ok"]
    eng = real_opensta_engine()
    assert eng["ok"], eng
    print("REAL_OPENSTA_OK", {k: eng[k] for k in ("ok", "cells", "path_delay", "slack", "endpoint")})


if __name__ == "__main__":
    _selftest()
