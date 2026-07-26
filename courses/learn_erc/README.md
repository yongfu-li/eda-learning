# learn_erc

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-ERC-orange)](docs/MODULES.md)

**learn_erc** is the open learning path for *electrical rule checks* — connectivity graph, drivers/loads, floating nets, undriven inputs, multi-driven nets, supply shorts, well ties, markers, and a tiny ERC engine on `tiny_erc.json`.

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

- [Welcome to ERC](module00-00-intro/README.md)
- [Netlist connectivity graph](module01-01-netlist-graph/README.md)
- [Drivers and loads](module01-03-drivers-loads/README.md)
- [Floating nets](module02-01-floating-nets/README.md)
- [Undriven inputs](module02-03-undriven-inputs/README.md)
- [Multi-driven nets](module03-01-multi-driven/README.md)
- [Supply shorts](module03-03-supply-shorts/README.md)
- [Well and substrate ties](module04-01-well-substrate/README.md)
- [ERC markers](module04-03-erc-markers/README.md)
- [ERC engine integration](module05-01-erc-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [ERC path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_erc/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_erc/scripts/scaffold_course.py
bash courses/learn_erc/scripts/capture_all_walkthroughs.sh
bash courses/learn_erc/scripts/capture_lab_snaps.sh
bash courses/learn_erc/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_erc --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#erc` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to ERC](module00-00-intro/README.md) |
| `module01-01-netlist-graph` | [Netlist connectivity graph](module01-01-netlist-graph/README.md) |
| `module01-03-drivers-loads` | [Drivers and loads](module01-03-drivers-loads/README.md) |
| `module02-01-floating-nets` | [Floating nets](module02-01-floating-nets/README.md) |
| `module02-03-undriven-inputs` | [Undriven inputs](module02-03-undriven-inputs/README.md) |
| `module03-01-multi-driven` | [Multi-driven nets](module03-01-multi-driven/README.md) |
| `module03-03-supply-shorts` | [Supply shorts](module03-03-supply-shorts/README.md) |
| `module04-01-well-substrate` | [Well and substrate ties](module04-01-well-substrate/README.md) |
| `module04-03-erc-markers` | [ERC markers](module04-03-erc-markers/README.md) |
| `module05-01-erc-engine` | [ERC engine integration](module05-01-erc-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [ERC path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#erc

## License

CC BY 4.0 — see [LICENSE](LICENSE).
