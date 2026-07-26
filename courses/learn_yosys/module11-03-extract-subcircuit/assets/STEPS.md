# extract subcircuit — step-by-step (for slides / transcript)

**Module:** `module11-03-extract-subcircuit`  
**Lab / algo:** `extract-subcircuit`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=extract-subcircuit&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Pattern

![Step 1](steps/01-pat.png)

**Caption (transcript):** AND feeding OR is ANDOR2.

**Slide bullets:**

- pattern

**On-screen metrics:**

```
ANDOR
```

## Step 2 — Match

![Step 2](steps/02-match.png)

**Caption (transcript):** Find isomorphic subgraph.

**Slide bullets:**

- match

**On-screen metrics:**

```
1
```

## Step 3 — Macro cell

![Step 3](steps/03-macro.png)

**Caption (transcript):** Replace with ANDOR2.

**Slide bullets:**

- ANDOR2

**On-screen metrics:**

```
1
```

## Step 4 — Drop pair

![Step 4](steps/04-drop.png)

**Caption (transcript):** Remove matched $and/$or.

**Slide bullets:**

- drop

**On-screen metrics:**

```
2
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: matches=1.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1
```

