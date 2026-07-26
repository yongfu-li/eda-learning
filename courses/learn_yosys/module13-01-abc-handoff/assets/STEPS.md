# ABC handoff — step-by-step (for slides / transcript)

**Module:** `module13-01-abc-handoff`  
**Lab / algo:** `abc-handoff`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=abc-handoff&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — After opt

![Step 1](steps/01-opt.png)

**Caption (transcript):** Merged netlist ready for ABC.

**Slide bullets:**

- opt

**On-screen metrics:**

```
ready
```

## Step 2 — AND budget

![Step 2](steps/02-count.png)

**Caption (transcript):** Count AND-ish nodes.

**Slide bullets:**

- AIG

**On-screen metrics:**

```
3
```

## Step 3 — Mux cost

![Step 3](steps/03-mux.png)

**Caption (transcript):** Each $mux counts as two ANDs.

**Slide bullets:**

- $mux

**On-screen metrics:**

```
2
```

## Step 4 — abc pass

![Step 4](steps/04-bridge.png)

**Caption (transcript):** Yosys abc bridges to ABC/ABC9.

**Slide bullets:**

- abc

**On-screen metrics:**

```
bridge
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: aig_ands=3.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

