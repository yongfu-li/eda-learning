# learn_partitioning — module index

Lab-driven syllabus with **hierarchical module ids** (`moduleSS-AA-slug`).
Odd `AA` slots are preferred so new algorithms can be inserted without renumbering.
Published ids are **stable keys**; order below is the teaching path.

Status: **ref** = browser lab shipped under `platform/tools/` (algorithm modules).

| Id | Kind | Module | Lab / activity | Status |
|----|------|--------|----------------|--------|
| `module00-00-intro` | `intro` | [Welcome to partitioning for EDA](../module00-00-intro/README.md) | — | — |
| `module01-01-cutsize-balance` | `lab` | [Cutsize and balance](../module01-01-cutsize-balance/README.md) | `cutsize-balance` | **ref** |
| `module01-03-initial-bipartition` | `lab` | [Initial bipartition](../module01-03-initial-bipartition/README.md) | `initial-bipartition` | **ref** |
| `module02-01-kl-partition` | `lab` | [Kernighan–Lin bipartition](../module02-01-kl-partition/README.md) | `kl-partition` | **ref** |
| `module02-03-fm-partition` | `lab` | [Fiduccia–Mattheyses bipartition](../module02-03-fm-partition/README.md) | `fm-partition` | **ref** |
| `module02-05-spectral-partition` | `lab` | [Spectral bipartition](../module02-05-spectral-partition/README.md) | `spectral-partition` | **ref** |
| `module02-07-recursive-bisection` | `lab` | [Recursive bisection](../module02-07-recursive-bisection/README.md) | `recursive-bisection` | **ref** |
| `module03-01-multiway-partition` | `lab` | [Multiway partitioning](../module03-01-multiway-partition/README.md) | `multiway-partition` | **ref** |
| `module03-03-terminal-propagation` | `lab` | [Terminal propagation](../module03-03-terminal-propagation/README.md) | `terminal-propagation` | **ref** |
| `module03-05-hypergraph-partition` | `lab` | [Hypergraph partitioning](../module03-05-hypergraph-partition/README.md) | `hypergraph-partition` | **ref** |
| `module04-01-multilevel-partition` | `lab` | [Multilevel partitioning](../module04-01-multilevel-partition/README.md) | `multilevel-partition` | **ref** |
| `module05-01-offline-benchmark-compare` | `lab` | [Offline benchmark compare](../module05-01-offline-benchmark-compare/README.md) | `benchmarks/partitioning` | S |
| `module99-00-wrap` | `wrap` | [Partitioning path complete](../module99-00-wrap/README.md) | — | — |

## Sections

| Section | Focus |
|---------|--------|
| `00` | Intro |
| `01` | Foundations (cutsize/balance, initial bipartition) |
| `02` | Classic bipartition (KL, FM, spectral, recursive) |
| `03` | Multiway, terminals, hypergraph |
| `04` | Multilevel V-cycle |
| `05` | Offline evidence |
| `99` | Wrap |

## Dual tracks

See [TWO_TRACKS.md](TWO_TRACKS.md).

## Algorithm walkthroughs (PPT / transcript)

Step frames + captions for **all 10 algorithm labs**: [WALKTHROUGHS.md](WALKTHROUGHS.md).
Each lab module has `assets/STEPS.md`, `assets/steps/*.png`, and media (`slides.pptx` / `.pdf` / `audio/`).

**Build media in WSL** (LibreOffice + edge-tts + ffmpeg):

```bash
cd /mnt/d/proj/designs/eda_learning
bash courses/learn_partitioning/scripts/build_all_media.sh
```
