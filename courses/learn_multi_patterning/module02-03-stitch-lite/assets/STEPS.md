# Stitch lite (break odd cycle) — step-by-step (for slides / transcript)

**Module:** `module02-03-stitch-lite`  
**Lab / algo:** `stitch-lite`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=stitch-lite&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Odd cycle

![Step 1](steps/01-odd.png)

**Caption (transcript):** Triangle blocks DP.

**Slide bullets:**

- odd

**On-screen metrics:**

```
ABC
```

## Step 2 — Split C

![Step 2](steps/02-split.png)

**Caption (transcript):** Replace C with C1 and C2.

**Slide bullets:**

- stitch

**On-screen metrics:**

```
C→C1,C2
```

## Step 3 — New edges

![Step 3](steps/03-new.png)

**Caption (transcript):** Conflict graph changes.

**Slide bullets:**

- repair

**On-screen metrics:**

```
edges
```

## Step 4 — Re-color

![Step 4](steps/04-re.png)

**Caption (transcript):** 2-color the stitched layout.

**Slide bullets:**

- LELE

**On-screen metrics:**

```
retry
```

## Step 5 — DP OK

![Step 5](steps/05-ok.png)

**Caption (transcript):** GOLDEN stitch makes DP ok.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
dp_ok
```

