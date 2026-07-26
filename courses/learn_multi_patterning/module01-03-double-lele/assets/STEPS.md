# LELE double patterning — step-by-step (for slides / transcript)

**Module:** `module01-03-double-lele`  
**Lab / algo:** `double-lele`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=double-lele&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — LELE idea

![Step 1](steps/01-idea.png)

**Caption (transcript):** LELE DP = two masks via 2-coloring.

**Slide bullets:**

- LELE

**On-screen metrics:**

```
2 masks
```

## Step 2 — Two masks

![Step 2](steps/02-two.png)

**Caption (transcript):** Assign color 0/1 to features.

**Slide bullets:**

- 2-color

**On-screen metrics:**

```
0/1
```

## Step 3 — Color attempt

![Step 3](steps/03-try.png)

**Caption (transcript):** BFS 2-color the conflict graph.

**Slide bullets:**

- BFS

**On-screen metrics:**

```
attempt
```

## Step 4 — Odd cycle

![Step 4](steps/04-odd.png)

**Caption (transcript):** Triangle A-B-C is an odd cycle.

**Slide bullets:**

- odd

**On-screen metrics:**

```
fail
```

## Step 5 — Fail

![Step 5](steps/05-fail.png)

**Caption (transcript):** GOLDEN: lele_double ok=False.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok=false
```

