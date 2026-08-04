---
marp: true
title: Why GDS
paginate: true
---

# Why GDS

Map Magic layers to GDS layer numbers

---

## The idea
- GOLDEN: gds_layer_count=6; metal1→49

---

## GDS map
![GDS map](assets/steps/01-map.png)

---

## metal1→49
![metal1→49](assets/steps/02-metal1.png)

---

## Six entries
![Six entries](assets/steps/03-count.png)

---

## Streamout
![Streamout](assets/steps/04-stream.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **gds-write-map**
- Run the stage buttons and Check the goldens

---

## Implement track
- From common/, run solvers.py and confirm MAGIC_PARTA_OK

---

## Pitfalls
- Mixing KLayout viewer shortcuts with Magic paint commands
- Forgetting min_width when reading DRC errors

---

## Try these
- From the common folder, run the Magic map self-test

---

## Try these — try these

```
cd courses/learn_magic/common
python3 solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
gds_layer_count=6; metal1→49.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Magic Part A map, then the real CLI track

