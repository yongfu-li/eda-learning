# learn_pex

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-PEX-orange)](docs/MODULES.md)

**learn_pex** is the open learning path for *parasitic extraction* — geometry load, resistance/capacitance extract, RC network build, network reduction, back-annotate, SPEF-lite emit, and a tiny PEX engine on `tiny_pex.json`.

**Prerequisite:** [learn_lvs](../learn_lvs/README.md). **Next:** [learn_spice](../learn_spice/README.md).

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

- [Welcome to PEX](module00-00-intro/README.md)
- [Geometry load](module01-01-geometry-load/README.md)
- [Resistance extract](module01-03-resistance-extract/README.md)
- [Capacitance extract](module01-05-capacitance-extract/README.md)
- [RC network build](module02-01-rc-network/README.md)
- [Network reduction](module02-03-network-reduce/README.md)
- [Back-annotate nets](module03-01-back-annotate/README.md)
- [SPEF-lite emit](module03-03-spef-lite/README.md)
- [PEX engine pass](module04-01-pex-engine/README.md)
- [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md)
- [PEX path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_pex/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_pex/scripts/scaffold_course.py
bash courses/learn_pex/scripts/capture_all_walkthroughs.sh
bash courses/learn_pex/scripts/capture_lab_snaps.sh
bash courses/learn_pex/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_pex --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#pex` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to PEX](module00-00-intro/README.md) |
| `module01-01-geometry-load` | [Geometry load](module01-01-geometry-load/README.md) |
| `module01-03-resistance-extract` | [Resistance extract](module01-03-resistance-extract/README.md) |
| `module01-05-capacitance-extract` | [Capacitance extract](module01-05-capacitance-extract/README.md) |
| `module02-01-rc-network` | [RC network build](module02-01-rc-network/README.md) |
| `module02-03-network-reduce` | [Network reduction](module02-03-network-reduce/README.md) |
| `module03-01-back-annotate` | [Back-annotate nets](module03-01-back-annotate/README.md) |
| `module03-03-spef-lite` | [SPEF-lite emit](module03-03-spef-lite/README.md) |
| `module04-01-pex-engine` | [PEX engine pass](module04-01-pex-engine/README.md) |
| `module05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [PEX path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#pex

## License

CC BY 4.0 — see [LICENSE](LICENSE).
