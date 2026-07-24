# Latency and skew — step-by-step (for slides / transcript)

**Module:** `module01-03-latency-skew`  
**Lab / algo:** `latency-skew`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=latency-skew&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Skew = max − min

![Step 1](steps/01-def.png)

**Caption (transcript):** Per-sink latency is Manhattan length along the tree; skew is max minus min.

**Slide bullets:**

- Wire delay = 1
- Primary CTS metric

**On-screen metrics:**

```
Document goldens
```

## Step 2 — H-tree skew

![Step 2](steps/02-h.png)

**Caption (transcript):** Build H-tree on spread and read skew overlay.

**Slide bullets:**

- Recursive splits

**On-screen metrics:**

```
skew≈2
```

## Step 3 — MMM skew

![Step 3](steps/03-mmm.png)

**Caption (transcript):** MMM merge may differ from H-tree on the same sinks.

**Slide bullets:**

- Closest fragments

**On-screen metrics:**

```
skew≈3
```

## Step 4 — Path to A

![Step 4](steps/04-path.png)

**Caption (transcript):** Highlight sink A — yellow edges show source→A path.

**Slide bullets:**

- Selected sink

**On-screen metrics:**

```
lat A≈8
```

## Step 5 — Drive skew down

![Step 5](steps/05-goal.png)

**Caption (transcript):** Move sinks or switch topology to clear challenge bounds.

**Slide bullets:**

- Learner state
- Check scores skew

**On-screen metrics:**

```
Next: H-tree
```

