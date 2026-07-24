# Wire R/C model — step-by-step (for slides / transcript)

**Module:** `module01-01-wire-rc`  
**Lab / algo:** `wire-rc`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=wire-rc&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Net topology

![Step 1](steps/01-net.png)

**Caption (transcript):** Driver D feeds S0; S0 fans to S1 and S2 on the 12×8 chip.

**Slide bullets:**

- Three sinks
- Three edges

**On-screen metrics:**

```
3 edges
```

## Step 2 — Edge e0 length

![Step 2](steps/02-e0.png)

**Caption (transcript):** D→S0 is four units Manhattan on the starter.

**Slide bullets:**

- Manhattan
- Unit parasitics

**On-screen metrics:**

```
len≈4
```

## Step 3 — R and C

![Step 3](steps/03-rc.png)

**Caption (transcript):** With unit parasitics, length four yields R=4 and C=4.

**Slide bullets:**

- r_per=1
- c_per=1

**On-screen metrics:**

```
R=4
```

## Step 4 — Elmore

![Step 4](steps/04-elmore.png)

**Caption (transcript):** Delay ≈ R·(C/2 + Cload) on a lumped segment.

**Slide bullets:**

- Lumped model
- Toy

**On-screen metrics:**

```
Elmore
```

## Step 5 — Why it matters

![Step 5](steps/05-why.png)

**Caption (transcript):** Longer edges dominate slew and delay — candidates appear next.

**Slide bullets:**

- RC drives insert
- Next lab

**On-screen metrics:**

```
Slew budget
```

