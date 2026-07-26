---
marp: true
title: Why offline compare
paginate: true
---

# Why offline compare

Print pass-map and real Yosys compare metrics without the browser

---

## Pass-map compare
- Run the pass-map compare helper from the common folder

---

## Pass-map compare — try these

```
cd courses/learn_yosys/common
python3 -c "from solvers import yosys_compare; print(yosys_compare())"
```

---

## Real compare
- Run the real evidence compare helper

---

## Real compare — try these

```
cd courses/learn_yosys/common
python3 -c "from real_solvers import real_yosys_compare; print(real_yosys_compare())"
```

---

## Browser lab track
- Open offline-benchmark-compare if you prefer the browser view of the same metrics

---

## Implement track
- Confirm both compare helpers print ok goldens from the common folder

---

## Pitfalls
- Comparing only one track
- Ignoring checked-in goldens when Yosys is missing

---

## Next
- Complete the quiz for this part
- Continue into the real CLI modules, then Part C algorithms

