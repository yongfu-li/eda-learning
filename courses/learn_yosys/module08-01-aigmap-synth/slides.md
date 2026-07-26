---
marp: true
title: Why aigmap
paginate: true
---

# Why aigmap

Aigmap pushes toward AND/NOT form; synth -top runs Yosys's generic recipe to gate-level cells

---

## The idea
- GOLDEN: aigmap cells=7; synth cells=2 types=$_AOI3_,$_DFF_P_

---

## Before aigmap
![Before aigmap](assets/steps/01-opt.png)

---

## aigmap
![aigmap](assets/steps/02-aig.png)

---

## synth recipe
![synth recipe](assets/steps/03-synth.png)

---

## AOI3 + DFF
![AOI3 + DFF](assets/steps/04-out.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **aigmap-synth**
- Open **aigmap-synth**
- Show aigmap then synth; select $_AOI3_

---

## Implement track
- Call pass_aigmap_synth(); assert ok

---

## Pitfalls
- Expecting NAND2 from the toy techmap
- Skipping synth -top

---

## Try these
- From the common folder

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
aigmap then synth
assert cells seven then two AOI and DFF
```

---

## Next
- Complete the quiz for this part
- Next: real evidence engine

