# Tapping / branch points — step-by-step (for slides / transcript)

**Module:** `module02-07-tapping-points`  
**Lab / algo:** `tapping-points`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=tapping-points&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Branch taps

![Step 1](steps/01-def.png)

**Caption (transcript):** Tapping points are steiners with degree ≥ 3 — where the clock forks.

**Slide bullets:**

- Not leaf sinks
- Internal nodes

**On-screen metrics:**

```
tappingPoints()
```

## Step 2 — On MMM

![Step 2](steps/02-mmm.png)

**Caption (transcript):** MMM merge points are natural taps.

**Slide bullets:**

- Count taps

**On-screen metrics:**

```
taps≥1
```

## Step 3 — On H-tree

![Step 3](steps/03-h.png)

**Caption (transcript):** H splits also create high-degree junctions.

**Slide bullets:**

- Steiners

**On-screen metrics:**

```
Compare counts
```

## Step 4 — Why care

![Step 4](steps/04-why.png)

**Caption (transcript):** Buffers and gating often sit at taps; routing capacity concentrates there.

**Slide bullets:**

- Buffer sites
- Congestion

**On-screen metrics:**

```
Clock buffering
```

## Step 5 — API

![Step 5](steps/05-api.png)

**Caption (transcript):** Call tappingPoints(tree) after Build — challenges score tap count.

**Slide bullets:**

- Learner tree
- Check

**On-screen metrics:**

```
Next: buffers
```

