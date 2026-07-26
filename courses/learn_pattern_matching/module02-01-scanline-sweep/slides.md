---
marp: true
title: Scanline
paginate: true
---

# Scanline

Production matchers often sweep a scanline across edges instead of O(n²) pairs only

---

## The idea
- M1 has 3 shapes → 6 events (enter/leave each)
- Events sort by x then enter-before-leave

---

## Enter
![Enter](assets/steps/01-enter.png)

---

## Leave
![Leave](assets/steps/02-leave.png)

---

## Sort
![Sort](assets/steps/03-sort.png)

---

## M1 count
![M1 count](assets/steps/04-n.png)

---

## Use
![Use](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call scanline_events('M1'); assert len==6

---

## Pitfalls
- Forgetting leave events
- Sorting leaves before enters at same x

---

## Your turn
- Next: marker emission

