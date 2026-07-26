# AIG strash — step-by-step (for slides / transcript)

**Module:** `module02-03-aig-strash`  
**Lab / algo:** `aig-strash`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=aig-strash&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Hash key table

![Step 1](steps/01-hash.png)

**Caption (transcript):** Identical AND(a,b) keys merge.

**Slide bullets:**

- strash

**On-screen metrics:**

```
AND
```

## Step 2 — c1 and c3

![Step 2](steps/02-c1c3.png)

**Caption (transcript):** Both AND(a,b) — c3 is duplicate.

**Slide bullets:**

- dup

**On-screen metrics:**

```
c1,c3
```

## Step 3 — Merge n3→n1

![Step 3](steps/03-merge.png)

**Caption (transcript):** Retarget fans; drop c3.

**Slide bullets:**

- merge

**On-screen metrics:**

```
n3
```

## Step 4 — Four cells

![Step 4](steps/04-four.png)

**Caption (transcript):** One AND remains after strash.

**Slide bullets:**

- cells

**On-screen metrics:**

```
4
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: after_strash_cells=4.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
4
```

