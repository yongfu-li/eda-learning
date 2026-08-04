# learn_magic

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Magic-orange)](docs/MODULES.md)

**learn_magic** is the open learning path for *Magic* — Part A **layout/DRC/GDS map**, Part B **real Magic CLI evidence**, Part C **algorithms bound to Magic reports**, then Part D **internals / contribute**. Companion to [learn_digital](../learn_digital/README.md) and a prerequisite for OpenLane layout/DRC literacy.

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

- [Welcome to Magic](module00-00-intro/README.md)
- [Paint layers](module01-01-paint-layers/README.md)
- [Select box](module01-03-select-box/README.md)
- [Contact paint](module02-01-contact-paint/README.md)
- [Magic DRC map](module02-03-magic-drc-map/README.md)
- [GDS write map](module03-01-gds-write-map/README.md)
- [Magic engine (map)](module03-03-magic-engine/README.md)
- [Magic CLI & scripts](module06-01-magic-cli/README.md)
- [Magic tech vocabulary](module06-03-magic-tech-vocab/README.md)
- [Real paint / save](module07-01-real-paint-save/README.md)
- [Real DRC](module07-03-real-drc/README.md)
- [Real GDS streamout](module08-01-real-gds/README.md)
- [Real Magic evidence](module08-03-magic-evidence/README.md)
- [Paint connectivity algorithm](module09-01-paint-connectivity/README.md)
- [DRC region algorithm](module09-03-drc-region-algo/README.md)
- [Extract algorithm](module10-01-extract-algo/README.md)
- [Magic algo engine](module10-03-magic-algo-engine/README.md)
- [Tile / Plane model](module14-01-tile-plane-model/README.md)
- [Read DRC / cifwrite](module14-03-read-drc-cifwrite/README.md)
- [Contribute to Magic](module15-03-contribute-magic/README.md)
- [Magic path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_magic/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_magic/scripts/scaffold_course.py
python3 courses/learn_magic/scripts/generate_part_a.py
bash courses/learn_magic/scripts/build_part_a_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_magic --modules
python3 platform/scripts/publish_course_platform.py learn_magic
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#magic` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#magic

## License

CC BY 4.0 — see [LICENSE](LICENSE).
