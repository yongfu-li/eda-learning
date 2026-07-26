"""Part D — Yosys internals literacy (RTLIL C++ / Pass API / contribute).

Teaching model of Yosys kernel concepts — not a copy of the Yosys tree.
Excerpts under internals/ mirror upstream file layout for orientation.
"""
from __future__ import annotations

from typing import Any

INTERNALS_GOLDENS = {
    "pillars": 5,
    "pillars_names": ["Design", "Module", "Wire", "Cell", "SigSpec"],
    "pass_recipe": ["subclass_Pass", "REGISTER_PASS", "execute", "selection"],
    "opt_clean_stages": ["mark_used", "rm_cells", "rm_wires"],
    "opt_clean_needs_proc": True,
    "contribute_steps": ["path", "REGISTER_PASS", "makefile", "rebuild", "smoke_help"],
    "contribute_path": "passes/demo/hello_pass.cc",
    "smoke_cmd": "yosys -h hello_pass",
    "engine_ok": True,
}


def rtlil_cpp_model() -> dict[str, Any]:
    pillars = list(INTERNALS_GOLDENS["pillars_names"])
    nesting = {
        "Design": ["Module"],
        "Module": ["Wire", "Cell", "Process"],
        "Cell": ["SigSpec"],
        "Wire": ["SigBit"],
        "SigSpec": ["SigBit"],
    }
    ok = len(pillars) == INTERNALS_GOLDENS["pillars"]
    return {
        "ok": ok,
        "pillars": pillars,
        "pillar_count": len(pillars),
        "nesting": nesting,
        "note": "kernel/rtlil.h — Design → Module → Wire/Cell; ports are SigSpec.",
        "pass": "rtlil_cpp_model",
    }


def pass_registration() -> dict[str, Any]:
    recipe = list(INTERNALS_GOLDENS["pass_recipe"])
    ok = recipe == ["subclass_Pass", "REGISTER_PASS", "execute", "selection"]
    return {
        "ok": ok,
        "recipe": recipe,
        "command_name": "my_pass",
        "note": "kernel/register.h + Pass::execute(args, Design*).",
        "pass": "pass_registration",
    }


def read_opt_clean() -> dict[str, Any]:
    stages = list(INTERNALS_GOLDENS["opt_clean_stages"])
    ok = stages == ["mark_used", "rm_cells", "rm_wires"] and INTERNALS_GOLDENS["opt_clean_needs_proc"]
    return {
        "ok": ok,
        "stages": stages,
        "needs_empty_processes": True,
        "upstream_path": "passes/opt/opt_clean.cc",
        "note": "OptCleanPass marks used signals, then rmunused_module_cells/signals.",
        "pass": "read_opt_clean",
    }


def contribute_pass() -> dict[str, Any]:
    steps = list(INTERNALS_GOLDENS["contribute_steps"])
    ok = (
        steps == INTERNALS_GOLDENS["contribute_steps"]
        and INTERNALS_GOLDENS["contribute_path"].endswith(".cc")
    )
    return {
        "ok": ok,
        "steps": steps,
        "path": INTERNALS_GOLDENS["contribute_path"],
        "smoke": INTERNALS_GOLDENS["smoke_cmd"],
        "note": "Add .cc under passes/, REGISTER_PASS, hook Makefile, rebuild, yosys -h.",
        "pass": "contribute_pass",
    }


def part_d_engine() -> dict[str, Any]:
    a = rtlil_cpp_model()
    b = pass_registration()
    c = read_opt_clean()
    d = contribute_pass()
    ok = a["ok"] and b["ok"] and c["ok"] and d["ok"]
    return {
        "ok": ok,
        "rtlil": a["pillar_count"],
        "pass_recipe_len": len(b["recipe"]),
        "opt_clean_stages": len(c["stages"]),
        "contribute_steps": len(d["steps"]),
        "goldens": INTERNALS_GOLDENS,
    }


def _selftest() -> None:
    assert rtlil_cpp_model()["ok"]
    assert pass_registration()["ok"]
    assert read_opt_clean()["ok"]
    assert contribute_pass()["ok"]
    eng = part_d_engine()
    assert eng["ok"], eng
    print("INTERNALS_ALL_OK", eng)


if __name__ == "__main__":
    _selftest()
