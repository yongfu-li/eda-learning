---
marp: true
title: Why synth
paginate: true
---

# Why synth

A Yosys synth script chains named passes into one recipe

---

## The idea
- GOLDEN: full chain completes with nand area mapping

---

## Pass recipe chain
![Pass recipe chain](assets/steps/01-chain.png)

---

## proc step
![proc step](assets/steps/02-proc.png)

---

## Mid passes
![Mid passes](assets/steps/03-mid.png)

---

## techmap area
![techmap area](assets/steps/04-map.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_synth_script(); assert nand_count==6

---

## Pitfalls
- Skipping flatten
- Wrong pass order

---

## Your turn
- Next: yosys engine

