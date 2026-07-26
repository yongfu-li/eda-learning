---
marp: true
title: Region width
paginate: true
---

# Region width

Width patterns treat a polygon as a region and measure its smallest extent

---

## The idea
- D is 1×6 on M1; min_width[M1]=3 → width marker
- GOLDEN width_markers=1

---

## Thin D
![Thin D](assets/steps/01-d.png)

---

## Min width
![Min width](assets/steps/02-mw.png)

---

## Measure
![Measure](assets/steps/03-min.png)

---

## Marker
![Marker](assets/steps/04-mark.png)

---

## Others
![Others](assets/steps/05-ok.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call match_width(); assert one marker on D

---

## Pitfalls
- Using area instead of min(w,h)
- Applying M2 limits to M1

---

## Your turn
- Next: scanline sweep

