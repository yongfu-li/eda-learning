#!/usr/bin/env python3
"""Parse Part C Yosys logs → evidence/partc/goldens.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

COMMON = Path(__file__).resolve().parents[1]
LOGS = COMMON / "logs" / "partc"
OUT = COMMON / "evidence" / "partc" / "goldens.json"


def last_stat(text: str) -> dict:
    cells: dict[str, int] = {}
    cell_count = processes = wires = 0
    cur_cells: dict[str, int] = {}
    cur_cc = cur_pr = cur_w = 0
    cell_re = re.compile(r"^\s+(\S+)\s+(\d+)\s*$")
    for line in text.splitlines():
        if "Number of wires:" in line:
            if cur_cc or cur_cells:
                cells, cell_count, processes, wires = cur_cells, cur_cc, cur_pr, cur_w
            cur_cells, cur_cc, cur_pr, cur_w = {}, 0, 0, int(line.split(":")[-1])
        elif "Number of processes:" in line:
            cur_pr = int(line.split(":")[-1])
        elif "Number of cells:" in line:
            cur_cc = int(line.split(":")[-1])
            cur_cells = {}
        elif cur_cc and line.startswith("     "):
            m = cell_re.match(line)
            if m:
                cur_cells[m.group(1)] = int(m.group(2))
    if cur_cc or cur_cells:
        cells, cell_count, processes, wires = cur_cells, cur_cc, cur_pr, cur_w
    return {
        "cell_count": cell_count,
        "processes": processes,
        "wires": wires,
        "cells": cells,
        "types": sorted(cells.keys()),
    }


def mem_params(text: str) -> dict:
    """Parse $mem WIDTH/SIZE/ports from dump."""
    width = size = rd = wr = None
    in_mem = False
    for line in text.splitlines():
        if "cell $mem " in line:
            in_mem = True
            continue
        if in_mem and line.strip().startswith("cell "):
            break
        if in_mem and "end" == line.strip():
            break
        if not in_mem:
            continue
        m = re.search(r"parameter \\(WIDTH|SIZE|RD_PORTS|WR_PORTS)\s+(\d+)", line)
        if m:
            key, val = m.group(1), int(m.group(2))
            if key == "WIDTH":
                width = val
            elif key == "SIZE":
                size = val
            elif key == "RD_PORTS":
                rd = val
            elif key == "WR_PORTS":
                wr = val
    return {"width": width, "size": size, "rd_ports": rd, "wr_ports": wr}


def fsm_params(text: str) -> dict:
    """Parse $fsm STATE_NUM / STATE_BITS / TRANS_NUM from dump."""
    state_num = state_bits = trans_num = None
    in_fsm = False
    for line in text.splitlines():
        if "cell $fsm " in line:
            in_fsm = True
            continue
        if in_fsm and line.strip().startswith("cell "):
            break
        if in_fsm and line.strip() == "end":
            break
        if not in_fsm:
            continue
        m = re.search(r"parameter \\(STATE_NUM|STATE_BITS|TRANS_NUM)\s+(\d+)", line)
        if m:
            key, val = m.group(1), int(m.group(2))
            if key == "STATE_NUM":
                state_num = val
            elif key == "STATE_BITS":
                state_bits = val
            elif key == "TRANS_NUM":
                trans_num = val
    return {"state_num": state_num, "state_bits": state_bits, "trans_num": trans_num}


def main() -> None:
    stages = {}
    for name, logn in [
        ("read", "partc_00_read.log"),
        ("proc_mux", "partc_01_proc_mux.log"),
        ("proc", "partc_02_proc.log"),
        ("opt", "partc_03_opt.log"),
        ("techmap", "partc_04_techmap.log"),
        ("memory", "partc_05_memory.log"),
        ("fsm", "partc_06_fsm.log"),
        ("abc", "partc_07_abc.log"),
        ("extract", "partc_08_extract.log"),
    ]:
        text = (LOGS / logn).read_text(encoding="utf-8", errors="replace")
        stages[name] = last_stat(text)
        stages[name]["log"] = logn

    mem_text = (LOGS / "partc_05_memory.log").read_text(encoding="utf-8", errors="replace")
    fsm_text = (LOGS / "partc_06_fsm.log").read_text(encoding="utf-8", errors="replace")
    mp = mem_params(mem_text)
    fp = fsm_params(fsm_text)
    stages["memory"].update(mp)
    stages["fsm"].update(fp)

    goldens = {
        "rtl": "rtl/tiny_algo.v",
        "rtl_memory": "rtl/tiny_mem.v",
        "rtl_fsm": "rtl/tiny_fsm.v",
        "rtl_extract": "rtl/tiny_extract.v",
        "rtl_extract_map": "rtl/andor2_map.v",
        "top": "tiny_algo",
        "yosys_note": "Evidence from installed Yosys (see logs/partc/). Teaching solvers mirror these moves.",
        "after_read_processes": stages["read"]["processes"],
        "after_read_cells": stages["read"]["cell_count"],
        "after_read_and": stages["read"]["cells"].get("$and", 0),
        "after_proc_mux_mux": stages["proc_mux"]["cells"].get("$mux", 0),
        "after_proc_processes": stages["proc"]["processes"],
        "after_proc_cells": stages["proc"]["cell_count"],
        "after_proc_mux": stages["proc"]["cells"].get("$mux", 0),
        "after_proc_and": stages["proc"]["cells"].get("$and", 0),
        "after_proc_adff": stages["proc"]["cells"].get("$adff", 0),
        "after_opt_cells": stages["opt"]["cell_count"],
        "after_opt_and": stages["opt"]["cells"].get("$and", 0),
        "after_opt_adff": stages["opt"]["cells"].get("$adff", 0),
        "after_techmap_cells": stages["techmap"]["cell_count"],
        "after_techmap_types": stages["techmap"]["types"],
        "after_memory_mem": stages["memory"]["cells"].get("$mem", 0),
        "after_memory_width": mp["width"],
        "after_memory_size": mp["size"],
        "after_memory_rd_ports": mp["rd_ports"],
        "after_memory_wr_ports": mp["wr_ports"],
        "after_fsm_fsm": stages["fsm"]["cells"].get("$fsm", 0),
        "after_fsm_state_num": fp["state_num"],
        "after_fsm_state_bits": fp["state_bits"],
        "after_fsm_trans_num": fp["trans_num"],
        "after_abc_cells": stages["abc"]["cell_count"],
        "after_abc_and": stages["abc"]["cells"].get("$_AND_", 0),
        "after_abc_not": stages["abc"]["cells"].get("$_NOT_", 0),
        "after_abc_adff": stages["abc"]["cells"].get("$adff", 0),
        "after_abc_types": stages["abc"]["types"],
        "after_extract_matches": stages["extract"]["cells"].get("ANDOR2", 0),
        "after_extract_cells": stages["extract"]["cell_count"],
        "after_extract_types": stages["extract"]["types"],
        "stages": stages,
        "bind_ok": True,
    }
    # Sanity for Yosys 0.9
    assert goldens["after_read_processes"] == 2
    assert goldens["after_proc_processes"] == 0
    assert goldens["after_proc_adff"] == 1
    assert goldens["after_proc_mux"] == 1
    assert goldens["after_opt_and"] == 1
    assert goldens["after_memory_mem"] == 1
    assert goldens["after_memory_width"] == 4
    assert goldens["after_memory_size"] == 8
    assert goldens["after_fsm_fsm"] == 1
    assert goldens["after_fsm_state_num"] == 3
    assert goldens["after_fsm_state_bits"] == 2
    assert goldens["after_abc_and"] >= 1
    assert goldens["after_extract_matches"] == 1
    assert "ANDOR2" in goldens["after_extract_types"]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(goldens, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in goldens.items() if k != "stages"}, indent=2))
    print("wrote", OUT)


if __name__ == "__main__":
    main()
