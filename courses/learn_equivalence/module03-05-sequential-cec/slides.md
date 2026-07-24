---
marp: true
title: Sequential CEC
paginate: true
---

# Sequential CEC

Sequential CEC asks whether two FSMs agree on all input sequences , we check 2 unroll steps as literacy

---

## The idea
- Sequential_cec_lite enumerates input sequences

---

## Good SEC
![Good SEC](assets/steps/01-good.png)

---

## Bad SEC
![Bad SEC](assets/steps/02-bad.png)

---

## Bounded only
![Bounded only](assets/steps/03-bound.png)

---

## Same init
![Same init](assets/steps/04-init.png)

---

## Done
![Done](assets/steps/05-done.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call sequential_cec_lite(seq_spec, seq_good, 2) True; seq_bad False

---

## Pitfalls
- Checking one reset cycle only
- Comparing comb outputs without state update

---

## Your turn
- Next: offline benchmark, then wrap

