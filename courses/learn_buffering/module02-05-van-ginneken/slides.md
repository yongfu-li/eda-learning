---
marp: true
title: Van Ginneken
paginate: true
---

# Van Ginneken

Van Ginneken is the classic DP for buffer insertion on trees

---

## The idea
- For each edge build wire-only and mid-buffer options as (c,d) pairs
- Dominate_prune keeps non-dominated fronts
- Pick minimum delay
- Sum along the toy tree

---

## Options
![Options](assets/steps/01-opts.png)

---

## Prune
![Prune](assets/steps/02-prune.png)

---

## Best edge
![Best edge](assets/steps/03-best.png)

---

## Net delay
![Net delay](assets/steps/04-net.png)

---

## Improved
![Improved](assets/steps/05-win.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call `van_ginneken_net(data)`
- Assert best_delay ≤ wire_delay

---

## Pitfalls
- Keeping dominated options
- Double-counting branch loads
- Forgetting wire-only option

---

## Your turn
- Next: slew-driven greedy insertion

