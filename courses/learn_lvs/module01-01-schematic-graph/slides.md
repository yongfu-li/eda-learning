---
marp: true
title: Schematic graph
paginate: true
---

# Schematic graph

LVS starts from the schematic , devices, nets, and pin edges before layout extract

---

## The idea
- GOLDEN: 2 devices, 4 nets, mn1/mp1

---

## Devices
![Devices](assets/steps/01-devices.png)

---

## Nets
![Nets](assets/steps/02-nets.png)

---

## Pins
![Pins](assets/steps/03-pins.png)

---

## Edges
![Edges](assets/steps/04-edges.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call schematic_graph(); assert device_count==2 and net_count==4

---

## Pitfalls
- Counting layout shapes as schematic devices
- Missing supply nets

---

## Your turn
- Next: device recognition

