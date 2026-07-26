"""Bind Part C teaching algorithms to real Yosys evidence (logs/partc)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from algo_solvers import (
    GOLDENS as ALGO_GOLDENS,
    algo_abc_handoff,
    algo_extract_iso,
    algo_fsm_detect,
    algo_memory_map,
    algo_opt_merge,
    algo_proc_dff,
    algo_proc_mux,
    algo_techmap_mapfile,
    yosys_algo_engine,
)

COMMON = Path(__file__).resolve().parent
PARTC = COMMON / "evidence" / "partc" / "goldens.json"


def load_partc() -> dict[str, Any]:
    return json.loads(PARTC.read_text(encoding="utf-8"))


def bind_proc() -> dict[str, Any]:
    """Teaching proc_mux/dff vs real Yosys after_proc goldens."""
    g = load_partc()
    mux = algo_proc_mux()
    dff = algo_proc_dff()
    ok = (
        mux["mux_count"] == ALGO_GOLDENS["proc_mux_cells"]
        and dff["dff_count"] == ALGO_GOLDENS["proc_dff_cells"]
        and dff["has_arst"] is True
        and dff["reg_type"] == "$adff"
        and dff["processes"] == 0
        and g["after_proc_processes"] == 0
        and g["after_proc_adff"] == 1
        and g["after_proc_mux"] == 1
    )
    return {
        "ok": ok,
        "teach": {
            "mux": mux["mux_count"],
            "reg_type": dff["reg_type"],
            "processes": dff["processes"],
        },
        "real": {
            "processes": g["after_proc_processes"],
            "adff": g["after_proc_adff"],
            "mux": g["after_proc_mux"],
            "and": g["after_proc_and"],
            "cells": g["after_proc_cells"],
        },
        "note": "Real Yosys: async reset → $adff; combo if → $mux; processes→0 after proc.",
    }


def bind_opt() -> dict[str, Any]:
    g = load_partc()
    merge = algo_opt_merge()
    ok = (
        merge["and_count"] == ALGO_GOLDENS["opt_merge_cells"]
        and g["after_opt_and"] == 1
        and g["after_opt_adff"] == 1
    )
    return {
        "ok": ok,
        "teach": {"and_count": merge["and_count"], "cell_count": merge["cell_count"]},
        "real": {
            "and": g["after_opt_and"],
            "adff": g["after_opt_adff"],
            "cells": g["after_opt_cells"],
        },
        "note": "Real Yosys opt merges duplicate $and (2→1), keeps $adff/$mux.",
    }


def bind_techmap() -> dict[str, Any]:
    g = load_partc()
    tech = algo_techmap_mapfile()
    real_types = set(g["after_techmap_types"])
    ok = (
        tech["nand_not_count"] == ALGO_GOLDENS["techmap_nand_not_cells"]
        and "$_DFF_PP0_" in real_types
        and "$_MUX_" in real_types
        and "$_AND_" in real_types
    )
    return {
        "ok": ok,
        "teach": {"nand_not": tech["nand_not_count"], "types": tech["types"]},
        "real": {
            "cells": g["after_techmap_cells"],
            "types": g["after_techmap_types"],
        },
        "note": "Real techmap maps to $_AND_/$_MUX_/$_XOR_/$_DFF_PP0_; teach mapfile shows NAND+NOT rule.",
    }


def bind_memory() -> dict[str, Any]:
    g = load_partc()
    mem = algo_memory_map()
    ok = (
        mem["depth"] == ALGO_GOLDENS["memory_depth"]
        and mem["width"] == ALGO_GOLDENS["memory_width"]
        and g["after_memory_mem"] == 1
        and g["after_memory_width"] == 4
        and g["after_memory_size"] == 8
    )
    return {
        "ok": ok,
        "teach": {"width": mem["width"], "depth": mem["depth"], "type": "$mem"},
        "real": {
            "mem": g["after_memory_mem"],
            "width": g["after_memory_width"],
            "size": g["after_memory_size"],
            "rd": g["after_memory_rd_ports"],
            "wr": g["after_memory_wr_ports"],
        },
        "note": "Real Yosys memory_collect → $mem WIDTH=4 SIZE=8 on tiny_mem.v.",
    }


def bind_fsm() -> dict[str, Any]:
    g = load_partc()
    fsm = algo_fsm_detect()
    ok = (
        fsm["states"] == ALGO_GOLDENS["fsm_states"]
        and fsm["encoding_bits"] == ALGO_GOLDENS["fsm_encoding_bits"]
        and g["after_fsm_fsm"] == 1
        and g["after_fsm_state_num"] == 3
        and g["after_fsm_state_bits"] == 2
    )
    return {
        "ok": ok,
        "teach": {
            "states": fsm["states"],
            "transitions": fsm["transitions"],
            "encoding_bits": fsm["encoding_bits"],
        },
        "real": {
            "fsm": g["after_fsm_fsm"],
            "state_num": g["after_fsm_state_num"],
            "state_bits": g["after_fsm_state_bits"],
            "trans_num": g["after_fsm_trans_num"],
        },
        "note": "Real fsm_extract → $fsm STATE_NUM=3 STATE_BITS=2; TRANS_NUM includes stay edges.",
    }


def bind_extract() -> dict[str, Any]:
    g = load_partc()
    ext = algo_extract_iso()
    ok = (
        ext["matches"] == ALGO_GOLDENS["extract_matches"]
        and ext["macro"] == ALGO_GOLDENS["extract_macro"]
        and g["after_extract_matches"] == 1
        and "ANDOR2" in g.get("after_extract_types", [])
    )
    return {
        "ok": ok,
        "teach": {"matches": ext["matches"], "macro": ext["macro"]},
        "real": {
            "matches": g["after_extract_matches"],
            "cells": g["after_extract_cells"],
            "types": g["after_extract_types"],
        },
        "note": "Real extract -map andor2_map.v → ANDOR2×1 on tiny_extract.v.",
    }


def bind_abc() -> dict[str, Any]:
    g = load_partc()
    abc = algo_abc_handoff()
    ok = (
        abc["aig_ands"] == ALGO_GOLDENS["abc_aig_ands"]
        and g["after_abc_and"] >= 1
        and "$adff" in g.get("after_abc_types", [])
    )
    return {
        "ok": ok,
        "teach": {"aig_ands": abc["aig_ands"], "types": abc["cell_types"]},
        "real": {
            "and": g["after_abc_and"],
            "not": g["after_abc_not"],
            "adff": g["after_abc_adff"],
            "cells": g["after_abc_cells"],
            "types": g["after_abc_types"],
        },
        "note": "Teach counts abstract AIG ANDs after opt; real aigmap emits $_AND_/$_NOT_ handoff.",
    }


def bind_all() -> dict[str, Any]:
    proc = bind_proc()
    opt = bind_opt()
    tech = bind_techmap()
    extract = bind_extract()
    mem = bind_memory()
    fsm = bind_fsm()
    abc = bind_abc()
    eng = yosys_algo_engine()
    ok = (
        proc["ok"]
        and opt["ok"]
        and tech["ok"]
        and extract["ok"]
        and mem["ok"]
        and fsm["ok"]
        and abc["ok"]
        and eng["ok"]
    )
    return {
        "ok": ok,
        "proc": proc,
        "opt": opt,
        "techmap": tech,
        "extract": extract,
        "memory": mem,
        "fsm": fsm,
        "abc": abc,
        "algo_engine": eng["ok"],
    }


def _selftest() -> None:
    r = bind_all()
    assert r["ok"], r
    print(
        "BIND_ALL_OK",
        {k: (v if not isinstance(v, dict) else v.get("ok", v)) for k, v in r.items()},
    )


if __name__ == "__main__":
    _selftest()
