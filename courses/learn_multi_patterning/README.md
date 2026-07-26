# learn_multi_patterning

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-multi--patterning-orange)](docs/MODULES.md)

**learn_multi_patterning** is the open learning path for *multi-patterning decomposition* — conflict graphs, LELE double patterning, SADP/stitch literacy, triple/quad coloring, and a tiny MP engine.

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

- [Welcome to multi-patterning](module00-00-intro/README.md)
- [Conflict graph construction](module01-01-conflict-graph/README.md)
- [LELE double patterning](module01-03-double-lele/README.md)
- [Bipartite check (DP feasibility)](module01-05-bipartite-check/README.md)
- [SADP lite (mandrels + spacers)](module02-01-double-sadp/README.md)
- [Stitch lite (break odd cycle)](module02-03-stitch-lite/README.md)
- [Triple patterning (3-color)](module03-01-triple-color/README.md)
- [Triple decomp literacy](module03-03-triple-decomp/README.md)
- [Quad patterning (4-color greedy)](module03-05-quad-color/README.md)
- [Multi-patterning engine](module04-01-mp-engine/README.md)
- [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md)
- [Multi-patterning path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_multi_patterning/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_multi_patterning/scripts/scaffold_course.py
bash courses/learn_multi_patterning/scripts/capture_all_walkthroughs.sh
bash courses/learn_multi_patterning/scripts/capture_lab_snaps.sh
bash courses/learn_multi_patterning/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_multi_patterning --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#multi-patterning` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to multi-patterning](module00-00-intro/README.md) |
| `module01-01-conflict-graph` | [Conflict graph construction](module01-01-conflict-graph/README.md) |
| `module01-03-double-lele` | [LELE double patterning](module01-03-double-lele/README.md) |
| `module01-05-bipartite-check` | [Bipartite check (DP feasibility)](module01-05-bipartite-check/README.md) |
| `module02-01-double-sadp` | [SADP lite (mandrels + spacers)](module02-01-double-sadp/README.md) |
| `module02-03-stitch-lite` | [Stitch lite (break odd cycle)](module02-03-stitch-lite/README.md) |
| `module03-01-triple-color` | [Triple patterning (3-color)](module03-01-triple-color/README.md) |
| `module03-03-triple-decomp` | [Triple decomp literacy](module03-03-triple-decomp/README.md) |
| `module03-05-quad-color` | [Quad patterning (4-color greedy)](module03-05-quad-color/README.md) |
| `module04-01-mp-engine` | [Multi-patterning engine](module04-01-mp-engine/README.md) |
| `module05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Multi-patterning path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#multi-patterning

## License

CC BY 4.0 — see [LICENSE](LICENSE).
