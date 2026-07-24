---
marp: true
title: SAT CNF lite
paginate: true
---

# SAT CNF lite

Industrial CEC uses SAT on a miter , first learn clause count on a tiny netlist

---

## The idea
- Encode_sat_cnf_lite assigns PI vars 1..3 and adds clauses per AND/OR/NOT gate

---

## Tseitin encode
![Tseitin encode](assets/steps/01-tseitin.png)

---

## Spec CNF
![Spec CNF](assets/steps/02-spec.png)

---

## Assert miter=1
![Assert miter=1](assets/steps/03-assert.png)

---

## SAT finds diff
![SAT finds diff](assets/steps/04-sat.png)

---

## UNSAT means equiv
![UNSAT means equiv](assets/steps/05-unsat.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call encode_sat_cnf_lite(spec)

---

## Pitfalls
- CNF on outputs without Tseitin auxiliaries
- Expecting full Glucose run

---

## Your turn
- Next: counterexample debug from CEC

