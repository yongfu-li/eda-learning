---
marp: true
title: Why netlists
paginate: true
---

# Why netlists

Every SPICE solve starts from a netlist , nodes, elements, and a ground reference

---

## The idea
- GOLDEN: 5 elements, 2 unknown nodes (1, 2), ground 0

---

## Netlist
![Netlist](assets/steps/01-nl.png)

---

## Ground
![Ground](assets/steps/02-gnd.png)

---

## Unknowns
![Unknowns](assets/steps/03-un.png)

---

## Elements
![Elements](assets/steps/04-el.png)

---

## Count
![Count](assets/steps/05-cnt.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call netlist_stats(); assert element_count==5, unknown_nodes==2, ground=='0'

---

## Pitfalls
- Counting ground as unknown
- Ignoring element ids vs node names

---

## Your turn
- Next: stamp R and V into MNA

