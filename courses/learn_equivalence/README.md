# learn_equivalence

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)
[![Labs](https://img.shields.io/badge/labs-9-green)](docs/MODULES.md)
[![Domain](https://img.shields.io/badge/domain-equivalence-orange)](docs/MODULES.md)

**learn_equivalence** is the open learning path for *combinational and sequential equivalence checking*: spec vs impl, miter construction, truth-table CEC, structural hashing, SAT/CNF lite, counterexamples, don't-cares, and sequential unrolling.

Use Track A (`common/`) or browser labs (Track B) after module-slides media is built.

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

```
learn_equivalence/
├── README.md · LICENSE · common/ · docs/ · scripts/ · module*/
```

Optional per module: `slides.pptx`, `slides.pdf`, `audio/`, `video.mp4` (module-slides pipeline).

## Browse or clone

```bash
cd courses/learn_equivalence
python3 common/test_solvers.py -v
```

## Consume from the parent

Prerequisite: [learn_synthesis](../learn_synthesis/README.md) · [learn_retiming](../learn_retiming/README.md). Lane: [`eda.md`](../../eda.md).

## Author: publish or update

```bash
python3 courses/learn_equivalence/scripts/scaffold_course.py
bash courses/learn_equivalence/scripts/build_all_media.sh
python3 platform/scripts/publish_course_platform.py learn_equivalence
python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_equivalence --modules
```

## Two learning tracks

| Track | Where |
|-------|-------|
| **A — Implement** | `common/tiny_equiv.json`, `solvers.py` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |
| **B — Browser lab** | `platform/tools/<lab-id>/` — [TWO_TRACKS.md](docs/TWO_TRACKS.md) |

## Module landings

| Key | Module | Kind |
|-----|--------|------|
| `00-00-intro` | [Welcome to equivalence checking](module00-00-intro/README.md) | `intro` |
| `01-01-spec-impl` | [Spec vs implementation](module01-01-spec-impl/README.md) | `lab` |
| `01-03-miter-build` | [Miter construction](module01-03-miter-build/README.md) | `lab` |
| `02-01-truth-table-cec` | [Truth-table CEC](module02-01-truth-table-cec/README.md) | `lab` |
| `02-03-structural-hash` | [Structural hash / FRAIG lite](module02-03-structural-hash/README.md) | `lab` |
| `02-05-sat-cnf-lite` | [SAT / CNF encoding lite](module02-05-sat-cnf-lite/README.md) | `lab` |
| `02-07-counterexample` | [Counterexample debug](module02-07-counterexample/README.md) | `lab` |
| `03-01-dont-care` | [Don't-care CEC](module03-01-dont-care/README.md) | `lab` |
| `03-03-sequential-unroll` | [Sequential unrolling](module03-03-sequential-unroll/README.md) | `lab` |
| `03-05-sequential-cec` | [Sequential CEC lite](module03-05-sequential-cec/README.md) | `lab` |
| `05-01-offline-benchmark-compare` | [Offline benchmark compare](module05-01-offline-benchmark-compare/README.md) | `offline` |
| `99-00-wrap` | [Equivalence path complete](module99-00-wrap/README.md) | `wrap` |

Full index: [docs/MODULES.md](docs/MODULES.md).

## Browser labs

- [spec-impl](https://universal-verification-methodology.github.io/learning/tools/spec-impl/)
- [miter-build](https://universal-verification-methodology.github.io/learning/tools/miter-build/)
- [truth-table-cec](https://universal-verification-methodology.github.io/learning/tools/truth-table-cec/)
- [structural-hash](https://universal-verification-methodology.github.io/learning/tools/structural-hash/)
- [sat-cnf-lite](https://universal-verification-methodology.github.io/learning/tools/sat-cnf-lite/)
- [counterexample](https://universal-verification-methodology.github.io/learning/tools/counterexample/)
- [dont-care](https://universal-verification-methodology.github.io/learning/tools/dont-care/)
- [sequential-unroll](https://universal-verification-methodology.github.io/learning/tools/sequential-unroll/)
- [sequential-cec](https://universal-verification-methodology.github.io/learning/tools/sequential-cec/)

## License

[CC BY 4.0](LICENSE)
