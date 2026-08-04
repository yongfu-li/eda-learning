---
marp: true
title: Why Paint
paginate: true
---

# Why Paint

Place rectangles on named Magic layers (paint)

---

## The idea
- GOLDEN: 6 rects; metal1 paint=2

---

## Six rectangles
![Six rectangles](assets/steps/01-rects.png)

---

## Layer names
![Layer names](assets/steps/02-layers.png)

---

## metal1 paint
![metal1 paint](assets/steps/03-metal1.png)

---

## Paint command
![Paint command](assets/steps/04-paint.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **paint-layers**
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
6 rects; metal1 paint=2.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Magic Part A map, then the real CLI track

