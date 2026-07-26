---
marp: true
title: Why check suite
paginate: true
---

# Why check suite

STA, DRC, LVS, ERC, antenna, and IR form the toy check suite

---

## The idea
- GOLDEN: fail_count=2, pass_count=4

---

## Six checks
![Six checks](assets/steps/01-suite.png)

---

## STA fail
![STA fail](assets/steps/02-sta.png)

---

## Layout pass
![Layout pass](assets/steps/03-layout.png)

---

## Antenna fail
![Antenna fail](assets/steps/04-ant.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call run_checks(); assert fail_count==2 and pass_count==4

---

## Pitfalls
- Counting IR as fail
- Missing antenna in fail set

---

## Your turn
- Next: ECO loop

