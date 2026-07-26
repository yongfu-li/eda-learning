---
marp: true
title: Via enclose
paginate: true
---

# Via enclose

Enclosure is a region pattern across layers: inner VIA must sit inside outer metal with margin

---

## The idea
- V inside A on M1 with margins ≥1 → OK
- V not inside C on M2 → enclosure marker
- GOLDEN enclosure_markers=1

---

## Via V
![Via V](assets/steps/01-v.png)

---

## M1 OK
![M1 OK](assets/steps/02-m1.png)

---

## M2 fail
![M2 fail](assets/steps/03-m2.png)

---

## Marker
![Marker](assets/steps/04-mark.png)

---

## API
![API](assets/steps/05-api.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call multi_layer_via_check(); assert m1_ok and enclosure_markers==1

---

## Pitfalls
- Requiring same-layer enclosure
- Ignoring margin limit

---

## Your turn
- Next: multi-layer interactions

