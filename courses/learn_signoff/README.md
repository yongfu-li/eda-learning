# learn_signoff

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Signoff-orange)](docs/MODULES.md)

**learn_signoff** is the open learning path for *signoff* — PVT corners, signoff derate, check suite, ECO loop, tapeout checklist, markers, and a tiny signoff engine on `tiny_signoff.json`.

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

- [Welcome to signoff](module00-00-intro/README.md)
- [PVT corners](module01-01-corners/README.md)
- [Signoff corner pick](module01-03-signoff-corner/README.md)
- [Derate formula](module02-01-derate/README.md)
- [Check suite](module02-03-check-suite/README.md)
- [ECO plan](module03-01-eco-loop/README.md)
- [Apply fixes](module03-03-apply-ecos/README.md)
- [Tapeout items](module04-01-tapeout-checklist/README.md)
- [Fail markers](module04-03-signoff-markers/README.md)
- [Signoff engine integration](module05-01-signoff-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [Signoff path complete](module99-00-wrap/README.md)

Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_signoff/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_signoff/scripts/scaffold_course.py
bash courses/learn_signoff/scripts/capture_all_walkthroughs.sh
bash courses/learn_signoff/scripts/capture_lab_snaps.sh
bash courses/learn_signoff/scripts/build_all_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_signoff --modules
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#signoff` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

| Module | README |
|--------|--------|
| `module00-00-intro` | [Welcome to signoff](module00-00-intro/README.md) |
| `module01-01-corners` | [PVT corners](module01-01-corners/README.md) |
| `module01-03-signoff-corner` | [Signoff corner pick](module01-03-signoff-corner/README.md) |
| `module02-01-derate` | [Derate formula](module02-01-derate/README.md) |
| `module02-03-check-suite` | [Check suite](module02-03-check-suite/README.md) |
| `module03-01-eco-loop` | [ECO plan](module03-01-eco-loop/README.md) |
| `module03-03-apply-ecos` | [Apply fixes](module03-03-apply-ecos/README.md) |
| `module04-01-tapeout-checklist` | [Tapeout items](module04-01-tapeout-checklist/README.md) |
| `module04-03-signoff-markers` | [Fail markers](module04-03-signoff-markers/README.md) |
| `module05-01-signoff-engine` | [Signoff engine integration](module05-01-signoff-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [Signoff path complete](module99-00-wrap/README.md) |

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#signoff

## License

CC BY 4.0 — see [LICENSE](LICENSE).
