# Don't-care CEC — step-by-step (for slides / transcript)

**Module:** `module03-01-dont-care`  
**Lab / algo:** `dont-care`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=dont-care&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Care mask

![Step 1](steps/01-mask.png)

**Caption (transcript):** Don't-cares mark PIs as X (−1) or fixed 0/1.

**Slide bullets:**

- X bits

**On-screen metrics:**

```
care set
```

## Step 2 — Fix c=0

![Step 2](steps/02-fix-c.png)

**Caption (transcript):** Mask with c fixed to 0 still catches the bad cex.

**Slide bullets:**

- partial

**On-screen metrics:**

```
still fail
```

## Step 3 — Fewer rows

![Step 3](steps/03-fewer.png)

**Caption (transcript):** Fixed bits shrink the checked assignment set.

**Slide bullets:**

- rows_checked

**On-screen metrics:**

```
<8
```

## Step 4 — X means ignore

![Step 4](steps/04-x-ok.png)

**Caption (transcript):** X on a bit means both 0/1 are allowed for that PI.

**Slide bullets:**

- don't care

**On-screen metrics:**

```
spec care
```

## Step 5 — Real DC

![Step 5](steps/05-use.png)

**Caption (transcript):** Synthesis don't-cares feed CEC care sets in industrial flows.

**Slide bullets:**

- ODC/SDC

**On-screen metrics:**

```
Next SEC
```

