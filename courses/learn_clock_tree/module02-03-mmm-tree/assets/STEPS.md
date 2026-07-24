# Method of Means and Medians — step-by-step (for slides / transcript)

**Module:** `module02-03-mmm-tree`  
**Lab / algo:** `mmm-tree`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=mmm-tree&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Means & medians

![Step 1](steps/01-idea.png)

**Caption (transcript):** Repeatedly merge the closest fragment roots at their midpoint.

**Slide bullets:**

- Greedy merge
- Steiner at merge

**On-screen metrics:**

```
Build MMM
```

## Step 2 — Merged tree

![Step 2](steps/02-build.png)

**Caption (transcript):** MMM connects all sinks then trunks to the source.

**Slide bullets:**

- Fragment merge

**On-screen metrics:**

```
skew≈3
```

## Step 3 — Merge points

![Step 3](steps/03-steiners.png)

**Caption (transcript):** Steiners mark where two subtrees join.

**Slide bullets:**

- Branch points

**On-screen metrics:**

```
Tapping lab
```

## Step 4 — vs H-tree

![Step 4](steps/04-vs-h.png)

**Caption (transcript):** MMM adapts to irregular sink sets better than pure H geometry.

**Slide bullets:**

- Data-driven
- Skew may differ

**On-screen metrics:**

```
Compare overlays
```

## Step 5 — Toward DME

![Step 5](steps/05-next.png)

**Caption (transcript):** Zero-skew merge balances subtree delays explicitly.

**Slide bullets:**

- DME lite next

**On-screen metrics:**

```
Skew focus
```

