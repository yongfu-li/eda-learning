---
marp: true
title: Candidates
paginate: true
---

# Candidates

Van Ginneken and slew-driven flows only insert where candidates exist

---

## The idea
- Walk each edge; every candidate_step units place a site excluding endpoints
- Gray dots mark legal insert points

---

## Step size
![Step size](assets/steps/01-step.png)

---

## Show sites
![Show sites](assets/steps/02-show.png)

---

## Count
![Count](assets/steps/03-count.png)

---

## Exclude ends
![Exclude ends](assets/steps/04-ends.png)

---

## Ready for DP
![Ready for DP](assets/steps/05-dp.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `candidate_sites(data)`
- Assert length > 0 for tiny_buf

---

## Pitfalls
- Placing sites past the far endpoint
- Using step zero
- Forgetting diagonal HV walk

---

## Your turn
- Next: the buffer library cells you can instantiate

