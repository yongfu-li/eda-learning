# DRC region algorithm — step-by-step (for slides / transcript)

**Module:** `module09-03-drc-region-algo`  
**Lab / algo:** `drc-region-algo`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=drc-region-algo&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Region scan

![Step 1](steps/01-scan.png)

**Caption (transcript):** Walk each painted rect; check min_width.

**Slide bullets:**

- scan

**On-screen metrics:**

```
region
```

## Step 2 — thin violation

![Step 2](steps/02-thin.png)

**Caption (transcript):** thin has width=1 < metal1 limit 2.

**Slide bullets:**

- thin

**On-screen metrics:**

```
1
```

## Step 3 — Other shapes

![Step 3](steps/03-ok.png)

**Caption (transcript):** Other rects meet width rules.

**Slide bullets:**

- m1y

**On-screen metrics:**

```
ok
```

## Step 4 — One error

![Step 4](steps/04-count.png)

**Caption (transcript):** Teaching golden drc_error_count=1.

**Slide bullets:**

- DRC

**On-screen metrics:**

```
1
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: error on thin metal1.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1
```

