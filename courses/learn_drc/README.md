# learn_drc

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-DRC-orange)](docs/MODULES.md)

**learn_drc** is the open learning path for *design rule checks* — rule deck load, width/spacing/enclosure checkers, violation markers, multi-layer rules, deck boolean, and a tiny DRC engine on `tiny_drc.json`.

**Prerequisite:** [learn_pattern_matching](../learn_pattern_matching/README.md). **Next:** [learn_lvs](../learn_lvs/README.md).

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

- [Welcome to DRC](module00-00-intro/README.md)
- [Rule deck load](module01-01-rule-deck/README.md)
- [Width checker](module01-03-width-checker/README.md)
- [Spacing checker](module01-05-spacing-checker/README.md)
- [Enclosure checker](module02-01-enclosure-checker/README.md)
- [DRC violations](module02-03-violation-markers/README.md)
- [Multi-layer rule deck](module03-01-multi-layer-deck/README.md)
- [Deck boolean rules](module03-03-deck-boolean/README.md)
- [DRC engine pass](module04-01-drc-engine/README.md)
- [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md)
- [DRC path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_drc/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_drc/scripts/scaffold_course.py
bash courses/learn_drc/scripts/capture_all_walkthroughs.sh
bash courses/learn_drc/scripts/capture_lab_snaps.sh
bash courses/learn_drc/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_drc --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#drc` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to DRC](module00-00-intro/README.md) |
| `module01-01-rule-deck` | [Rule deck load](module01-01-rule-deck/README.md) |
| `module01-03-width-checker` | [Width checker](module01-03-width-checker/README.md) |
| `module01-05-spacing-checker` | [Spacing checker](module01-05-spacing-checker/README.md) |
| `module02-01-enclosure-checker` | [Enclosure checker](module02-01-enclosure-checker/README.md) |
| `module02-03-violation-markers` | [DRC violations](module02-03-violation-markers/README.md) |
| `module03-01-multi-layer-deck` | [Multi-layer rule deck](module03-01-multi-layer-deck/README.md) |
| `module03-03-deck-boolean` | [Deck boolean rules](module03-03-deck-boolean/README.md) |
| `module04-01-drc-engine` | [DRC engine pass](module04-01-drc-engine/README.md) |
| `module05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [DRC path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#drc

## License

CC BY 4.0 — see [LICENSE](LICENSE).
