# Read opt_clean — step-by-step (for slides / transcript)

**Module:** `module15-01-read-opt-clean`  
**Lab / algo:** `read-opt-clean`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=read-opt-clean&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — File home

![Step 1](steps/01-home.png)

**Caption (transcript):** Real file: passes/opt/opt_clean.cc — OptCleanPass.

**Slide bullets:**

- opt_clean.cc

**On-screen metrics:**

```
path
```

## Step 2 — Mark used

![Step 2](steps/02-mark.png)

**Caption (transcript):** Walk drivers and keep signals that fan out.

**Slide bullets:**

- mark_used

**On-screen metrics:**

```
live
```

## Step 3 — Remove cells

![Step 3](steps/03-rm-cells.png)

**Caption (transcript):** rmunused_module_cells drops unused cells.

**Slide bullets:**

- rm_cells

**On-screen metrics:**

```
drop
```

## Step 4 — Remove wires

![Step 4](steps/04-rm-wires.png)

**Caption (transcript):** rmunused_module_signals cleans leftover nets.

**Slide bullets:**

- rm_wires

**On-screen metrics:**

```
nets
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: mark → rm cells → rm wires; processes empty.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

