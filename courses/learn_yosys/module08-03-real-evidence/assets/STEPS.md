# Real Yosys evidence engine — step-by-step (for slides / transcript)

**Module:** `module08-03-real-evidence`  
**Lab / algo:** `real-evidence`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=real-evidence&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Full recipe

![Step 1](steps/01-recipe.png)

**Caption (transcript):** read→hierarchy→proc→flatten→opt→synth→stat→write.

**Slide bullets:**

- recipe

**On-screen metrics:**

```
8
```

## Step 2 — RTLIL checks

![Step 2](steps/02-rtlil.png)

**Caption (transcript):** modules/processes/$and goldens hold.

**Slide bullets:**

- RTLIL

**On-screen metrics:**

```
ok
```

## Step 3 — proc+flatten

![Step 3](steps/03-mid.png)

**Caption (transcript):** dff created; flatten cells=4.

**Slide bullets:**

- proc
- flatten

**On-screen metrics:**

```
4
```

## Step 4 — synth out

![Step 4](steps/04-synth.png)

**Caption (transcript):** $_AOI3_ + $_DFF_P_.

**Slide bullets:**

- synth

**On-screen metrics:**

```
2
```

## Step 5 — OK

![Step 5](steps/05-ok.png)

**Caption (transcript):** GOLDEN: engine_ok=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

