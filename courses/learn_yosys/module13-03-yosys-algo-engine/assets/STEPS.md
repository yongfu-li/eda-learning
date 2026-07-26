# Yosys algo engine — step-by-step (for slides / transcript)

**Module:** `module13-03-yosys-algo-engine`  
**Lab / algo:** `yosys-algo-engine`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=yosys-algo-engine&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — All checks

![Step 1](steps/01-all.png)

**Caption (transcript):** Engine runs every Part C pass.

**Slide bullets:**

- engine

**On-screen metrics:**

```
all
```

## Step 2 — proc goldens

![Step 2](steps/02-proc.png)

**Caption (transcript):** mux=1 dff=1.

**Slide bullets:**

- proc

**On-screen metrics:**

```
1/1
```

## Step 3 — opt goldens

![Step 3](steps/03-opt.png)

**Caption (transcript):** clean 2 merge ands=1.

**Slide bullets:**

- opt

**On-screen metrics:**

```
2/1
```

## Step 4 — map goldens

![Step 4](steps/04-map.png)

**Caption (transcript):** techmap 2 extract 1.

**Slide bullets:**

- map

**On-screen metrics:**

```
2/1
```

## Step 5 — OK

![Step 5](steps/05-ok.png)

**Caption (transcript):** GOLDEN: engine ok=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

