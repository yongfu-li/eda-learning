# learn_pattern_matching

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-pattern--matching-orange)](docs/MODULES.md)

**learn_pattern_matching** is the open learning path for *DRC-style edge/region pattern matching* — single-layer space/width, scanline, markers, and multi-layer via/boolean patterns.

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

- [Welcome to pattern matching](module00-00-intro/README.md)
- [Edges and polygons](module01-01-edges-polygons/README.md)
- [Single-layer edge-pair (space)](module01-03-single-layer-edge-pair/README.md)
- [Single-layer region (width)](module01-05-single-layer-region/README.md)
- [Scanline edge sweep](module02-01-scanline-sweep/README.md)
- [Marker emit](module02-03-marker-emit/README.md)
- [Multi-layer via enclosure](module03-01-multi-layer-via/README.md)
- [Multi-layer interactions](module03-03-multi-layer-interaction/README.md)
- [Layered boolean (AND/OR)](module03-05-layered-boolean/README.md)
- [Match engine pass](module04-01-match-engine/README.md)
- [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md)
- [Pattern matching path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_pattern_matching/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_pattern_matching/scripts/scaffold_course.py
python3 courses/learn_pattern_matching/scripts/generate_tools.py
bash courses/learn_pattern_matching/scripts/capture_all_walkthroughs.sh
bash courses/learn_pattern_matching/scripts/capture_lab_snaps.sh
bash courses/learn_pattern_matching/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_pattern_matching --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#pattern-matching` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to pattern matching](module00-00-intro/README.md) |
| `module01-01-edges-polygons` | [Edges and polygons](module01-01-edges-polygons/README.md) |
| `module01-03-single-layer-edge-pair` | [Single-layer edge-pair (space)](module01-03-single-layer-edge-pair/README.md) |
| `module01-05-single-layer-region` | [Single-layer region (width)](module01-05-single-layer-region/README.md) |
| `module02-01-scanline-sweep` | [Scanline edge sweep](module02-01-scanline-sweep/README.md) |
| `module02-03-marker-emit` | [Marker emit](module02-03-marker-emit/README.md) |
| `module03-01-multi-layer-via` | [Multi-layer via enclosure](module03-01-multi-layer-via/README.md) |
| `module03-03-multi-layer-interaction` | [Multi-layer interactions](module03-03-multi-layer-interaction/README.md) |
| `module03-05-layered-boolean` | [Layered boolean (AND/OR)](module03-05-layered-boolean/README.md) |
| `module04-01-match-engine` | [Match engine pass](module04-01-match-engine/README.md) |
| `module05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Pattern matching path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#pattern-matching

## License

CC BY 4.0 — see [LICENSE](LICENSE).
