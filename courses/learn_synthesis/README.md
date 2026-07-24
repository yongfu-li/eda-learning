# learn_synthesis

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-synthesis-orange)](docs/MODULES.md)

**learn_synthesis** — AIG, structural hashing, rewrite, k-cuts, techmapping, area/delay.

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

```
learn_synthesis/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

## Browse or clone

```bash
cd courses/learn_synthesis
```

## Consume from the parent

Next: [learn_sta](../learn_sta/README.md) · [learn_retiming](../learn_retiming/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_synthesis/scripts/scaffold_course.py
bash courses/learn_synthesis/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_synthesis
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_synthesis --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A** | `common/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B** | platform `#synthesis` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to logic synthesis for EDA](module00-00-intro/README.md) | `intro` |
| `01-01-boolean-network` | [Boolean network / subject graph](module01-01-boolean-network/README.md) | `lab` |
| `01-03-aig-nodes` | [And-Inverter Graph nodes](module01-03-aig-nodes/README.md) | `lab` |
| `02-01-aig-strash` | [Structural hashing (strash)](module02-01-aig-strash/README.md) | `lab` |
| `02-03-rewrite-local` | [Local AIG rewrite](module02-03-rewrite-local/README.md) | `lab` |
| `02-05-cut-enumeration` | [K-feasible cut enumeration](module02-05-cut-enumeration/README.md) | `lab` |
| `02-07-library-cells` | [Cell library for mapping](module02-07-library-cells/README.md) | `lab` |
| `03-01-techmap-cover` | [Techmapping cover (area)](module03-01-techmap-cover/README.md) | `lab` |
| `03-03-area-delay` | [Area vs delay tradeoff](module03-03-area-delay/README.md) | `lab` |
| `04-01-sequential-synth` | [Sequential synthesis pass](module04-01-sequential-synth/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Logic synthesis path complete](module99-00-wrap/README.md) | `wrap` |

## Browser labs

- [boolean-network](https://universal-verification-methodology.github.io/learning/tools/boolean-network/)
- [aig-nodes](https://universal-verification-methodology.github.io/learning/tools/aig-nodes/)
- [aig-strash](https://universal-verification-methodology.github.io/learning/tools/aig-strash/)
- [rewrite-local](https://universal-verification-methodology.github.io/learning/tools/rewrite-local/)
- [cut-enumeration](https://universal-verification-methodology.github.io/learning/tools/cut-enumeration/)
- [library-cells](https://universal-verification-methodology.github.io/learning/tools/library-cells/)
- [techmap-cover](https://universal-verification-methodology.github.io/learning/tools/techmap-cover/)
- [area-delay](https://universal-verification-methodology.github.io/learning/tools/area-delay/)
- [sequential-synth](https://universal-verification-methodology.github.io/learning/tools/sequential-synth/)

## License

[CC BY 4.0](LICENSE)
