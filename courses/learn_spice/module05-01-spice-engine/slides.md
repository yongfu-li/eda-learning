---
marp: true
title: Why engine
paginate: true
---

# Why engine

A tiny engine chains DC, NR, transient, and diode checks on one netlist

---

## The idea
- GOLDEN: dc_v2=3, nr converged, tran final_v2≈2.255181, diode NR ok

---

## DC
![DC](assets/steps/01-dc.png)

---

## NR
![NR](assets/steps/02-nr.png)

---

## TRAN
![TRAN](assets/steps/03-tr.png)

---

## Diode NR
![Diode NR](assets/steps/04-d.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call spice_engine(); assert ok, dc_v2≈3.0, nr_converged, diode converged

---

## Pitfalls
- Reporting partial results
- Mixing linear and nonlinear paths inconsistently

---

## Your turn
- Next: offline benchmark compare, then wrap

