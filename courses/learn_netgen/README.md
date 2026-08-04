# learn_netgen

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Domain](https://img.shields.io/badge/domain-Netgen-orange)](docs/MODULES.md)

**learn_netgen** is the open learning path for *Netgen* — Part A **LVS compare map**, Part B **real Netgen CLI evidence**, Part C **algorithms bound to LVS reports**, then Part D **internals / contribute**. Companion to [learn_lvs](../learn_lvs/README.md) and [learn_magic](../learn_magic/README.md).

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

- [Welcome to Netgen](module00-00-intro/README.md)
- [Read netlists map](module01-01-read-netlists-map/README.md)
- [Device classes map](module01-03-device-classes-map/README.md)
- [Flatten permute map](module02-01-flatten-permute-map/README.md)
- [Compare nets map](module02-03-compare-nets-map/README.md)
- [LVS report map](module03-01-lvs-report-map/README.md)
- [Netgen engine (map)](module03-03-netgen-engine/README.md)
- [Netgen CLI & scripts](module06-01-netgen-cli/README.md)
- [SPICE vocabulary](module06-03-spice-vocab/README.md)
- [Real read SPICE](module07-01-real-read-spice/README.md)
- [Real LVS compare](module07-03-real-lvs-compare/README.md)
- [Real LVS report](module08-01-real-lvs-report/README.md)
- [Real Netgen evidence](module08-03-netgen-evidence/README.md)
- [Hash devices algorithm](module09-01-hash-devices-algo/README.md)
- [Match nets algorithm](module09-03-match-nets-algo/README.md)
- [Permute pins algorithm](module10-01-permute-pins-algo/README.md)
- [Netgen algo engine](module10-03-netgen-algo-engine/README.md)
- [Obj / Netlist / Element model](module14-01-netcomp-model/README.md)
- [Read compare C](module14-03-read-compare-c/README.md)
- [Contribute to Netgen](module15-03-contribute-netgen/README.md)
- [Netgen path complete](module99-00-wrap/README.md)

## Browse or clone

Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).

## Consume from the parent

Open [platform courses](../../platform/courses/learn_netgen/) after publish, or work Track A under `common/`.

## Author: publish or update

```bash
python3 courses/learn_netgen/scripts/scaffold_course.py
python3 courses/learn_netgen/scripts/generate_part_a.py
python3 courses/learn_netgen/scripts/generate_part_b.py
python3 courses/learn_netgen/scripts/generate_part_c.py
python3 courses/learn_netgen/scripts/scaffold_part_d.py
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_netgen --modules
python3 platform/scripts/publish_course_platform.py learn_netgen
```

## Two learning tracks

| Track | Path |
|-------|------|
| A Implement | [`common/`](common/) |
| B Browser | platform tools `#netgen` |

See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).

## Module landings

Full table: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

http://127.0.0.1:8080/tools/index.html#netgen

## License

CC BY 4.0 — see [LICENSE](LICENSE).
