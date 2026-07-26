# aigmap & synth — step-by-step (for slides / transcript)

**Module:** `module08-01-aigmap-synth`  
**Lab / algo:** `aigmap-synth`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=aigmap-synth&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Before aigmap

![Step 1](steps/01-opt.png)

**Caption (transcript):** opt netlist with $and/$or/$not/$dff.

**Slide bullets:**

- opt

**On-screen metrics:**

```
4
```

## Step 2 — aigmap

![Step 2](steps/02-aig.png)

**Caption (transcript):** Maps to $_AND_/$_NOT_ — cells=7.

**Slide bullets:**

- aigmap

**On-screen metrics:**

```
7
```

## Step 3 — synth recipe

![Step 3](steps/03-synth.png)

**Caption (transcript):** synth -top top runs the built-in flow.

**Slide bullets:**

- synth

**On-screen metrics:**

```
recipe
```

## Step 4 — AOI3 + DFF

![Step 4](steps/04-out.png)

**Caption (transcript):** Result: $_AOI3_ and $_DFF_P_.

**Slide bullets:**

- $_AOI3_
- $_DFF_P_

**On-screen metrics:**

```
2
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: synth cells=2.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

