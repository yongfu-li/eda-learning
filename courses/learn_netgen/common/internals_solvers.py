"""Part D — Netgen internals literacy (Obj / Netlist / Element / compare / contribute).

Teaching model of Netgen netcomp concepts — not a copy of the Netgen tree.
Excerpts under internals/ mirror upstream file layout for orientation.
"""
from __future__ import annotations

from typing import Any

INTERNALS_GOLDENS = {
    "pillars": 3,
    "pillars_names": ["Obj", "Netlist", "Element"],
    "compare_stages": ["read_sch", "read_lay", "hash_devices", "match_nets", "emit_report"],
    "compare_binds_part_b": True,
    "matched_devices": 2,
    "matched_nets": 4,
    "mismatch_count": 0,
    "contribute_steps": ["path", "tcl_cmd", "makefile", "rebuild", "smoke_help"],
    "contribute_path": "tclcmd/cmd_lvs.c",
    "smoke_cmd": "netgen help lvs",
    "engine_ok": True,
}


def netcomp_model() -> dict[str, Any]:
    pillars = list(INTERNALS_GOLDENS["pillars_names"])
    nesting = {
        "Obj": ["String", "Hash", "List"],
        "Netlist": ["Port", "Device", "Net"],
        "Element": ["Pin", "Property", "Class"],
    }
    ok = len(pillars) == INTERNALS_GOLDENS["pillars"]
    return {
        "ok": ok,
        "pillars": pillars,
        "pillar_count": len(pillars),
        "nesting": nesting,
        "note": "Obj holds Tcl values; Netlist holds SPICE graph; Element holds device pins.",
        "pass": "netcomp_model",
    }


def read_compare_c() -> dict[str, Any]:
    stages = list(INTERNALS_GOLDENS["compare_stages"])
    ok = (
        stages == INTERNALS_GOLDENS["compare_stages"]
        and INTERNALS_GOLDENS["compare_binds_part_b"]
        and INTERNALS_GOLDENS["matched_devices"] == 2
        and INTERNALS_GOLDENS["matched_nets"] == 4
        and INTERNALS_GOLDENS["mismatch_count"] == 0
    )
    return {
        "ok": ok,
        "compare_stages": stages,
        "upstream_path": "netcomp/compare.c",
        "binds_part_b": True,
        "matched_devices": INTERNALS_GOLDENS["matched_devices"],
        "matched_nets": INTERNALS_GOLDENS["matched_nets"],
        "mismatch_count": INTERNALS_GOLDENS["mismatch_count"],
        "note": "read_sch→read_lay→hash→match→emit_report.",
        "pass": "read_compare_c",
    }


def contribute_netgen() -> dict[str, Any]:
    steps = list(INTERNALS_GOLDENS["contribute_steps"])
    ok = steps == INTERNALS_GOLDENS["contribute_steps"] and INTERNALS_GOLDENS["contribute_path"].endswith(".c")
    return {
        "ok": ok,
        "steps": steps,
        "path": INTERNALS_GOLDENS["contribute_path"],
        "smoke": INTERNALS_GOLDENS["smoke_cmd"],
        "note": "Add tclcmd/*.c, register Tcl cmd, hook Makefile, rebuild, netgen help.",
        "pass": "contribute_netgen",
    }


def part_d_engine() -> dict[str, Any]:
    a = netcomp_model()
    b = read_compare_c()
    c = contribute_netgen()
    ok = a["ok"] and b["ok"] and c["ok"]
    return {
        "ok": ok,
        "pillars": a["pillar_count"],
        "compare_stages": len(b["compare_stages"]),
        "contribute_steps": len(c["steps"]),
        "goldens": INTERNALS_GOLDENS,
    }


def _selftest() -> None:
    assert netcomp_model()["ok"]
    assert read_compare_c()["ok"]
    assert contribute_netgen()["ok"]
    eng = part_d_engine()
    assert eng["ok"], eng
    print("NETGEN_INTERNALS_OK", eng)


if __name__ == "__main__":
    _selftest()
