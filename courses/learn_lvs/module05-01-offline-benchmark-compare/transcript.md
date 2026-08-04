# Offline benchmark compare

**Module id:** module05-01-offline-benchmark-compare

## Slide 1 — Offline compare

Track A prints lvs_compare_metrics without the browser.

## Slide 2 — The idea

Load tiny_lvs.json; print sch_devices, lay_devices, matched_nets, mismatch_count, ok.

## Slide 3 — Why offline

Print lvs_compare_metrics offline without the browser.

## Slide 4 — Commands

python3 -c "from solvers import lvs_compare_metrics; print(lvs_compare_metrics())" in common/

## Slide 5 — What to compare

Load tiny_lvs.json; print sch_devices, lay_devices, matched_nets, mismatch_count, ok.

## Slide 6 — Next

Continue to the wrap module.
