# Read DRC / cifwrite — step-by-step (for slides / transcript)

**Module:** `module14-03-read-drc-cifwrite`  
**Lab / algo:** `read-drc-cifwrite`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=read-drc-cifwrite&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — load_rules

![Step 1](steps/01-rules.png)

**Caption (transcript):** Load tech min_width for metal1 from Plane.

**Slide bullets:**

- load_rules

**On-screen metrics:**

```
tech
```

## Step 2 — scan_region

![Step 2](steps/02-scan.png)

**Caption (transcript):** Walk tiles on the active plane.

**Slide bullets:**

- scan_region

**On-screen metrics:**

```
walk
```

## Step 3 — emit_marker

![Step 3](steps/03-emit.png)

**Caption (transcript):** Flag thin rect (width=1 < limit=2).

**Slide bullets:**

- emit_marker

**On-screen metrics:**

```
thin
```

## Step 4 — cifwrite

![Step 4](steps/04-cif.png)

**Caption (transcript):** flatten → write_cif → verify_layers (6 GDS layers).

**Slide bullets:**

- cifwrite

**On-screen metrics:**

```
6
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: DRC→Part B drc=1; GDS layers=6.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

