# Bipartite check (DP feasibility) — step-by-step (for slides / transcript)

**Module:** `module01-05-bipartite-check`  
**Lab / algo:** `bipartite-check`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=bipartite-check&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Subgraph

![Step 1](steps/01-sub.png)

**Caption (transcript):** Restrict to D–E–F.

**Slide bullets:**

- subset

**On-screen metrics:**

```
DEF
```

## Step 2 — BFS color

![Step 2](steps/02-bfs.png)

**Caption (transcript):** 2-color BFS on the path.

**Slide bullets:**

- BFS

**On-screen metrics:**

```
bipartite
```

## Step 3 — Path DEF

![Step 3](steps/03-def.png)

**Caption (transcript):** Path has no odd cycle.

**Slide bullets:**

- path

**On-screen metrics:**

```
ok
```

## Step 4 — Colors 0/1

![Step 4](steps/04-cols.png)

**Caption (transcript):** Alternate colors along the path.

**Slide bullets:**

- 0/1

**On-screen metrics:**

```
alt
```

## Step 5 — OK

![Step 5](steps/05-ok.png)

**Caption (transcript):** GOLDEN: path_lele ok=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

