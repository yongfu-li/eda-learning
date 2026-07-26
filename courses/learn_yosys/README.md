# learn_yosys

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Yosys-orange)](docs/MODULES.md)

**learn_yosys** is the open learning path for *Yosys* — Part A **pass map** on `tiny_yosys.json`, Part B **real Yosys CLI/RTLIL evidence** on `rtl/tiny_and_or.v`, then Part C **algorithms bound to real Yosys** on `tiny_algo.json` (+ dedicated RTL) (`proc_mux` → opt → techmap → extract → memory/fsm → abc handoff).

## Table of contents

- [Contents](#contents)
- [Browse or clone](#browse-or-clone)
- [Consume from the parent](#consume-from-the-parent)
- [Author: publish or update](#author-publish-or-update)
- [Two learning tracks](#two-learning-tracks)
- [Module landings](#module-landings)
- [Browser labs](#browser-labs)
- [License](#license)

## Contents

- [Welcome to Yosys passes](module00-00-intro/README.md)
- [Proc elaborate](module01-01-proc-elaborate/README.md)
- [Hierarchy flatten](module01-03-hierarchy-flatten/README.md)
- [Opt / DCE](module02-01-opt-dce/README.md)
- [AIG strash](module02-03-aig-strash/README.md)
- [Rewrite balance](module03-01-rewrite-balance/README.md)
- [Techmap area](module03-03-techmap-area/README.md)
- [Techmap delay](module04-01-techmap-delay/README.md)
- [Synth script](module04-03-synth-script/README.md)
- [Yosys engine integration](module05-01-yosys-engine/README.md)
- [Yosys CLI & scripts](module06-01-yosys-cli/README.md)
- [RTLIL vocabulary](module06-03-rtlil-vocab/README.md)
- [Real proc pass](module07-01-real-proc/README.md)
- [Real flatten & opt](module07-03-real-flatten-opt/README.md)
- [aigmap & synth](module08-01-aigmap-synth/README.md)
- [Real Yosys evidence engine](module08-03-real-evidence/README.md)
- [proc_mux algorithm](module09-01-proc-mux/README.md)
- [proc_dff + async reset](module09-03-proc-dff-arst/README.md)
- [opt_clean + opt_expr](module10-01-opt-clean-expr/README.md)
- [opt_merge algorithm](module10-03-opt-merge-algo/README.md)
- [techmap mapfile](module11-01-techmap-mapfile/README.md)
- [extract subcircuit](module11-03-extract-subcircuit/README.md)
- [memory_map algorithm](module12-01-memory-map-algo/README.md)
- [fsm detect](module12-03-fsm-detect/README.md)
- [ABC handoff](module13-01-abc-handoff/README.md)
- [Yosys algo engine](module13-03-yosys-algo-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [Yosys path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_yosys/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_yosys/scripts/scaffold_course.py
bash courses/learn_yosys/scripts/capture_all_walkthroughs.sh
bash courses/learn_yosys/scripts/capture_lab_snaps.sh
bash courses/learn_yosys/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_yosys --modules
python3 platform/scripts/publish_course_platform.py learn_yosys
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) (`solvers.py`, `real_solvers.py`, `algo_solvers.py`) |
| B Browser | platform tools `#yosys` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to Yosys passes](module00-00-intro/README.md) |
| `module01-01-proc-elaborate` | [Proc elaborate](module01-01-proc-elaborate/README.md) |
| `module01-03-hierarchy-flatten` | [Hierarchy flatten](module01-03-hierarchy-flatten/README.md) |
| `module02-01-opt-dce` | [Opt / DCE](module02-01-opt-dce/README.md) |
| `module02-03-aig-strash` | [AIG strash](module02-03-aig-strash/README.md) |
| `module03-01-rewrite-balance` | [Rewrite balance](module03-01-rewrite-balance/README.md) |
| `module03-03-techmap-area` | [Techmap area](module03-03-techmap-area/README.md) |
| `module04-01-techmap-delay` | [Techmap delay](module04-01-techmap-delay/README.md) |
| `module04-03-synth-script` | [Synth script](module04-03-synth-script/README.md) |
| `module05-01-yosys-engine` | [Yosys engine](module05-01-yosys-engine/README.md) |
| `module06-01-yosys-cli` | [Yosys CLI & scripts](module06-01-yosys-cli/README.md) |
| `module06-03-rtlil-vocab` | [RTLIL vocabulary](module06-03-rtlil-vocab/README.md) |
| `module07-01-real-proc` | [Real proc pass](module07-01-real-proc/README.md) |
| `module07-03-real-flatten-opt` | [Real flatten & opt](module07-03-real-flatten-opt/README.md) |
| `module08-01-aigmap-synth` | [aigmap & synth](module08-01-aigmap-synth/README.md) |
| `module08-03-real-evidence` | [Real Yosys evidence engine](module08-03-real-evidence/README.md) |
| `module09-01-proc-mux` | [proc_mux algorithm](module09-01-proc-mux/README.md) |
| `module09-03-proc-dff-arst` | [proc_dff + async reset](module09-03-proc-dff-arst/README.md) |
| `module10-01-opt-clean-expr` | [opt_clean + opt_expr](module10-01-opt-clean-expr/README.md) |
| `module10-03-opt-merge-algo` | [opt_merge algorithm](module10-03-opt-merge-algo/README.md) |
| `module11-01-techmap-mapfile` | [techmap mapfile](module11-01-techmap-mapfile/README.md) |
| `module11-03-extract-subcircuit` | [extract subcircuit](module11-03-extract-subcircuit/README.md) |
| `module12-01-memory-map-algo` | [memory_map algorithm](module12-01-memory-map-algo/README.md) |
| `module12-03-fsm-detect` | [fsm detect](module12-03-fsm-detect/README.md) |
| `module13-01-abc-handoff` | [ABC handoff](module13-01-abc-handoff/README.md) |
| `module13-03-yosys-algo-engine` | [Yosys algo engine](module13-03-yosys-algo-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Yosys path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#yosys

## License

CC BY 4.0 — see [LICENSE](LICENSE).
