# learn_power

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Power-orange)](docs/MODULES.md)

**learn_power** is the open learning path for *power analysis* — switching/leakage, activity, grid IR drop, EM limits, markers, and a tiny power engine on `tiny_power.json`.

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

- [Welcome to power analysis](module00-00-intro/README.md)
- [Switching power](module01-01-switching-power/README.md)
- [Leakage power](module01-03-leakage-power/README.md)
- [Total power](module02-01-total-power/README.md)
- [Activity factors](module02-03-activity-factors/README.md)
- [Power grid](module03-01-power-grid/README.md)
- [IR drop](module03-03-ir-drop/README.md)
- [EM literacy](module04-01-em-literacy/README.md)
- [Power markers](module04-03-power-markers/README.md)
- [Power engine integration](module05-01-power-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [Power path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_power/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_power/scripts/scaffold_course.py
bash courses/learn_power/scripts/capture_all_walkthroughs.sh
bash courses/learn_power/scripts/capture_lab_snaps.sh
bash courses/learn_power/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_power --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#power` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to power analysis](module00-00-intro/README.md) |
| `module01-01-switching-power` | [Switching power](module01-01-switching-power/README.md) |
| `module01-03-leakage-power` | [Leakage power](module01-03-leakage-power/README.md) |
| `module02-01-total-power` | [Total power](module02-01-total-power/README.md) |
| `module02-03-activity-factors` | [Activity factors](module02-03-activity-factors/README.md) |
| `module03-01-power-grid` | [Power grid](module03-01-power-grid/README.md) |
| `module03-03-ir-drop` | [IR drop](module03-03-ir-drop/README.md) |
| `module04-01-em-literacy` | [EM literacy](module04-01-em-literacy/README.md) |
| `module04-03-power-markers` | [Power markers](module04-03-power-markers/README.md) |
| `module05-01-power-engine` | [Power engine integration](module05-01-power-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Power path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#power

## License

CC BY 4.0 — see [LICENSE](LICENSE).
