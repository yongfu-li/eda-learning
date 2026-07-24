# Buffer candidate sites — step-by-step (for slides / transcript)

**Module:** `module02-01-candidate-sites`  
**Lab / algo:** `candidate-sites`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=candidate-sites&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Step size

![Step 1](steps/01-step.png)

**Caption (transcript):** candidate_step = 2 on the toy.

**Slide bullets:**

- Every 2 units

**On-screen metrics:**

```
step=2
```

## Step 2 — Show sites

![Step 2](steps/02-show.png)

**Caption (transcript):** Show candidates paints gray dots on e0–e2.

**Slide bullets:**

- Gray dots

**On-screen metrics:**

```
Exclude ends
```

## Step 3 — Count

![Step 3](steps/03-count.png)

**Caption (transcript):** Longer edges yield more sites.

**Slide bullets:**

- e0 denser

**On-screen metrics:**

```
sites≥1
```

## Step 4 — Exclude ends

![Step 4](steps/04-ends.png)

**Caption (transcript):** Driver and sink pins are not candidates.

**Slide bullets:**

- Internal only

**On-screen metrics:**

```
Legal inserts
```

## Step 5 — Ready for DP

![Step 5](steps/05-dp.png)

**Caption (transcript):** Sites feed Van Ginneken options next.

**Slide bullets:**

- Library next

**On-screen metrics:**

```
VG lab
```

