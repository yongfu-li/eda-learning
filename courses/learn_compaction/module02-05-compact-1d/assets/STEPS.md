# 1-D compaction (X or Y) — step-by-step (for slides / transcript)

**Module:** `module02-05-compact-1d`  
**Lab / algo:** `compact-1d`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=compact-1d&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Before

![Step 1](steps/01-before.png)

**Caption (transcript):** Initial X span = 20.

**Slide bullets:**

- span

**On-screen metrics:**

```
20
```

## Step 2 — Run

![Step 2](steps/02-run.png)

**Caption (transcript):** compact_1d(layout, 'x').

**Slide bullets:**

- API

**On-screen metrics:**

```
X
```

## Step 3 — After

![Step 3](steps/03-after.png)

**Caption (transcript):** After X span = 14.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
14
```

## Step 4 — Gaps

![Step 4](steps/04-gaps.png)

**Caption (transcript):** Whitespace between A–B–C shrinks to min_gap.

**Slide bullets:**

- pack

**On-screen metrics:**

```
gap=1
```

## Step 5 — Y untouched

![Step 5](steps/05-y.png)

**Caption (transcript):** Y coordinates unchanged in a pure X pass.

**Slide bullets:**

- axis

**On-screen metrics:**

```
X only
```

