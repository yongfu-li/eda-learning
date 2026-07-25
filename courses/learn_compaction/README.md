# learn_compaction

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Labs](https://img.shields.io/badge/labs-9-green)](docs/MODULES.md)
[![Domain](https://img.shields.io/badge/domain-compaction-orange)](docs/MODULES.md)

**learn_compaction** is the open learning path for *layout compaction*: constraint graphs, longest-path 1-D/2-D packing, wire jogs, and shear lite on a tiny stick layout.

Use Track A (`common/`) or browser labs (Track B) after module-slides media is built.

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
learn_compaction/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

Optional per module: `slides.pptx`, `slides.pdf`, `audio/`, `video.mp4` (module-slides pipeline).

## Browse or clone

```bash
cd courses/learn_compaction
python3 common/test_solvers.py -v
```

## Consume from the parent

Prerequisite: [learn_routing](../learn_routing/README.md). Next: [learn_pattern_matching](../learn_pattern_matching/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_compaction/scripts/scaffold_course.py
bash courses/learn_compaction/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_compaction
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_compaction --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A — Implement** | `common/tiny_compact.json`, `solvers.py` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | `platform/tools/<lab-id>/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to layout compaction](module00-00-intro/README.md) | `intro` |
| `01-01-leaf-cells` | [Leaf cells and bounding boxes](module01-01-leaf-cells/README.md) | `lab` |
| `01-03-spacing-rules` | [Spacing / gap rules](module01-03-spacing-rules/README.md) | `lab` |
| `02-01-constraint-graph` | [Constraint graph](module02-01-constraint-graph/README.md) | `lab` |
| `02-03-longest-path` | [Longest-path compaction](module02-03-longest-path/README.md) | `lab` |
| `02-05-compact-1d` | [1-D compaction (X or Y)](module02-05-compact-1d/README.md) | `lab` |
| `02-07-compact-2d` | [2-D compaction](module02-07-compact-2d/README.md) | `lab` |
| `03-01-wire-jogs` | [Wire jogs / stretch](module03-01-wire-jogs/README.md) | `lab` |
| `03-03-shear-lite` | [Shear / channel lite](module03-03-shear-lite/README.md) | `lab` |
| `03-05-sequential-compact` | [Sequential compact pass](module03-05-sequential-compact/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Compaction path complete](module99-00-wrap/README.md) | `wrap` |

Full index: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

- [leaf-cells](https://universal-verification-methodology.github.io/learning/tools/leaf-cells/)
- [spacing-rules](https://universal-verification-methodology.github.io/learning/tools/spacing-rules/)
- [constraint-graph](https://universal-verification-methodology.github.io/learning/tools/constraint-graph/)
- [longest-path](https://universal-verification-methodology.github.io/learning/tools/longest-path/)
- [compact-1d](https://universal-verification-methodology.github.io/learning/tools/compact-1d/)
- [compact-2d](https://universal-verification-methodology.github.io/learning/tools/compact-2d/)
- [wire-jogs](https://universal-verification-methodology.github.io/learning/tools/wire-jogs/)
- [shear-lite](https://universal-verification-methodology.github.io/learning/tools/shear-lite/)
- [sequential-compact](https://universal-verification-methodology.github.io/learning/tools/sequential-compact/)

Local: `python3 -m http.server 8080 --directory platform` → http://127.0.0.1:8080/tools/index.html#compaction

## License

CC BY 4.0 — see [LICENSE](LICENSE).
