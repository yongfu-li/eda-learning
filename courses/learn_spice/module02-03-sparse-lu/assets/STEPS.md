# Sparse LU lite — step-by-step (for slides / transcript)

**Module:** `module02-03-sparse-lu`  
**Lab / algo:** `sparse-lu`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sparse-lu&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — NNZ

![Step 1](steps/01-nnz.png)

**Caption (transcript):** Count nonzeros in G.

**Slide bullets:**

- nnz

**On-screen metrics:**

```
6
```

## Step 2 — Factor L

![Step 2](steps/02-l.png)

**Caption (transcript):** Lower triangular factor.

**Slide bullets:**

- L

**On-screen metrics:**

```
unit diag
```

## Step 3 — Factor U

![Step 3](steps/03-u.png)

**Caption (transcript):** Upper triangular factor.

**Slide bullets:**

- U

**On-screen metrics:**

```
pivots
```

## Step 4 — Fwd/back idea

![Step 4](steps/04-fb.png)

**Caption (transcript):** Solve Ly=b then Ux=y.

**Slide bullets:**

- solve

**On-screen metrics:**

```
2 sweeps
```

## Step 5 — NNZ 6

![Step 5](steps/05-n6.png)

**Caption (transcript):** GOLDEN nnz=6 on toy G.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
6
```

