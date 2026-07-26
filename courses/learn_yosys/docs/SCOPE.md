# Scope

**Part A (pass map):** interactive named-pass walkthrough on `tiny_yosys.json` — proc/flatten/opt/strash/rewrite/techmap. Same pass *names* and order as Yosys; browser IR for learning the map before/alongside the binary.

**Part B (real Yosys evidence):** CLI + `.ys` scripts on `rtl/tiny_and_or.v` — `read_verilog`, `hierarchy`, `proc`, `flatten`, `opt`, `aigmap`, `synth`, `stat`, `write_*`, RTLIL vocabulary (`$and`/`$dff`/`$_AOI3_`…), checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on RTLIL-shaped `tiny_algo.json` via `common/algo_solvers.py` — `proc_mux` / `proc_dff` (`$adff`), `opt_*`, techmap, extract (ANDOR2), memory, fsm, ABC handoff, and `yosys_algo_engine`. Bound to real Yosys stats via `partc_bind.py`.

Real Yosys evidence for Part C:
- `rtl/tiny_algo.v` — proc → opt → techmap → aigmap
- `rtl/tiny_extract.v` + `rtl/andor2_map.v` — `extract -map` → `ANDOR2`
- `rtl/tiny_mem.v` — `memory_collect` → `$mem`
- `rtl/tiny_fsm.v` — `fsm_extract` → `$fsm`

**In:** Full learn_yosys path — pass map + real CLI/RTLIL/synth + algorithms bound to Yosys evidence.

**Out:** Industrial Liberty techmap, FPGA `synth_ice40`/`synth_xilinx` deep dives, ABC internals beyond handoff literacy, OpenROAD P&R (see `learn_openroad`). Cloning the full Yosys/ABC C++ codebase in JS.
