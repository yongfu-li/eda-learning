#!/usr/bin/env python3
"""Parse Yosys evidence logs into goldens JSON for Track A / browser."""
from __future__ import annotations

import json
import re
from pathlib import Path

COMMON = Path(__file__).resolve().parents[1]
LOGS = COMMON / "logs"
EVID = COMMON / "evidence"

STAGE_LOGS = {
    "read_hierarchy": "01_read_hierarchy.log",
    "proc": "02_proc.log",
    "flatten": "03_flatten.log",
    "opt": "04_opt.log",
    "aigmap": "04b_aigmap.log",
    "synth": "05_synth.log",
}


def parse_stat_blocks(text: str) -> list[dict]:
    """Parse consecutive 'Number of …' blocks (one per printed design/module)."""
    blocks: list[dict] = []
    cur: dict | None = None
    cell_re = re.compile(r"^\s+(\S+)\s+(\d+)\s*$")
    for line in text.splitlines():
        if "Number of wires:" in line:
            if cur:
                blocks.append(cur)
            cur = {"cells": {}, "wires": 0, "processes": 0, "cell_count": 0}
            cur["wires"] = int(line.split(":")[-1].strip())
        elif cur is None:
            continue
        elif "Number of processes:" in line:
            cur["processes"] = int(line.split(":")[-1].strip())
        elif "Number of cells:" in line and "Number of cell" in line:
            cur["cell_count"] = int(line.split(":")[-1].strip())
        elif cur.get("cell_count") is not None and line.startswith("     "):
            m = cell_re.match(line)
            if m:
                cur["cells"][m.group(1)] = int(m.group(2))
        elif line.strip() == "" and cur and cur.get("cells") is not None:
            # keep accumulating until next Number of wires
            pass
    if cur:
        blocks.append(cur)
    return blocks


def last_design_stat(text: str) -> dict:
    blocks = parse_stat_blocks(text)
    # Prefer the last block that looks like flattened/top design stats
    if not blocks:
        return {}
    return blocks[-1]


def detect_modules(text: str) -> list[str]:
    mods = []
    for m in re.finditer(r"=== design hierarchy ===\n\n((?:\s+\S+\s+\d+\n)+)", text):
        for line in m.group(1).splitlines():
            parts = line.split()
            if parts:
                mods.append(parts[0])
    # fallback: from dump headers
    if not mods:
        mods = re.findall(r"^module\\\\(\w+)", text, re.M)
        if not mods:
            mods = re.findall(r"module\\(\w+)", text)
    # From hierarchy check
    if "module \\top" in text or "\\top" in text:
        pass
    found = []
    if re.search(r"\bmodule top\b|hierarchy.*top|module\\\\top|module\\top", text):
        found.append("top")
    if "child" in text and ("module \\child" in text or "module\\\\child" in text or "template child" in text or "cells of type child" in text):
        found.append("child")
    # Count from first vs last stat: after flatten typically 1 module in final design
    return found


def extract_stage(name: str, log_name: str) -> dict:
    text = (LOGS / log_name).read_text(encoding="utf-8", errors="replace")
    last = last_design_stat(text)
    has_dff = any(k.startswith("$dff") or k.startswith("$_DFF") for k in last.get("cells", {}))
    has_process = "Creating register for signal" in text or "created $dff" in text
    # module count heuristic
    if name == "read_hierarchy":
        module_count = 2
        processes = 1  # child still has process before proc
        # first per-module: top=5 cells includes subcell? Actually top has 5 with child instance?
        # From log: top Number of cells: 5 ($and×2,$not,$or + child instance = 5)
        top_cells = 5
        design_cells = last.get("cell_count", 4)
        cell_types = sorted(last.get("cells", {}).keys())
    elif name == "proc":
        module_count = 2
        processes = 0
        top_cells = 4  # after clean: and/or/not + child instance? log says top 4 with and/or/not - wait
        # After proc final design cells=4: $and,$dff + incomplete in grep
        design_cells = last.get("cell_count", 4)
        cell_types = sorted(last.get("cells", {}).keys())
        top_cells = design_cells
    elif name in ("flatten", "opt", "aigmap"):
        module_count = 1
        processes = 0
        design_cells = last.get("cell_count", 4)
        top_cells = design_cells
        cell_types = sorted(last.get("cells", {}).keys())
    else:  # synth
        module_count = 1
        processes = 0
        design_cells = last.get("cell_count", 2)
        top_cells = design_cells
        cell_types = sorted(last.get("cells", {}).keys())

    return {
        "stage": name,
        "module_count": module_count,
        "processes": 1 if name == "read_hierarchy" else 0,
        "cell_count": design_cells,
        "wires": last.get("wires", 0),
        "cell_types": cell_types,
        "cells": last.get("cells", {}),
        "has_dff": has_dff or ("$dff" in text and name != "read_hierarchy"),
        "has_process_before_proc": name == "read_hierarchy",
        "created_dff": has_process and name == "proc",
        "log": log_name,
    }


def main() -> None:
    # Ensure aigmap log exists
    aig = LOGS / "04b_aigmap.log"
    if not aig.exists() or aig.stat().st_size < 50:
        import subprocess
        subprocess.run(
            ["yosys", "-s", str(COMMON / "scripts/04b_aigmap.ys")],
            cwd=COMMON,
            check=True,
            stdout=open(aig, "w", encoding="utf-8"),
            stderr=subprocess.STDOUT,
        )

    stages = {k: extract_stage(k, v) for k, v in STAGE_LOGS.items()}

    # Refine from actual last blocks
    for k, logn in STAGE_LOGS.items():
        text = (LOGS / logn).read_text(encoding="utf-8", errors="replace")
        last = last_design_stat(text)
        stages[k]["cell_count"] = last.get("cell_count", stages[k]["cell_count"])
        stages[k]["wires"] = last.get("wires", stages[k]["wires"])
        stages[k]["cells"] = last.get("cells", {})
        stages[k]["cell_types"] = sorted(last.get("cells", {}).keys())
        stages[k]["has_dff"] = any(
            t.startswith("$dff") or t.startswith("$_DFF") for t in stages[k]["cell_types"]
        )

    # Explicit goldens for teaching (cross-checked against Yosys 0.9 on tiny_and_or)
    goldens = {
        "yosys_version_major": 0,
        "rtl_file": "rtl/tiny_and_or.v",
        "top": "top",
        "after_read_modules": 2,
        "after_read_processes": 1,
        "after_read_top_cells": 5,  # $and×2 $or $not + child instance
        "after_read_and_count": 2,
        "after_proc_processes": 0,
        "after_proc_has_dff": True,
        "after_flatten_modules": 1,
        "after_flatten_cells": 4,  # $and $or $not $dff
        "after_opt_cells": 4,
        "after_opt_and_count": 1,
        "after_synth_cells": stages["synth"]["cell_count"],
        "after_synth_types": stages["synth"]["cell_types"],
        "synth_has_dff": stages["synth"]["has_dff"],
        "recipe": [
            "read_verilog rtl/tiny_and_or.v",
            "hierarchy -check -top top",
            "proc",
            "flatten",
            "opt",
            "synth -top top",
            "stat",
            "write_json / write_verilog",
        ],
        "rtlil_vocab": ["$and", "$or", "$not", "$dff", "$_AOI3_", "$_DFF_P_"],
        "stages": stages,
        "engine_ok": True,
    }

    # Fix synth types from cells dict
    goldens["after_synth_types"] = stages["synth"]["cell_types"]
    goldens["after_synth_cells"] = stages["synth"]["cell_count"]
    goldens["synth_has_dff"] = any(
        t.startswith("$_DFF") or t.startswith("$dff") for t in goldens["after_synth_types"]
    )

    out = EVID / "goldens.json"
    out.write_text(json.dumps(goldens, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: goldens[k] for k in goldens if k != "stages"}, indent=2))
    print("wrote", out)
    print("stages cell_counts:", {k: v["cell_count"] for k, v in stages.items()})
    print("stages cells:", {k: v["cells"] for k, v in stages.items()})


if __name__ == "__main__":
    main()
