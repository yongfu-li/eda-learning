# Miter construction — step-by-step (for slides / transcript)

**Module:** `module01-03-miter-build`  
**Lab / algo:** `miter-build`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=miter-build&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — XOR outputs

![Step 1](steps/01-idea.png)

**Caption (transcript):** A miter XORs the two POs under shared PIs.

**Slide bullets:**

- miter_out

**On-screen metrics:**

```
diff detect
```

## Step 2 — Build good miter

![Step 2](steps/02-build.png)

**Caption (transcript):** Prefix impl gates, XOR spec g2 with i_g5.

**Slide bullets:**

- build_miter

**On-screen metrics:**

```
shared PIs
```

## Step 3 — Good → all zero

![Step 3](steps/03-zero.png)

**Caption (transcript):** For the good pair, miter output is 0 on every input.

**Slide bullets:**

- equiv

**On-screen metrics:**

```
8 zeros
```

## Step 4 — Bad → one

![Step 4](steps/04-one.png)

**Caption (transcript):** At the cex, bad miter outputs 1.

**Slide bullets:**

- diff

**On-screen metrics:**

```
a1b1c0
```

## Step 5 — Why miters

![Step 5](steps/05-use.png)

**Caption (transcript):** SAT/BDD CEC asks whether miter_out can be 1.

**Slide bullets:**

- UNSAT ⇒ equiv

**On-screen metrics:**

```
Next TT
```

