# Scope

**Part A (report / graph map):** interactive timing map on a tiny netlist — clocks, arrivals, required, slack, `report_checks` shape. Same *names* and order as OpenSTA; browser IR for learning before/alongside the binary.

**Part B (real OpenSTA evidence):** CLI + `.tcl` scripts on a tiny Verilog + liberty-lite — `read_liberty`, `read_verilog`, `link_design`, `create_clock`, `report_checks`, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on a timing-graph JSON via `common/algo_solvers.py` — graph build, levelize, propagate, slack, critical path — bound to real OpenSTA report stats via `partc_bind.py` when the binary is available.

**Part D (internals / contribute):** orientation to the OpenSTA C++ tree — Network / Graph / Sdc / Search — plus a contribute checklist. Not a reimplementation of OpenSTA.

**Prereq:** `learn_sta` (algorithms) and ideally `learn_yosys` (netlist literacy).

**In:** OpenSTA tool literacy for OpenLane/OpenROAD users — map → CLI evidence → algorithms bound to reports → internals orientation.

**Out:** Full Liberty characterization, multi-corner OCV deep dives, SI/crosstalk engines (`learn_si`), OpenROAD PnR (`learn_openroad`), OpenLane orchestration (`learn_openlane`).
