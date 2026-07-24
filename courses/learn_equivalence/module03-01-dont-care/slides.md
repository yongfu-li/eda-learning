---
marp: true
title: Don't-care
paginate: true
---

# Don't-care

Real specs have don't-cares , CEC must only compare care inputs, not illegal or unconstrained bits

---

## The idea
- Dont_care_mask with c fixed to 0 still finds a=1,b=1,c=0 mismatch on impl_bad

---

## Care mask
![Care mask](assets/steps/01-mask.png)

---

## Fix c=0
![Fix c=0](assets/steps/02-fix-c.png)

---

## Fewer rows
![Fewer rows](assets/steps/03-fewer.png)

---

## X means ignore
![X means ignore](assets/steps/04-x-ok.png)

---

## Real DC
![Real DC](assets/steps/05-use.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call dont_care_mask(spec, impl_bad, {'a':-1,'b':-1,'c':0})

---

## Pitfalls
- Treating X as 0
- Checking illegal input combinations as failures

---

## Your turn
- Next: sequential unrolling

