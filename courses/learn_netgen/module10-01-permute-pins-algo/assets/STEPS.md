# Permute pins algorithm — step-by-step (for slides / transcript)

**Module:** `module10-01-permute-pins-algo`  
**Lab / algo:** `permute-pins-algo`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=permute-pins-algo&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — D/S permute

![Step 1](steps/01-ds.png)

**Caption (transcript):** Drain and source may swap.

**Slide bullets:**

- D
- S

**On-screen metrics:**

```
permute
```

## Step 2 — G fixed

![Step 2](steps/02-gate.png)

**Caption (transcript):** Gate does not permute.

**Slide bullets:**

- G

**On-screen metrics:**

```
fixed
```

## Step 3 — nmos rule

![Step 3](steps/03-nmos.png)

**Caption (transcript):** nmos permute includes D,S.

**Slide bullets:**

- nmos

**On-screen metrics:**

```
rule
```

## Step 4 — pmos rule

![Step 4](steps/04-pmos.png)

**Caption (transcript):** pmos permute includes D,S.

**Slide bullets:**

- pmos

**On-screen metrics:**

```
rule
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: permute_ok=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

