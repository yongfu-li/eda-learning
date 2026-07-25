# Longest-path compaction — step-by-step (for slides / transcript)

**Module:** `module02-03-longest-path`  
**Lab / algo:** `longest-path`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=longest-path&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Source

![Step 1](steps/01-src.png)

**Caption (transcript):** SRC_X at position 0.

**Slide bullets:**

- origin

**On-screen metrics:**

```
0
```

## Step 2 — Relax

![Step 2](steps/02-relax.png)

**Caption (transcript):** Update dst ← max(dst, src + w).

**Slide bullets:**

- Bellman-ish

**On-screen metrics:**

```
relax
```

## Step 3 — Stable

![Step 3](steps/03-stable.png)

**Caption (transcript):** Stop when no position increases.

**Slide bullets:**

- fixpoint

**On-screen metrics:**

```
done
```

## Step 4 — Left pack

![Step 4](steps/04-pack.png)

**Caption (transcript):** Cells pack left under spacing.

**Slide bullets:**

- compact

**On-screen metrics:**

```
toward SRC
```

## Step 5 — Ready

![Step 5](steps/05-ready.png)

**Caption (transcript):** Positions feed compact_1d next.

**Slide bullets:**

- apply

**On-screen metrics:**

```
1-D
```

