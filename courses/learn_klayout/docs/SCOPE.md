# Scope

**Part A (viewer/stream/DRC map):** interactive KLayout map on `tiny_klayout.json` — layers view, cell hierarchy, stream GDS, DRC script, markers report. Same *names* and order as KLayout; browser IR for learning before/alongside the binary.

**Part B (real KLayout evidence):** CLI + Ruby DRC on `tiny_rect.gds` — stream, run DRC, markers — checked-in logs under `common/logs/` and goldens in `common/evidence/goldens.json`.

**Part C (algorithms + bind):** teaching algorithms on layout JSON via `common/algo_solvers.py` — layer query, width/spacing, marker emit, engine — bound to real KLayout report stats via `partc_bind.py`.

**Part D (internals / contribute):** orientation to the KLayout C++/Ruby tree — Layout / Cell / Instance — plus a contribute checklist. Not a reimplementation of KLayout.

**Prereq:** `learn_magic` or `learn_drc` (layout + DRC literacy).

**In:** KLayout tool literacy for OpenLane users — map → CLI evidence → algorithms bound to DRC → internals orientation.

**Out:** Full PDK DRC decks (`learn_drc` depth), Magic layout editing (`learn_magic`), OpenROAD PnR (`learn_openroad`), Netgen LVS (`learn_netgen`).

**Overlap:** Topics that also appear in `learn_drc` / `learn_magic` stay in this course as short **See also** pointers (UI + KLayout pipeline here; theory in the linked modules). Do not re-teach full DRC/layout chapters.
