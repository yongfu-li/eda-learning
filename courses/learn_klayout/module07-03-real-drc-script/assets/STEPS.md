# Real DRC script — step-by-step (for slides / transcript)

**Module:** `module07-03-real-drc-script`  
**Lab / algo:** `real-drc-script`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=real-drc-script&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — run drc

![Step 1](steps/01-cmd.png)

**Caption (transcript):** DRC script finds width violations.

**Slide bullets:**

- run_drc

**On-screen metrics:**

```
cmd
```

## Step 2 — m0 violation

![Step 2](steps/02-m0.png)

**Caption (transcript):** m0 width 20 < min_width 40.

**Slide bullets:**

- m0

**On-screen metrics:**

```
1
```

## Step 3 — poly ok

![Step 3](steps/03-poly.png)

**Caption (transcript):** p0 passes width check.

**Slide bullets:**

- p0

**On-screen metrics:**

```
ok
```

## Step 4 — Log line

![Step 4](steps/04-log.png)

**Caption (transcript):** WIDTH_VIOLATIONS=1 in log.

**Slide bullets:**

- log

**On-screen metrics:**

```
1
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

