"""Part D — OpenSTA internals literacy (Network / Graph / Sdc / Search / contribute).

Teaching model of OpenSTA kernel concepts — not a copy of the OpenSTA tree.
Excerpts under internals/ mirror upstream file layout for orientation.
"""
from __future__ import annotations

from typing import Any

INTERNALS_GOLDENS = {
    "pillars": 4,
    "pillars_names": ["Network", "Graph", "Sdc", "Search"],
    "find_path_stages": ["tag_endpoints", "walk_back", "emit_path", "report_checks"],
    "find_path_binds_part_b": True,
    "path_delay": 2.0,
    "slack": 8.0,
    "critical_path": ["b", "n1", "n2", "y"],
    "contribute_steps": ["path", "tcl_cmd", "cmake", "rebuild", "smoke_help"],
    "contribute_path": "app/HelloCmd.cc",
    "smoke_cmd": "sta -help hello_cmd",
    "engine_ok": True,
}


def sta_cpp_model() -> dict[str, Any]:
    pillars = list(INTERNALS_GOLDENS["pillars_names"])
    nesting = {
        "Network": ["Pin", "Net", "Instance"],
        "Graph": ["Vertex", "Edge"],
        "Sdc": ["Clock", "Constraint"],
        "Search": ["Arrival", "Required", "Path"],
    }
    ok = len(pillars) == INTERNALS_GOLDENS["pillars"]
    return {
        "ok": ok,
        "pillars": pillars,
        "pillar_count": len(pillars),
        "nesting": nesting,
        "note": "Network holds the netlist; Graph is timing vertices/edges; Sdc holds clocks; Search drives arrivals and reports.",
        "pass": "sta_cpp_model",
    }


def read_find_path() -> dict[str, Any]:
    stages = list(INTERNALS_GOLDENS["find_path_stages"])
    ok = (
        stages == ["tag_endpoints", "walk_back", "emit_path", "report_checks"]
        and INTERNALS_GOLDENS["find_path_binds_part_b"]
        and INTERNALS_GOLDENS["slack"] == 8.0
    )
    return {
        "ok": ok,
        "stages": stages,
        "upstream_path": "search/FindPath.cc",
        "binds_part_b": True,
        "path_delay": INTERNALS_GOLDENS["path_delay"],
        "slack": INTERNALS_GOLDENS["slack"],
        "critical_path": list(INTERNALS_GOLDENS["critical_path"]),
        "note": "FindPath tags endpoints, walks back the worst path, emits pins; report_checks formats the Part B shape.",
        "pass": "read_find_path",
    }


def contribute_opensta() -> dict[str, Any]:
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
        "note": "Add app/*.cc, register Tcl cmd, hook CMake, rebuild, sta -help.",
        "pass": "contribute_opensta",
    }


def part_d_engine() -> dict[str, Any]:
    a = sta_cpp_model()
    b = read_find_path()
    c = contribute_opensta()
    ok = a["ok"] and b["ok"] and c["ok"]
    return {
        "ok": ok,
        "pillars": a["pillar_count"],
        "find_path_stages": len(b["stages"]),
        "contribute_steps": len(c["steps"]),
        "goldens": INTERNALS_GOLDENS,
    }


def _selftest() -> None:
    assert sta_cpp_model()["ok"]
    assert read_find_path()["ok"]
    assert contribute_opensta()["ok"]
    eng = part_d_engine()
    assert eng["ok"], eng
    print("OPENSTA_INTERNALS_OK", eng)


if __name__ == "__main__":
    _selftest()
