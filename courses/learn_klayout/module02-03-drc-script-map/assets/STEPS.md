# DRC script map — step-by-step (for slides / transcript)

**Module:** `module02-03-drc-script-map`  
**Lab / algo:** `drc-script-map`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=drc-script-map&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Width rule

![Step 1](steps/01-rule.png)

**Caption (transcript):** metal1 min_width=40 dbu units.

**Slide bullets:**

- min_width

**On-screen metrics:**

```
40
```

## Step 2 — m0 violation

![Step 2](steps/02-m0.png)

**Caption (transcript):** m0 width is 20 — below limit.

**Slide bullets:**

- m0

**On-screen metrics:**

```
20
```

## Step 3 — DRC script

![Step 3](steps/03-drc.png)

**Caption (transcript):** Ruby DRC finds one width violation.

**Slide bullets:**

- drc

**On-screen metrics:**

```
1
```

## Step 4 — poly ok

![Step 4](steps/04-poly.png)

**Caption (transcript):** p0 width 50 passes poly rule.

**Slide bullets:**

- p0

**On-screen metrics:**

```
ok
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: width_violations=1 on m0.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1/m0
```

