# Constraint graph — step-by-step (for slides / transcript)

**Module:** `module02-01-constraint-graph`  
**Lab / algo:** `constraint-graph`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=constraint-graph&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Nodes

![Step 1](steps/01-nodes.png)

**Caption (transcript):** Left/right edge nodes per object.

**Slide bullets:**

- L_/R_

**On-screen metrics:**

```
vars
```

## Step 2 — Size

![Step 2](steps/02-size.png)

**Caption (transcript):** R_id ≥ L_id + width(id).

**Slide bullets:**

- size edge

**On-screen metrics:**

```
width
```

## Step 3 — Spacing

![Step 3](steps/03-space.png)

**Caption (transcript):** Next cell’s left ≥ previous right + gap.

**Slide bullets:**

- gap edge

**On-screen metrics:**

```
min_gap
```

## Step 4 — Source

![Step 4](steps/04-src.png)

**Caption (transcript):** SRC_X anchors the left of the chip.

**Slide bullets:**

- anchor

**On-screen metrics:**

```
0
```

## Step 5 — Count

![Step 5](steps/05-count.png)

**Caption (transcript):** GOLDEN: about 10 constraint edges on X.

**Slide bullets:**

- |E|

**On-screen metrics:**

```
≥8
```

