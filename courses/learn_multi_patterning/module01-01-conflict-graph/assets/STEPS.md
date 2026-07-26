# Conflict graph construction — step-by-step (for slides / transcript)

**Module:** `module01-01-conflict-graph`  
**Lab / algo:** `conflict-graph`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=conflict-graph&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Features

![Step 1](steps/01-feat.png)

**Caption (transcript):** Six features A–F on the toy.

**Slide bullets:**

- A–F

**On-screen metrics:**

```
n=6
```

## Step 2 — Min space

![Step 2](steps/02-min.png)

**Caption (transcript):** min_same_mask=2.

**Slide bullets:**

- rule

**On-screen metrics:**

```
2
```

## Step 3 — Edges

![Step 3](steps/03-edges.png)

**Caption (transcript):** Conflict if gap < 2 → 5 edges.

**Slide bullets:**

- graph

**On-screen metrics:**

```
E=5
```

## Step 4 — Triangle

![Step 4](steps/04-tri.png)

**Caption (transcript):** A–B–C form a triangle.

**Slide bullets:**

- odd

**On-screen metrics:**

```
ABC
```

## Step 5 — Path

![Step 5](steps/05-path.png)

**Caption (transcript):** D–E–F is a path.

**Slide bullets:**

- bipartite piece

**On-screen metrics:**

```
DEF
```

