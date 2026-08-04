# learn_klayout

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-KLayout-orange)](docs/MODULES.md)

**learn_klayout** is the open learning path for *KLayout* — Part A **viewer/stream/DRC map**, Part B **real KLayout CLI evidence**, Part C **algorithms bound to DRC goldens**, then Part D **internals / contribute**. Companion to [learn_magic](../learn_magic/README.md) and [learn_drc](../learn_drc/README.md).

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

- [Welcome to KLayout](module00-00-intro/README.md)
- [Layers view map](module01-01-layers-view-map/README.md)
- [Cell hierarchy map](module01-03-cell-hierarchy-map/README.md)
- [Stream GDS map](module02-01-stream-gds-map/README.md)
- [DRC script map](module02-03-drc-script-map/README.md)
- [Markers report map](module03-01-markers-report-map/README.md)
- [KLayout engine (map)](module03-03-klayout-engine/README.md)
- [KLayout CLI & scripts](module06-01-klayout-cli/README.md)
- [GDS vocabulary](module06-03-gds-vocab/README.md)
- [Real stream GDS](module07-01-real-stream-gds/README.md)
- [Real DRC script](module07-03-real-drc-script/README.md)
- [Real DRC markers](module08-01-real-markers/README.md)
- [Real KLayout evidence](module08-03-klayout-evidence/README.md)
- [Layer query algorithm](module09-01-layer-query-algo/README.md)
- [Width spacing algorithm](module09-03-width-spacing-algo/README.md)
- [Marker emit algorithm](module10-01-marker-emit-algo/README.md)
- [KLayout algo engine](module10-03-klayout-algo-engine/README.md)
- [Layout / Cell / Instance model](module14-01-layout-cell-model/README.md)
- [Read DRC runner](module14-03-read-drc-runner/README.md)
- [Contribute to KLayout](module15-03-contribute-klayout/README.md)
- [KLayout path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_klayout/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_klayout/scripts/scaffold_course.py
python3 courses/learn_klayout/scripts/generate_part_a.py
python3 courses/learn_klayout/scripts/generate_part_b.py
python3 courses/learn_klayout/scripts/generate_part_c.py
python3 courses/learn_klayout/scripts/scaffold_part_d.py
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_klayout --modules
python3 platform/scripts/publish_course_platform.py learn_klayout
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#klayout` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#klayout

## License

CC BY 4.0 — see [LICENSE](LICENSE).
