---
marp: true
title: Offline compare
paginate: true
---

# Offline compare

Track A prints power_compare without the browser

---

## The idea
- Load tiny_power.json; print chip_ptot, ir_drop_sink, marker_count, ok

---

## Why offline
- Print power_compare metrics offline without the browser

---

## Commands
- Python3 -c "from solvers import power_compare; print(power_compare())" in common/

---

## What to compare
- Load tiny_power.json; print chip_ptot, ir_drop_sink, marker_count, ok

---

## Next
- Complete the quiz for this part
- Continue to the wrap module

