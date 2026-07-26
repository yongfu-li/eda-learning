"""Track A real-Yosys evidence solvers — CLI recipe, RTLIL stages, synth goldens."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"

# Stable command ids used by browser lab + Track A
CMD_IDS = [
    "read_verilog",
    "hierarchy",
    "proc",
    "flatten",
    "opt",
    "aigmap",
    "synth",
    "stat",
    "write",
]

GOLDEN_RECIPE_IDS = [
    "read_verilog",
    "hierarchy",
    "proc",
    "flatten",
    "opt",
    "synth",
    "stat",
    "write",
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
    """CLI literacy: correct early recipe order read→hierarchy→proc."""
    g = load_goldens()
    ids = learner_ids if learner_ids is not None else GOLDEN_RECIPE_IDS[:3]
    ok = recipe_prefix_ok(ids, 3)
    return {
        "ok": ok,
        "learner": ids,
        "want": GOLDEN_RECIPE_IDS[:3],
        "yosys_invocation": "yosys -s script.ys",
        "rtl": g["rtl_file"],
        "top": g["top"],
    }


def pass_rtlil_vocab() -> dict[str, Any]:
    g = load_goldens()
    rh = stage("read_hierarchy", g)
    return {
        "vocab": list(g["rtlil_vocab"]),
        "after_read_and_count": g["after_read_and_count"],
        "after_read_modules": g["after_read_modules"],
        "after_read_processes": g["after_read_processes"],
        "cell_types": rh["cell_types"],
        "ok": (
            g["after_read_and_count"] == 2
            and g["after_read_modules"] == 2
            and g["after_read_processes"] == 1
            and "$and" in rh["cell_types"]
        ),
    }


def pass_real_proc() -> dict[str, Any]:
    g = load_goldens()
    before = stage("read_hierarchy", g)
    after = stage("proc", g)
    return {
        "before_processes": g["after_read_processes"],
        "after_processes": g["after_proc_processes"],
        "has_dff": g["after_proc_has_dff"],
        "before_types": before["cell_types"],
        "after_types": after["cell_types"],
        "created_dff": "$dff" in after["cell_types"],
        "ok": g["after_proc_processes"] == 0 and g["after_proc_has_dff"] is True,
    }


def pass_real_flatten_opt() -> dict[str, Any]:
    g = load_goldens()
    flat = stage("flatten", g)
    opt = stage("opt", g)
    return {
        "after_flatten_modules": g["after_flatten_modules"],
        "after_flatten_cells": g["after_flatten_cells"],
        "after_opt_cells": g["after_opt_cells"],
        "after_opt_and_count": g["after_opt_and_count"],
        "flatten_types": flat["cell_types"],
        "opt_types": opt["cell_types"],
        "ok": (
            g["after_flatten_modules"] == 1
            and g["after_flatten_cells"] == 4
            and g["after_opt_cells"] == 4
            and g["after_opt_and_count"] == 1
        ),
    }


def pass_aigmap_synth() -> dict[str, Any]:
    g = load_goldens()
    aig = stage("aigmap", g)
    syn = stage("synth", g)
    return {
        "aigmap_cells": aig["cell_count"],
        "aigmap_types": aig["cell_types"],
        "synth_cells": g["after_synth_cells"],
        "synth_types": g["after_synth_types"],
        "synth_has_dff": g["synth_has_dff"],
        "ok": (
            aig["cell_count"] == 7
            and g["after_synth_cells"] == 2
            and "$_AOI3_" in g["after_synth_types"]
            and "$_DFF_P_" in g["after_synth_types"]
        ),
    }


def real_yosys_engine(learner_recipe: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    cli = pass_cli_check(learner_recipe)
    rtlil = pass_rtlil_vocab()
    proc = pass_real_proc()
    flat = pass_real_flatten_opt()
    syn = pass_aigmap_synth()
    recipe_ok = recipe_prefix_ok(learner_recipe or GOLDEN_RECIPE_IDS)
    ok = all([cli["ok"], rtlil["ok"], proc["ok"], flat["ok"], syn["ok"], recipe_ok, g["engine_ok"]])
    return {
        "ok": ok,
        "cli": cli,
        "rtlil": rtlil,
        "proc": proc,
        "flatten_opt": flat,
        "aigmap_synth": syn,
        "recipe_ok": recipe_ok,
        "goldens": {
            "after_read_modules": g["after_read_modules"],
            "after_flatten_cells": g["after_flatten_cells"],
            "after_synth_cells": g["after_synth_cells"],
            "after_synth_types": g["after_synth_types"],
        },
    }


def real_yosys_compare() -> dict[str, Any]:
    eng = real_yosys_engine()
    g = load_goldens()
    return {
        "ok": eng["ok"],
        "after_read_modules": g["after_read_modules"],
        "after_read_and_count": g["after_read_and_count"],
        "after_proc_has_dff": g["after_proc_has_dff"],
        "after_flatten_cells": g["after_flatten_cells"],
        "after_opt_and_count": g["after_opt_and_count"],
        "aigmap_cells": g["stages"]["aigmap"]["cell_count"],
        "after_synth_cells": g["after_synth_cells"],
        "after_synth_types": g["after_synth_types"],
    }


def _selftest() -> None:
    assert pass_cli_check()["ok"]
    assert pass_rtlil_vocab()["ok"]
    assert pass_real_proc()["ok"]
    assert pass_real_flatten_opt()["ok"]
    assert pass_aigmap_synth()["ok"]
    assert real_yosys_engine()["ok"]
    assert not pass_cli_check(["proc", "read_verilog", "hierarchy"])["ok"]
    print("REAL_YOSYS_ALL_OK", real_yosys_compare())


if __name__ == "__main__":
    _selftest()
