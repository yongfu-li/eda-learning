# Zero-skew merge (DME lite) — step-by-step (for slides / transcript)

**Module:** `module02-05-zero-skew-merge`  
**Lab / algo:** `zero-skew-merge`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=zero-skew-merge&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — DME lite

![Step 1](steps/01-idea.png)

**Caption (transcript):** Split sinks left/right of source; meet at a point that balances subtree radii.

**Slide bullets:**

- Equalize delay
- Merge steiner

**On-screen metrics:**

```
golden skew=0
```

## Step 2 — Balanced meet

![Step 2](steps/02-demo.png)

**Caption (transcript):** Zero-skew demo places a merge steiner near CLK.

**Slide bullets:**

- Left vs right

**On-screen metrics:**

```
Skew near 0–3
```

## Step 3 — Symmetric paths

![Step 3](steps/03-path.png)

**Caption (transcript):** Opposite sinks should see similar source latency.

**Slide bullets:**

- Select A vs B

**On-screen metrics:**

```
Compare latencies
```

## Step 4 — Read skew

![Step 4](steps/04-skew.png)

**Caption (transcript):** Overlay reports near-zero skew on the toy spread.

**Slide bullets:**

- Primary metric

**On-screen metrics:**

```
≤ 2+1
```

## Step 5 — Toy only

![Step 5](steps/05-limit.png)

**Caption (transcript):** Full DME embeds delay recursively on every merge — this lab is the intuition.

**Slide bullets:**

- Not full DME
- Buffering next

**On-screen metrics:**

```
Skew bound lab
```

