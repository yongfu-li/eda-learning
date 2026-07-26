# learn_dft_insert



[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)

[![Role](https://img.shields.io/badge/role-course-blue)](../../eda.md)

[![Domain](https://img.shields.io/badge/domain-DFT%20insert-orange)](docs/MODULES.md)



**learn_dft_insert** is the open learning path for *DFT insert* — scan SDFF cells, SE/SI/SO, chain stitch, lockup latches, netlist transform, markers, and a tiny DFT engine on `tiny_dft.json`.



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



- [Welcome to DFT insert](module00-00-intro/README.md)
- [Scan flops](module01-01-scan-flops/README.md)
- [Scan enable](module01-03-scan-enable/README.md)
- [Chain stitch](module02-01-chain-stitch/README.md)
- [Scan order](module02-03-scan-order/README.md)
- [Lockup latch](module03-01-lockup-latch/README.md)
- [Netlist transform](module03-03-netlist-transform/README.md)
- [DFT markers](module04-01-dft-markers/README.md)
- [Scan chain view](module04-03-scan-chain-view/README.md)
- [DFT engine integration](module05-01-dft-engine/README.md)
- [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md)
- [DFT insert path complete](module99-00-wrap/README.md)



Optional media (`slides.pptx`, `slides.pdf`, `video.mp4`) is produced with module-slides.



## Browse or clone



Part of the EDA learning monorepo. See parent [`eda.md`](../../eda.md).



## Consume from the parent



Open [platform courses](../../platform/courses/learn_dft_insert/) after publish, or work Track A under `common/`.



## Author: publish or update



```bash

python3 courses/learn_dft_insert/scripts/scaffold_course.py

bash courses/learn_dft_insert/scripts/capture_all_walkthroughs.sh

bash courses/learn_dft_insert/scripts/capture_lab_snaps.sh

bash courses/learn_dft_insert/scripts/build_all_media.sh

python3 .cursor/skills/module-slides/scripts/verify_course_readme.py courses/learn_dft_insert --modules

```



## Two learning tracks



| Track | Path |

|-------|------|

| A Implement | [`common/`](common/) |

| B Browser | platform tools `#dft` |



See [docs/TWO_TRACKS.md](docs/TWO_TRACKS.md).



## Module landings



| Module | README |

|--------|--------|

| `module00-00-intro` | [Welcome to DFT insert](module00-00-intro/README.md) |
| `module01-01-scan-flops` | [Scan flops](module01-01-scan-flops/README.md) |
| `module01-03-scan-enable` | [Scan enable](module01-03-scan-enable/README.md) |
| `module02-01-chain-stitch` | [Chain stitch](module02-01-chain-stitch/README.md) |
| `module02-03-scan-order` | [Scan order](module02-03-scan-order/README.md) |
| `module03-01-lockup-latch` | [Lockup latch](module03-01-lockup-latch/README.md) |
| `module03-03-netlist-transform` | [Netlist transform](module03-03-netlist-transform/README.md) |
| `module04-01-dft-markers` | [DFT markers](module04-01-dft-markers/README.md) |
| `module04-03-scan-chain-view` | [Scan chain view](module04-03-scan-chain-view/README.md) |
| `module05-01-dft-engine` | [DFT engine integration](module05-01-dft-engine/README.md) |
| `module05-03-offline-benchmark-compare` | [Offline benchmark compare](module05-03-offline-benchmark-compare/README.md) |
| `module99-00-wrap` | [DFT insert path complete](module99-00-wrap/README.md) |



Full table: [docs/MODULES.md](docs/MODULES.md).



## Browser labs



http://127.0.0.1:8080/tools/index.html#dft



## License



CC BY 4.0 — see [LICENSE](LICENSE).
