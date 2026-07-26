# Synth script — step-by-step (for slides / transcript)

**Module:** `module04-03-synth-script`  
**Lab / algo:** `synth-script`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=synth-script&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Pass recipe chain

![Step 1](steps/01-chain.png)

**Caption (transcript):** proc → flatten → opt → strash → rewrite → techmap.

**Slide bullets:**

- synth

**On-screen metrics:**

```
6 passes
```

## Step 2 — proc step

![Step 2](steps/02-proc.png)

**Caption (transcript):** Start from RTL gate netlist.

**Slide bullets:**

- proc

**On-screen metrics:**

```
6
```

## Step 3 — Mid passes

![Step 3](steps/03-mid.png)

**Caption (transcript):** opt/strash/rewrite shrink to mapped base.

**Slide bullets:**

- opt

**On-screen metrics:**

```
3
```

## Step 4 — techmap area

![Step 4](steps/04-map.png)

**Caption (transcript):** Final techmap emits NAND library.

**Slide bullets:**

- techmap

**On-screen metrics:**

```
6 nand
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: synth recipe completes.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

