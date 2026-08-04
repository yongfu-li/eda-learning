# Scope

**Part A (layout / DRC / GDS map):** interactive Magic map on `tiny_magic.json` — paint layers, box select, contact, DRC width check, GDS layer map. Same *names* and order as Magic; browser IR for learning before/alongside the binary.

**Part B (real Magic evidence):** CLI + `.magicrc` / Tcl on a tiny layout — paint, save, `drc check`, `gds write`, checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on layout JSON via `common/algo_solvers.py` — paint connectivity, DRC region scan, extract, engine — bound to real Magic report stats via `partc_bind.py` when the binary is available.

**Part D (internals / contribute):** orientation to the Magic C tree — Tile / Plane / DRC / cifwrite — plus a contribute checklist. Not a reimplementation of Magic.

**Prereq:** `learn_digital` (layout literacy) and ideally `learn_yosys` (netlist → layout flow).

**In:** Magic tool literacy for OpenLane/OpenROAD users — map → CLI evidence → algorithms bound to DRC/GDS → internals orientation.

**Out:** Full PDK DRC rule decks, advanced extraction (`learn_pex`), KLayout scripting (`learn_klayout`), OpenROAD PnR (`learn_openroad`), OpenLane orchestration (`learn_openlane`).
