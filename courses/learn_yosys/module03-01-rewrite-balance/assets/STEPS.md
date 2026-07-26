# Rewrite balance — step-by-step (for slides / transcript)

**Module:** `module03-01-rewrite-balance`  
**Lab / algo:** `rewrite-balance`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=rewrite-balance&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — OR+NOT pair

![Step 1](steps/01-pair.png)

**Caption (transcript):** c2 OR feeds c5 NOT on out.

**Slide bullets:**

- rewrite

**On-screen metrics:**

```
OR,NOT
```

## Step 2 — Absorb to NOR

![Step 2](steps/02-absorb.png)

**Caption (transcript):** Replace OR+NOT with single NOR.

**Slide bullets:**

- NOR

**On-screen metrics:**

```
rw_c2
```

## Step 3 — Comb count

![Step 3](steps/03-comb.png)

**Caption (transcript):** Two combinational cells after rewrite.

**Slide bullets:**

- comb

**On-screen metrics:**

```
2
```

## Step 4 — Seq hold

![Step 4](steps/04-seq.png)

**Caption (transcript):** DFF c6 unchanged — seq=1.

**Slide bullets:**

- DFF

**On-screen metrics:**

```
1
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: after_rewrite_cells=3.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

