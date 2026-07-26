# Yosys engine integration — step-by-step (for slides / transcript)

**Module:** `module05-01-yosys-engine`  
**Lab / algo:** `yosys-engine`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=yosys-engine&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Pipeline snapshot

![Step 1](steps/01-snap.png)

**Caption (transcript):** Engine runs all passes and compares goldens.

**Slide bullets:**

- engine

**On-screen metrics:**

```
all
```

## Step 2 — Opt golden

![Step 2](steps/02-opt.png)

**Caption (transcript):** after_opt_cells=5.

**Slide bullets:**

- opt

**On-screen metrics:**

```
5
```

## Step 3 — Strash golden

![Step 3](steps/03-strash.png)

**Caption (transcript):** after_strash_cells=4.

**Slide bullets:**

- strash

**On-screen metrics:**

```
4
```

## Step 4 — Report stats

![Step 4](steps/04-report.png)

**Caption (transcript):** report cells=7 wires=11 after synth.

**Slide bullets:**

- report

**On-screen metrics:**

```
7/11
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: engine_ok=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

