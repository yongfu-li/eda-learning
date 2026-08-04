---
marp: true
title: Geometry load
paginate: true
---

# Geometry load

PEX starts from annotated layout segments , layers, nets, and segment ids

---

## The idea
- GOLDEN: 4 segments, 3 layers

---

## Segments
![Segments](assets/steps/01-segments.png)

---

## Layers
![Layers](assets/steps/02-layers.png)

---

## Nets
![Nets](assets/steps/03-nets.png)

---

## Ids
![Ids](assets/steps/04-ids.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call load_geometry(); assert segment_count==4 and layer_count==3

---

## Pitfalls
- Counting ports as segments
- Ignoring VIA layer in layer_count

---

## Your turn
- Next: resistance extract

