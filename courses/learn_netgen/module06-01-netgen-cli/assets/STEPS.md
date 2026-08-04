# Netgen CLI & scripts — step-by-step (for slides / transcript)

**Module:** `module06-01-netgen-cli`  
**Lab / algo:** `netgen-cli`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=netgen-cli&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — netgen -batch

![Step 1](steps/01-invoke.png)

**Caption (transcript):** Netgen runs Tcl with netgen -batch -noc script.tcl.

**Slide bullets:**

- netgen

**On-screen metrics:**

```
CLI
```

## Step 2 — read sch

![Step 2](steps/02-sch.png)

**Caption (transcript):** First read schematic SPICE.

**Slide bullets:**

- read_sch

**On-screen metrics:**

```
sch
```

## Step 3 — read lay

![Step 3](steps/03-lay.png)

**Caption (transcript):** Then read layout/extract SPICE.

**Slide bullets:**

- read_lay

**On-screen metrics:**

```
lay
```

## Step 4 — compare

![Step 4](steps/04-compare.png)

**Caption (transcript):** Compare nets and devices.

**Slide bullets:**

- compare

**On-screen metrics:**

```
LVS
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: recipe prefix read_sch→read_lay.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

