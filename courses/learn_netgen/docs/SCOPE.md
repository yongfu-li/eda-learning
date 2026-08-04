# Scope

**Part A (LVS compare map):** interactive Netgen map on `tiny_netgen.json` — read netlists, device classes, flatten/permute, compare nets, LVS report. Same *names* and order as Netgen; browser IR for learning before/alongside the binary.

**Part B (real Netgen evidence):** CLI + Tcl on tiny_inv SPICE netlists — read sch/lay, compare, report, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on netlist JSON via `common/algo_solvers.py` — hash devices, match nets, permute pins, engine — bound to real Netgen report stats via `partc_bind.py`.

**Part D (internals / contribute):** orientation to the Netgen C tree — Obj / Netlist / Element — plus a contribute checklist. Not a reimplementation of Netgen.

**Prereq:** `learn_lvs` or `learn_magic` (layout + LVS literacy).

**In:** Netgen tool literacy for OpenLane users — map → CLI evidence → algorithms bound to LVS → internals orientation.

**Out:** Full PDK LVS decks, advanced extraction (`learn_pex`), KLayout scripting (`learn_klayout`), OpenROAD PnR (`learn_openroad`).
