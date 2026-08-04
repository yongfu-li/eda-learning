# Width checker — step-by-step (for slides / transcript)

**Module:** `module01-03-width-checker`  
**Lab / algo:** `width-checker`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=width-checker&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Rule

![Step 1](steps/01-rule.png)

**Caption (transcript):** W.M1 width limit 3 on M1 layer.

**Slide bullets:**

- W.M1

**On-screen metrics:**

```
limit=3
```

## Step 2 — Scan

![Step 2](steps/02-scan.png)

**Caption (transcript):** Walk M1 shapes A, B, and D.

**Slide bullets:**

- M1

**On-screen metrics:**

```
A/B/D
```

## Step 3 — Measure

![Step 3](steps/03-measure.png)

**Caption (transcript):** Compare min(width,height) to limit.

**Slide bullets:**

- min

**On-screen metrics:**

```
w/h
```

## Step 4 — Hit

![Step 4](steps/04-hit.png)

**Caption (transcript):** Shape D is too narrow — width=1.

**Slide bullets:**

- D

**On-screen metrics:**

```
1
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: width viol=1, rule W.M1.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1
```

