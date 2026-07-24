---
marp: true
title: Counterexample
paginate: true
---

# Counterexample

When CEC fails, the counterexample is your shortest bug story , one input pattern where POs differ

---

## The idea
- Find_counterexample(spec, impl_bad) returns {'a':1,'b':1,'c':0}; spec_out=1, impl_out=0

---

## Find cex
![Find cex](assets/steps/01-find.png)

---

## Simulate both
![Simulate both](assets/steps/02-sim.png)

---

## Miter lights
![Miter lights](assets/steps/03-miter.png)

---

## Fix the bug
![Fix the bug](assets/steps/04-fix.png)

---

## Recheck CEC
![Recheck CEC](assets/steps/05-recheck.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call find_counterexample(spec, impl_bad); print spec and impl PO at cex

---

## Pitfalls
- Ignoring cex and random sim
- Fixing only one corner without regression

---

## Your turn
- Next: don't-care CEC

