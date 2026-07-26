# learn_spice

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-SPICE-orange)](docs/MODULES.md)

**learn_spice** is the open learning path for *SPICE / circuit simulation* — netlist parsing, MNA stamping, sparse LU, Newton-Raphson, device callbacks, backward-Euler transient, and a tiny spice engine on `tiny_spice.json`.

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

- [Welcome to SPICE](module00-00-intro/README.md)
- [Netlist nodes and ground](module01-01-netlist-nodes/README.md)
- [MNA stamping (R and V)](module01-03-mna-stamps/README.md)
- [Linear DC solve](module02-01-dc-linear/README.md)
- [Sparse LU lite](module02-03-sparse-lu/README.md)
- [Newton-Raphson DC](module03-01-newton-raphson/README.md)
- [Device callbacks (diode)](module03-03-device-callbacks/README.md)
- [Backward Euler transient](module04-01-transient-be/README.md)
- [OP then TRAN pipeline](module04-03-op-tran-pipeline/README.md)
- [SPICE engine integration](module05-01-spice-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [SPICE path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_spice/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_spice/scripts/scaffold_course.py
bash courses/learn_spice/scripts/capture_all_walkthroughs.sh
bash courses/learn_spice/scripts/capture_lab_snaps.sh
bash courses/learn_spice/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_spice --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#spice` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to SPICE](module00-00-intro/README.md) |
| `module01-01-netlist-nodes` | [Netlist nodes and ground](module01-01-netlist-nodes/README.md) |
| `module01-03-mna-stamps` | [MNA stamping (R and V)](module01-03-mna-stamps/README.md) |
| `module02-01-dc-linear` | [Linear DC solve](module02-01-dc-linear/README.md) |
| `module02-03-sparse-lu` | [Sparse LU lite](module02-03-sparse-lu/README.md) |
| `module03-01-newton-raphson` | [Newton-Raphson DC](module03-01-newton-raphson/README.md) |
| `module03-03-device-callbacks` | [Device callbacks (diode)](module03-03-device-callbacks/README.md) |
| `module04-01-transient-be` | [Backward Euler transient](module04-01-transient-be/README.md) |
| `module04-03-op-tran-pipeline` | [OP then TRAN pipeline](module04-03-op-tran-pipeline/README.md) |
| `module05-01-spice-engine` | [SPICE engine integration](module05-01-spice-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [SPICE path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#spice

## License

CC BY 4.0 — see [LICENSE](LICENSE).
