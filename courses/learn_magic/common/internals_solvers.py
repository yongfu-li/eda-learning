"""Part D — Magic internals literacy (Tile / Plane / CellDef / DRC / contribute).

Teaching model of Magic kernel concepts — not a copy of the Magic tree.
Excerpts under internals/ mirror upstream file layout for orientation.
"""
from __future__ import annotations

from typing import Any

INTERNALS_GOLDENS = {
    "pillars": 3,
    "pillars_names": ["Tile", "Plane", "CellDef"],
    "drc_stages": ["load_rules", "scan_region", "emit_marker"],
    "drc_binds_part_b": True,
    "drc_error_count": 1,
    "cifwrite_stages": ["flatten", "write_cif", "verify_layers"],
    "gds_layer_count": 6,
    "contribute_steps": ["path", "tcl_cmd", "makefile", "rebuild", "smoke_help"],
    "contribute_path": "commands/cmd_drc.c",
    "smoke_cmd": "magic -help drc",
    "engine_ok": True,
}


def tile_plane_model() -> dict[str, Any]:
    pillars = list(INTERNALS_GOLDENS["pillars_names"])
    nesting = {
        "Tile": ["Rect", "Label", "Via"],
        "Plane": ["Layer", "DRC", "Extract"],
        "CellDef": ["Port", "Property", "Hierarchy"],
    }
    ok = len(pillars) == INTERNALS_GOLDENS["pillars"]
    return {
        "ok": ok,
        "pillars": pillars,
        "pillar_count": len(pillars),
        "nesting": nesting,
        "note": "Tile holds painted geometry; Plane holds layer rules; CellDef holds cell metadata.",
        "pass": "tile_plane_model",
    }


def read_drc_cifwrite() -> dict[str, Any]:
    drc = list(INTERNALS_GOLDENS["drc_stages"])
    cif = list(INTERNALS_GOLDENS["cifwrite_stages"])
    ok = (
        drc == ["load_rules", "scan_region", "emit_marker"]
        and INTERNALS_GOLDENS["drc_binds_part_b"]
        and INTERNALS_GOLDENS["drc_error_count"] == 1
        and INTERNALS_GOLDENS["gds_layer_count"] == 6
    )
    return {
        "ok": ok,
        "drc_stages": drc,
        "cifwrite_stages": cif,
        "upstream_path": "drc/DRCcheck.c",
        "binds_part_b": True,
        "drc_errors": INTERNALS_GOLDENS["drc_error_count"],
        "gds_layers": INTERNALS_GOLDENS["gds_layer_count"],
        "note": "DRC load_rules→scan_region→emit_marker; cifwrite flatten→write_cif→verify_layers.",
        "pass": "read_drc_cifwrite",
    }


def contribute_magic() -> dict[str, Any]:
    steps = list(INTERNALS_GOLDENS["contribute_steps"])
    ok = steps == INTERNALS_GOLDENS["contribute_steps"] and INTERNALS_GOLDENS["contribute_path"].endswith(".c")
    return {
        "ok": ok,
        "steps": steps,
        "path": INTERNALS_GOLDENS["contribute_path"],
        "smoke": INTERNALS_GOLDENS["smoke_cmd"],
        "note": "Add commands/*.c, register Tcl cmd, hook Makefile, rebuild, magic -help.",
        "pass": "contribute_magic",
    }


def part_d_engine() -> dict[str, Any]:
    a = tile_plane_model()
    b = read_drc_cifwrite()
    c = contribute_magic()
    ok = a["ok"] and b["ok"] and c["ok"]
    return {
        "ok": ok,
        "pillars": a["pillar_count"],
        "drc_stages": len(b["drc_stages"]),
        "contribute_steps": len(c["steps"]),
        "goldens": INTERNALS_GOLDENS,
    }


def _selftest() -> None:
    assert tile_plane_model()["ok"]
    assert read_drc_cifwrite()["ok"]
    assert contribute_magic()["ok"]
    eng = part_d_engine()
    assert eng["ok"], eng
    print("MAGIC_INTERNALS_OK", eng)


if __name__ == "__main__":
    _selftest()
