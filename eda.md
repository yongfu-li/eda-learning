# EDA course lane (planning)

**Status:** exploratory catalog — **not** wired into [`syllabus.md`](syllabus.md) / `catalog.json` yet.  
**Decision:** keep on *this* learning platform vs a separate EDA/CAD platform.

| | |
|--|--|
| **Intent** | Algorithm / toy-engine **development** literacy — not vendor GUI or “how to click OpenROAD” |
| **Naming** | `learn_<topic>` (no `_engine` suffix); goal/SCOPE states “build mini algorithms” |
| **Tracks (if hosted here)** | **B** browser: step algorithms on tiny graphs/geometry · **A** offline: implement stubs; optional compare to Yosys/Magic/ngspice/OpenROAD |
| **Related today** | Only RTL hygiene (`synth-lint`, `hdl-style`); real synth/P&R called out as offline-only in [`platform/tools.md`](platform/tools.md) |

---

## Product rule

| In scope | Out of scope (v1) |
|----------|-------------------|
| Data structures + core algorithms for each CAD stage | Drop-in Spectre / Calibre / Innovus replacement |
| Tiny instances (tens of cells/shapes) | Full foundry PDK certification |
| Open-source tools as **evidence / golden**, not the syllabus spine | Vendor certification paths |
| Shared IR / geometry primitives | Research ML-EDA depth (optional later course) |

---

## Hub

| Course id | Focus |
|-----------|--------|
| `learn_eda` | Stack map: IR → synth → timing → floorplan/place/CTS/route → DRC/LVS/PEX → SPICE; which `learn_*` to take next |

---

## Shared foundation

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_ir` | **Preferred short id** — netlist / design IR, hierarchy, SSA-like views for CAD |
| `learn_eda_ir` | Alias / longer name for the same idea (pick one id when scaffolding; prefer `learn_ir`) |
| `learn_geometry` | Edges, polygons, half-edges, R-tree/scanline — shared by DRC/LVS/PEX |
| `learn_techlib` | Liberty-lite: cells, pins, timing arcs, power tables as data |

---

## Logic & synthesis

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_synthesis` | AIG/netlist IR, techmapping (cuts), rewriting, area/delay tradeoffs |
| `learn_retiming` | Retiming / register move literacy (optional split from synthesis) |
| `learn_equivalence` | Combinational / sequential equivalence algorithms (ties to formal) |

---

## Timing & constraints

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_sta` | Timing graph, arrival/required, slack, incremental update |
| `learn_sdc` | Constraint model: clocks, I/O, false/multicycle — as *data the engine consumes* |
| `learn_si` | Crosstalk / noise-on-timing literacy (optional later) |

---

## Partitioning, clustering, floorplan, place

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_partitioning` | KL / FM, multiway, cutsize, terminal propagation |
| `learn_clustering` | Multi-level coarsening, affinity, uncoarsening |
| `learn_floorplanning` | Fixed-outline, slicing/NSG, whitespace, macro placement |
| `learn_placement` | Global place (HPWL, analytical / force / SA-lite), density |
| `learn_legalization` | Snap to sites/rows, overlap removal |
| `learn_congestion` | Congestion estimation, inflators (optional split) |

---

## Clock, route, buffering

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_clock_tree` | H-tree / MMM, skew/latency bounds, clock buffering |
| `learn_buffering` | Van Ginneken-style / slew-driven buffer insertion lite |
| `learn_global_routing` | GCells, capacity, overflow, pattern routes |
| `learn_routing` | Detailed route: grid graph, maze/A*, rip-up & reroute |
| `learn_compaction` | Layout compaction literacy (optional later) |

---

## Physical verification & circuit sim

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_pattern_matching` | **DRC-style patterns** — edge pairs, interactions, markers; pattern DSL → match engine (often prereq or sibling of `learn_drc`) |
| `learn_drc` | Rule deck → checkers; width/spacing/enclosure; uses geometry + pattern matching |
| `learn_lvs` | Device recognition, net extraction, graph compare / isomorphism lite |
| `learn_pex` | R/C from geometry, RC network build, reduction lite, back-annotate hooks |
| `learn_spice` | MNA stamps, Newton–Raphson, sparse LU, transient integration, device callbacks |
| `learn_erc` | Electrical rule categories (optional thin course) |
| `learn_antenna` | Antenna ratio / charge accumulation checks (optional split) |

---

## Power, DFT interface, sign-off

| Course id | Algorithm / feature focus |
|-----------|---------------------------|
| `learn_power` | Switching/leakage models, IR drop graph lite, EM literacy |
| `learn_dft_insert` | Scan chain / DFT as netlist transforms touching P&R (not full DFT methodology) |
| `learn_signoff` | Corners, ECO loop literacy, tapeout checklist (process + algo hooks) |

---

## Open-source evidence (optional sidecar courses)

Thinner than algorithm courses; **usage + reports as golden** for Track A. Host here only if the main lane stays on this platform.

Tool literacy before the flow orchestrators (same idea as `learn_yosys` after `learn_synthesis`):

| Course id | Role |
|-----------|------|
| `learn_yosys` | Synth CLI / RTLIL / passes vs `learn_synthesis` |
| `learn_opensta` | OpenSTA CLI / SDC / reports vs `learn_sta` |
| `learn_magic` | Magic GDS / DRC / antenna vs layout algorithm courses |
| `learn_netgen` | Netgen LVS evidence vs `learn_lvs` |
| `learn_klayout` | KLayout viewer / DRC scripts (alongside Magic) |
| `learn_openroad` | Place/CTS/route evidence vs PD algorithm courses |
| `learn_openlane` | RTL→GDS flow literacy (orchestrates the tools above) |
| `learn_fpga_cad` | FPGA packing/place/route differences (VPR/nextpnr-shaped) |

---

## Stretch / later

| Course id | Notes |
|-----------|--------|
| `learn_analog_layout` | Device-level layout algorithms; bridge to analog product lane |
| `learn_ml_eda` | ML-for-CAD literacy only — do not lead the lane with this |
| `learn_pdks` | View packaging (LEF/Liberty/tech) as data engineering |

---

## Complex / advanced EDA topics

These are **not** in the v1 spine; list them so the lane can grow. Many deserve their own `learn_*` when you deepen.

### Algorithms & engines (deeper)

| Course id | Focus |
|-----------|--------|
| `learn_sparse_matrix` | Sparse LU/KLU/GMRES as shared SPICE/IR-drop substrate |
| `learn_bdd` | BDDs for logic / equiv (classic CAD) |
| `learn_sat_eda` | SAT/SMT for equiv, ECO, routing constraints |
| `learn_aig` | And-inverter graphs deep-dive (split from `learn_synthesis`) |
| `learn_cut_enumeration` | Techmap cuts / priority cuts |
| `learn_graph_matching` | General matching — LVS device pairing, bipartite assign |
| `learn_isomorphism` | Graph iso / canonical labeling for LVS |
| `learn_computational_geometry` | Robust predicates, Booleans — foundation under DRC/PEX |

### Timing / variation / sign-off depth

| Course id | Focus |
|-----------|--------|
| `learn_ocv` | OCV / AOCV / POCV derates as timing-graph transforms |
| `learn_mcmm` | Multi-corner multi-mode session algorithms |
| `learn_useful_skew` | Useful skew / clock scheduling with placement |
| `learn_crosstalk` | Aggressor/victim coupling timing (deeper than `learn_si`) |
| `learn_noise` | Noise immunity / glitch — sibling of SI |

### Litho / mask / manufacturing CAD

| Course id | Focus |
|-----------|--------|
| `learn_opc` | Optical proximity correction literacy / toy inverse litho |
| `learn_litho` | Lithography models lite for CAD people |
| `learn_mdp` | Mask data prep / fracturing |
| `learn_dfm` | Design-for-manufacturing rule algorithms |

### 3D / advanced physical

| Course id | Focus |
|-----------|--------|
| `learn_thermal` | Thermal maps coupled to place/power |
| `learn_em` | Electromigration current-density checks |
| `learn_3dic` | 3D-IC / chiplet floorplan & bonding constraints |
| `learn_waterline` | Hotspot / density fill / dummy fill algorithms |

### Pattern & rule languages (ties to DRC)

| Course id | Focus |
|-----------|--------|
| `learn_pattern_matching` | *(listed above)* edge/region patterns for DRC |
| `learn_rule_dsl` | Compiling a SVRF-/DRC-like rule language → checkers |
| `learn_multi_patterning` | Coloring / decomposition constraints |

---

## Suggested dependency sketch

```text
learn_eda
    │
    ▼
learn_ir (or learn_eda_ir) ──► learn_geometry ──► learn_techlib
    │                              │
    │                              ├─ learn_pattern_matching ──► learn_drc ──► learn_lvs ──► learn_pex
    │                              │         │                      │
    │                              │         └─ learn_multi_patterning
    │                              │                                └─ learn_rule_dsl (sibling)
    │                              │
    ├──────────────────► learn_spice ◄── (PEX / device models)
    │
    ├─ learn_synthesis ──► learn_sta ──► learn_sdc
    │         │
    │         └─ learn_equivalence
    │
    ├─ learn_partitioning ──► learn_clustering
    │         │
    │         ▼
    │   learn_floorplanning ──► learn_placement ──► learn_legalization
    │         │                         │
    │         │                         ▼
    │         │                  learn_clock_tree ──► learn_buffering
    │         │                         │
    │         │                         ▼
    │         │               learn_global_routing ──► learn_routing
```

---

## Phased build (if on this platform)

| Phase | Courses | Why |
|-------|---------|-----|
| **1** | `learn_eda`, `learn_ir`, `learn_geometry` | Shared IR + geometry vocabulary |
| **2** | `learn_partitioning`, `learn_placement`, `learn_sta` | Classic CAD core; great browser labs |
| **3** | `learn_pattern_matching`, `learn_drc`, `learn_lvs`, `learn_pex`, `learn_spice` | Physical verify / sim engines |
| **4** | `learn_synthesis`, `learn_floorplanning`, `learn_clock_tree`, `learn_routing` | Fill the PD stack |
| **5** | Sidecars + power/signoff + advanced (OCV, OPC, …) | Evidence + complex topics |

---

## Platform decision checklist

Use this doc to choose **this monorepo** vs **separate EDA platform**:

| Question | Lean **this** platform | Lean **other** platform |
|----------|------------------------|-------------------------|
| Audience overlaps digital/verification students? | Yes | Mostly CAD/algorithms specialists |
| Want shared Unix/Git/Python + lab shell? | Yes | Greenfield UX OK |
| Browser labs = graph/geometry toys (same as HDL concept labs)? | Yes | Need heavy canvas/WebGL CAD UI |
| Brand is “DDV + EDA algorithms”? | Yes | Brand is “Open EDA / CAD courseware” only |
| Fear of diluting HDL catalog? | Keep EDA as linked satellite repo | Split early |

**Not in active catalog today.** When ready: scaffold chosen ids into `courses/`, add § to [`syllabus.md`](syllabus.md), register in `platform/assets/catalog.json`.

---

## Naming conventions (locked for this list)

- Ids: `learn_<noun>` — e.g. `learn_placement`, `learn_partitioning`, `learn_clock_tree`
- Prefer full words over cryptic abbreviations in ids (`learn_clock_tree` not `learn_cts`; `learn_sta` is OK as industry-standard)
- No `learn_*_engine` — say “toy engine / algorithms” in README goal
- One id per concern; split later (`learn_global_routing` / `learn_routing`) rather than one mega-course

---

## Count (planning)

| Group | Approx. course ids |
|-------|-------------------:|
| Hub + foundation (IR, geometry, techlib) | 4 |
| Logic / timing | 6 |
| PD (partition → route) | 11 |
| Pattern / DRC / LVS / PEX / SPICE / ERC / antenna | 7 |
| Power / DFT / signoff | 3 |
| OSS evidence sidecars | 4 |
| Stretch | 3 |
| Complex / advanced (listed, deferred) | ~20 |
| **Spine + sidecars (phases 1–5)** | **~35** |
| **With advanced catalog** | **~55** |

Edit this file freely when pruning or renaming before any scaffold.
