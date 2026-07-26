# learn_antenna



[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)

[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)

[![Domain](https://img.shields.io/badge/domain-Antenna-orange)](docs/MODULES.md)



**learn_antenna** is the open learning path for *antenna rule checks* — metal/gate area, ratio, charge, threshold, diode protection, jumper break, markers, and a tiny antenna engine on `tiny_antenna.json`.



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



- [Welcome to antenna checks](module00-00-intro/README.md)
- [Metal area per net](module01-01-metal-area/README.md)
- [Gate area per net](module01-03-gate-area/README.md)
- [Antenna ratio](module02-01-antenna-ratio/README.md)
- [Charge accumulation](module02-03-charge-accumulation/README.md)
- [Threshold rules](module03-01-threshold-rules/README.md)
- [Diode protection](module03-03-diode-protection/README.md)
- [Jumper break](module04-01-jumper-break/README.md)
- [Antenna markers](module04-03-antenna-markers/README.md)
- [Antenna engine integration](module05-01-antenna-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [Antenna path complete](module99-00-wrap/README.md)



Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.



## Browse or clone



Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).



## Consume from the parent



Open [platform courses](../../platform/courses/learn_antenna/) after publish, or work Track A under `common/`.



## Author: publish or update



```bash

python3 courses/learn_antenna/scripts/scaffold_course.py

bash courses/learn_antenna/scripts/capture_all_walkthroughs.sh

bash courses/learn_antenna/scripts/capture_lab_snaps.sh

bash courses/learn_antenna/scripts/build_all_media.sh

python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_antenna --modules

```



## Two learning tracks



| Track | Path |

|-------|------|

| A Implement | [`common/`](common/) |

| B Browser | platform tools `#antenna` |



See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).



## Module landings



| Module | README |

|--------|--------|

| `module00-00-intro` | [Welcome to antenna checks](module00-00-intro/README.md) |
| `module01-01-metal-area` | [Metal area per net](module01-01-metal-area/README.md) |
| `module01-03-gate-area` | [Gate area per net](module01-03-gate-area/README.md) |
| `module02-01-antenna-ratio` | [Antenna ratio](module02-01-antenna-ratio/README.md) |
| `module02-03-charge-accumulation` | [Charge accumulation](module02-03-charge-accumulation/README.md) |
| `module03-01-threshold-rules` | [Threshold rules](module03-01-threshold-rules/README.md) |
| `module03-03-diode-protection` | [Diode protection](module03-03-diode-protection/README.md) |
| `module04-01-jumper-break` | [Jumper break](module04-01-jumper-break/README.md) |
| `module04-03-antenna-markers` | [Antenna markers](module04-03-antenna-markers/README.md) |
| `module05-01-antenna-engine` | [Antenna engine integration](module05-01-antenna-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Antenna path complete](module99-00-wrap/README.md) |



Full table: [docs/MODULES.md](docs/MODULES.md).



## Browser labs



http://127.0.0.1:8080/tools/index.html#antenna



## License



CC BY 4.0 — see [LICENSE](LICENSE).
