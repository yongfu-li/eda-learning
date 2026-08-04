# learn_opensta

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-OpenSTA-orange)](docs/MODULES.md)

**learn_opensta** is the open learning path for *OpenSTA* — **Parts A–D** (timing map, real CLI evidence, algorithms bound to report goldens, internals / contribute) are ready. Companion to [learn_sta](../learn_sta/README.md).

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

- [Welcome to OpenSTA](module00-00-intro/README.md)
- [Timing graph map](module01-01-timing-graph-map/README.md)
- [SDC clocks](module01-03-sdc-clocks/README.md)
- [Arrival & required](module02-01-arrival-required/README.md)
- [Slack & critical path](module02-03-slack-critical/README.md)
- [report_checks map](module03-01-report-checks/README.md)
- [OpenSTA engine (map)](module03-03-opensta-engine/README.md)
- [OpenSTA CLI & scripts](module06-01-opensta-cli/README.md)
- [Liberty vocabulary](module06-03-liberty-vocab/README.md)
- [Real read / link](module07-01-real-read-netlist/README.md)
- [Real SDC](module07-03-real-sdc/README.md)
- [Real report_checks](module08-01-real-report-checks/README.md)
- [Real OpenSTA evidence](module08-03-real-evidence/README.md)
- [Graph build algorithm](module09-01-graph-build/README.md)
- [Levelize & propagate](module09-03-levelize-propagate/README.md)
- [Slack algorithm](module10-01-slack-algo/README.md)
- [OpenSTA algo engine](module10-03-opensta-algo-engine/README.md)
- [STA C++ model](module14-01-sta-cpp-model/README.md)
- [Read find_path / report](module14-03-read-find-path/README.md)
- [Contribute to OpenSTA](module15-03-contribute-opensta/README.md)
- [OpenSTA path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_opensta/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
# Part D (also part_a / part_b / part_c scripts)
python3 courses/learn_opensta/scripts/scaffold_part_d.py
bash courses/learn_opensta/scripts/capture_part_d.sh
bash courses/learn_opensta/scripts/build_part_d_media.sh
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_opensta --modules
python3 platform/scripts/publish_course_platform.py learn_opensta
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#opensta` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#opensta

## License

CC BY 4.0 — see [LICENSE](LICENSE).
