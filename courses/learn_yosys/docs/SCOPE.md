# Scope

**Part A (literacy toys):** named pass ideas on `tiny_yosys.json` — proc/flatten/opt/strash/rewrite/techmap toys that mirror `learn_synthesis` concepts. These are **not** the Yosys binary.

**Part B (real Yosys evidence):** CLI + `.ys` scripts on `rtl/tiny_and_or.v` — `read_verilog`, `hierarchy`, `proc`, `flatten`, `opt`, `aigmap`, `synth`, `stat`, `write_*`, RTLIL vocabulary (`$and`/`$dff`/`$_AOI3_`…), checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**In:** Yosys pass order literacy (toy) + real CLI/RTLIL/synth evidence on the tiny design.

**Out:** Industrial Liberty techmap, FPGA `synth_ice40`/`synth_xilinx` deep dives, ABC internals, memory/FSM advanced passes (future modules), OpenROAD P&R (see `learn_openroad`).
