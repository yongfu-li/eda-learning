# learn_lvs

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-LVS-orange)](docs/MODULES.md)

**learn_lvs** is the open learning path for *layout vs schematic compare* — schematic graph, device recognition, net extraction, layout graph, pin binding, device match, LVS compare, and a tiny LVS engine on `tiny_lvs.json`.

**Prerequisite:** [learn_drc](../learn_drc/README.md). **Next:** [learn_pex](../learn_pex/README.md).

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

- [Welcome to LVS](module00-00-intro/README.md)
- [Schematic connectivity graph](module01-01-schematic-graph/README.md)
- [Device recognition](module01-03-device-recog/README.md)
- [Net extraction](module01-05-net-extract/README.md)
- [Layout device–net graph](module02-01-layout-graph/README.md)
- [Pin / name binding](module02-03-pin-binding/README.md)
- [Device matching](module03-01-device-match/README.md)
- [LVS graph compare](module03-03-lvs-compare/README.md)
- [LVS engine pass](module04-01-lvs-engine/README.md)
- [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md)
- [LVS path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_lvs/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_lvs/scripts/scaffold_course.py
bash courses/learn_lvs/scripts/capture_all_walkthroughs.sh
bash courses/learn_lvs/scripts/capture_lab_snaps.sh
bash courses/learn_lvs/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_lvs --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#lvs` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to LVS](module00-00-intro/README.md) |
| `module01-01-schematic-graph` | [Schematic connectivity graph](module01-01-schematic-graph/README.md) |
| `module01-03-device-recog` | [Device recognition](module01-03-device-recog/README.md) |
| `module01-05-net-extract` | [Net extraction](module01-05-net-extract/README.md) |
| `module02-01-layout-graph` | [Layout device–net graph](module02-01-layout-graph/README.md) |
| `module02-03-pin-binding` | [Pin / name binding](module02-03-pin-binding/README.md) |
| `module03-01-device-match` | [Device matching](module03-01-device-match/README.md) |
| `module03-03-lvs-compare` | [LVS graph compare](module03-03-lvs-compare/README.md) |
| `module04-01-lvs-engine` | [LVS engine pass](module04-01-lvs-engine/README.md) |
| `module05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [LVS path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#lvs

## License

CC BY 4.0 — see [LICENSE](LICENSE).
