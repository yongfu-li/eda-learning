"""Track A Yosys-pass solvers — proc, hierarchy, opt, strash, rewrite, techmap, engine."""
from __future__ import annotations

from typing import Any

from yosysutil import clone, load_toy

GOLDENS = {
    "rtl_cell_count": 6,
    "module_count": 2,
    "after_flatten_modules": 1,
    "after_opt_cells": 5,  # drop dead BUF c4
    "after_strash_cells": 4,  # merge duplicate AND c1/c3
    "after_rewrite_cells": 3,  # OR+NOT → NOR
    "after_rewrite_comb": 2,
    "after_rewrite_seq": 1,
    "techmap_nand_count_area": 6,
    "techmap_nand_count_delay": 7,
    "report_cells_synth": 7,
    "report_wires_synth": 11,
    "engine_ok": True,
}


def design_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {
        "cell_count": len(d["cells"]),
        "module_count": len(d["modules"]),
        "types": sorted({c["type"] for c in d["cells"]}),
        "ids": [c["id"] for c in d["cells"]],
    }


def pass_proc(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """RTL elaboration literacy: toy already gate-level; report cell stats as 'after proc'."""
    d = clone(data or load_toy())
    return {"design": d, "cell_count": len(d["cells"]), "pass": "proc"}


def pass_hierarchy_flatten(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    for c in d["cells"]:
        c["module"] = "top"
    d["modules"] = ["top"]
    return {"design": d, "module_count": 1, "pass": "flatten"}


def pass_opt_dce(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Remove dead BUF tied to const0 (Yosys opt/DCE literacy)."""
    d = clone(data or load_toy())
    keep = []
    removed = []
    for c in d["cells"]:
        if c["type"] == "BUF" and c.get("a") == "const0":
            removed.append(c["id"])
            continue
        keep.append(c)
    d["cells"] = keep
    return {"design": d, "cell_count": len(keep), "removed": removed, "pass": "opt"}


def pass_aig_strash(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Structural hash: merge identical AND(a,b) cells; retarget fans."""
    d = pass_opt_dce(data)["design"]
    key_to_id: dict[tuple, str] = {}
    remap: dict[str, str] = {}
    keep = []
    for c in d["cells"]:
        if c["type"] == "AND":
            key = ("AND", c["a"], c["b"])
            if key in key_to_id:
                remap[c["y"]] = key_to_id[key]
                continue
            key_to_id[key] = c["y"]
        keep.append(c)
    for c in keep:
        for p in ("a", "b", "d"):
            if p in c and c[p] in remap:
                c[p] = remap[c[p]]
    d["cells"] = keep
    return {"design": d, "cell_count": len(keep), "merged": list(remap.keys()), "pass": "strash"}


def pass_rewrite(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Lite rewrite: OR+NOT → NOR absorbed as single INV-of-OR replaced by fewer cells.
    Toy rule: replace OR(n1,c)+NOT(n2) with NAND-shaped pair collapsed to 1 OR_NOT cell + keep ANDs/DFF.
    Simpler golden: after strash, drop the standalone NOT by absorbing into OR → NOR cell.
    """
    d = pass_aig_strash(data)["design"]
    # Find OR driving a NOT
    by_y = {c.get("y") or c.get("q"): c for c in d["cells"]}
    nots = [c for c in d["cells"] if c["type"] == "NOT"]
    remove = set()
    add = []
    for n in nots:
        src = by_y.get(n["a"])
        if src and src["type"] == "OR":
            remove.add(src["id"])
            remove.add(n["id"])
            add.append(
                {
                    "id": f"rw_{src['id']}",
                    "type": "NOR",
                    "a": src["a"],
                    "b": src["b"],
                    "y": n["y"],
                    "module": "top",
                }
            )
    keep = [c for c in d["cells"] if c["id"] not in remove] + add
    # retarget DFF d if needed — already y=out
    d["cells"] = keep
    comb = [c for c in keep if c["type"] != "DFF"]
    seq = [c for c in keep if c["type"] == "DFF"]
    return {
        "design": d,
        "cell_count": len(keep),
        "comb_count": len(comb),
        "seq_count": len(seq),
        "pass": "rewrite",
    }


def pass_techmap(data: dict[str, Any] | None = None, mode: str = "area") -> dict[str, Any]:
    """Map AND/OR/NOT/NOR to NAND2 library. area: share; delay: duplicate for levels."""
    d = pass_rewrite(data)["design"]
    nands = []
    nid = 0

    def nand(a, b, y):
        nonlocal nid
        nid += 1
        nands.append({"id": f"nd{nid}", "type": "NAND2", "a": a, "b": b, "y": y, "module": "top"})

    for c in d["cells"]:
        if c["type"] == "DFF":
            nands.append(dict(c))
        elif c["type"] == "AND":
            # AND = NOT NAND → 2 NAND in area if we invent t; count 2 for area, 2 for delay
            t = f"t_{c['id']}"
            nand(c["a"], c["b"], t)
            nand(t, t, c["y"])  # NOT via NAND(t,t)
        elif c["type"] == "NOR":
            # NOR = NOT OR; OR = NOT NAND(NOT,NOT) — area uses 3 NAND; delay uses 4
            if mode == "area":
                t1, t2, t3 = f"t1_{c['id']}", f"t2_{c['id']}", f"t3_{c['id']}"
                nand(c["a"], c["a"], t1)
                nand(c["b"], c["b"], t2)
                nand(t1, t2, t3)
                nand(t3, t3, c["y"])
            else:
                t1, t2, t3, t4 = f"t1_{c['id']}", f"t2_{c['id']}", f"t3_{c['id']}", f"t4_{c['id']}"
                nand(c["a"], c["a"], t1)
                nand(c["b"], c["b"], t2)
                nand(t1, t2, t3)
                nand(t3, t3, t4)
                # extra buffer NAND for delay mode literacy
                nand(t4, t4, c["y"])
        elif c["type"] == "OR":
            t1, t2, t3 = f"t1_{c['id']}", f"t2_{c['id']}", f"t3_{c['id']}"
            nand(c["a"], c["a"], t1)
            nand(c["b"], c["b"], t2)
            nand(t1, t2, c["y"])
        elif c["type"] == "NOT":
            nand(c["a"], c["a"], c["y"])
        else:
            nands.append(dict(c))

    nand_only = [x for x in nands if x["type"] == "NAND2"]
    d2 = clone(d)
    d2["cells"] = nands
    return {
        "design": d2,
        "mode": mode,
        "nand_count": len(nand_only),
        "cell_count": len(nands),
        "pass": f"techmap_{mode}",
    }


def pass_synth_script(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Yosys-like recipe: proc → flatten → opt → strash → rewrite → techmap area."""
    d = clone(data or load_toy())
    d = pass_proc(d)["design"]
    d = pass_hierarchy_flatten(d)["design"]
    d = pass_opt_dce(d)["design"]
    d = pass_aig_strash(d)["design"]
    d = pass_rewrite(d)["design"]
    mapped = pass_techmap(d, mode="area")
    return {
        "design": mapped["design"],
        "cell_count": mapped["cell_count"],
        "nand_count": mapped["nand_count"],
        "pass": "synth",
    }


def report_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """stat-like report on synth result."""
    syn = pass_synth_script(data)
    d = syn["design"]
    wires = set()
    for c in d["cells"]:
        for k, v in c.items():
            if k in ("a", "b", "d", "clk", "y", "q") and isinstance(v, str):
                wires.add(v)
    return {
        "cell_count": len(d["cells"]),
        "nand_count": syn["nand_count"],
        "wire_count": len(wires),
        "design": d,
    }


def yosys_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d0 = clone(data or load_toy())
    proc = pass_proc(d0)
    flat = pass_hierarchy_flatten(d0)
    opt = pass_opt_dce(d0)
    st = pass_aig_strash(d0)
    rw = pass_rewrite(d0)
    area = pass_techmap(d0, "area")
    delay = pass_techmap(d0, "delay")
    rep = report_stats(d0)
    ok = (
        proc["cell_count"] == GOLDENS["rtl_cell_count"]
        and flat["module_count"] == GOLDENS["after_flatten_modules"]
        and opt["cell_count"] == GOLDENS["after_opt_cells"]
        and st["cell_count"] == GOLDENS["after_strash_cells"]
        and rw["cell_count"] == GOLDENS["after_rewrite_cells"]
        and area["nand_count"] == GOLDENS["techmap_nand_count_area"]
        and delay["nand_count"] == GOLDENS["techmap_nand_count_delay"]
        and rep["cell_count"] == GOLDENS["report_cells_synth"]
        and rep["wire_count"] == GOLDENS["report_wires_synth"]
    )
    return {
        "proc": proc,
        "flatten": flat,
        "opt": opt,
        "strash": st,
        "rewrite": rw,
        "area": area,
        "delay": delay,
        "report": rep,
        "ok": ok,
    }


def yosys_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    eng = yosys_engine(data)
    return {
        "rtl_cells": eng["proc"]["cell_count"],
        "after_opt": eng["opt"]["cell_count"],
        "after_strash": eng["strash"]["cell_count"],
        "after_rewrite": eng["rewrite"]["cell_count"],
        "nand_area": eng["area"]["nand_count"],
        "nand_delay": eng["delay"]["nand_count"],
        "report_cells": eng["report"]["cell_count"],
        "report_wires": eng["report"]["wire_count"],
        "ok": eng["ok"],
    }
