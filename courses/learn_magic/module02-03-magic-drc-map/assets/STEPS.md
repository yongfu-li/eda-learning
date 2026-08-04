# Magic DRC map — step-by-step (for slides / transcript)

**Module:** `module02-03-magic-drc-map`  
**Lab / algo:** `magic-drc-map`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=magic-drc-map&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — drc check

![Step 1](steps/01-drc.png)

**Caption (transcript):** Magic drc check scans width rules.

**Slide bullets:**

- drc

**On-screen metrics:**

```
check
```

## Step 2 — min_width

![Step 2](steps/02-rule.png)

**Caption (transcript):** metal1 min_width=2 on this tech.

**Slide bullets:**

- metal1

**On-screen metrics:**

```
2
```

## Step 3 — Violation

![Step 3](steps/03-thin.png)

**Caption (transcript):** thin metal1 has width 1 < 2.

**Slide bullets:**

- thin

**On-screen metrics:**

```
1
```

## Step 4 — Error count

![Step 4](steps/04-error.png)

**Caption (transcript):** Exactly one width error.

**Slide bullets:**

- errors

**On-screen metrics:**

```
1
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: drc_error_count=1 on thin.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1/thin
```

