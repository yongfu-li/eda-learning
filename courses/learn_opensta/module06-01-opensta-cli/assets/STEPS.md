# OpenSTA CLI & scripts — step-by-step (for slides / transcript)

**Module:** `module06-01-opensta-cli`  
**Lab / algo:** `opensta-cli`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=opensta-cli&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — sta -exit

![Step 1](steps/01-invoke.png)

**Caption (transcript):** OpenSTA runs Tcl with sta -no_splash -exit script.tcl.

**Slide bullets:**

- sta

**On-screen metrics:**

```
CLI
```

## Step 2 — read_liberty

![Step 2](steps/02-lib.png)

**Caption (transcript):** First load the liberty timing models.

**Slide bullets:**

- read_liberty

**On-screen metrics:**

```
lib
```

## Step 3 — read_verilog

![Step 3](steps/03-v.png)

**Caption (transcript):** Then read the gate-level netlist.

**Slide bullets:**

- read_verilog

**On-screen metrics:**

```
rtl
```

## Step 4 — link_design

![Step 4](steps/04-link.png)

**Caption (transcript):** link_design binds cell instances to liberty.

**Slide bullets:**

- link_design

**On-screen metrics:**

```
link
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: recipe prefix liberty→verilog→link.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

