# Layered boolean (AND/OR) — step-by-step (for slides / transcript)

**Module:** `module03-05-layered-boolean`  
**Lab / algo:** `layered-boolean`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=layered-boolean&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Cover M1

![Step 1](steps/01-m1.png)

**Caption (transcript):** V is covered (contained) by M1 A.

**Slide bullets:**

- cover

**On-screen metrics:**

```
M1
```

## Step 2 — Cover M2

![Step 2](steps/02-m2.png)

**Caption (transcript):** V is not covered by M2 C.

**Slide bullets:**

- ¬M2

**On-screen metrics:**

```
false
```

## Step 3 — And-not

![Step 3](steps/03-andnot.png)

**Caption (transcript):** and_not = M1 ∧ ¬M2 matches V.

**Slide bullets:**

- and_not

**On-screen metrics:**

```
hit
```

## Step 4 — And

![Step 4](steps/04-and.png)

**Caption (transcript):** and = M1 ∧ M2 matches none on the toy.

**Slide bullets:**

- and

**On-screen metrics:**

```
∅
```

## Step 5 — Hit

![Step 5](steps/05-hit.png)

**Caption (transcript):** GOLDEN: one and_not hit on V.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
n=1
```

