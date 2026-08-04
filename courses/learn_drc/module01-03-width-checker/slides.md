---
marp: true
title: Width
paginate: true
---

# Width

Width rules flag shapes whose min(width,height) is below the deck limit

---

## The idea
- GOLDEN: width viol=1 on D, rule W.M1

---

## Rule
![Rule](assets/steps/01-rule.png)

---

## Scan
![Scan](assets/steps/02-scan.png)

---

## Measure
![Measure](assets/steps/03-measure.png)

---

## Hit
![Hit](assets/steps/04-hit.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call check_width(); assert count==1 and violations[0].shapes==['D']

---

## Pitfalls
- Using max edge instead of min dimension
- Missing rule_id on violations

---

## Your turn
- Next: spacing checker

