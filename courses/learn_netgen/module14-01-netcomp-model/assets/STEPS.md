# Obj / Netlist / Element model — step-by-step (for slides / transcript)

**Module:** `module14-01-netcomp-model`  
**Lab / algo:** `netcomp-model`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=netcomp-model&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Obj

![Step 1](steps/01-obj.png)

**Caption (transcript):** Obj holds Tcl strings, hashes, lists.

**Slide bullets:**

- Obj

**On-screen metrics:**

```
tcl
```

## Step 2 — Netlist

![Step 2](steps/02-netlist.png)

**Caption (transcript):** Netlist holds ports, devices, nets.

**Slide bullets:**

- Netlist

**On-screen metrics:**

```
graph
```

## Step 3 — Element

![Step 3](steps/03-element.png)

**Caption (transcript):** Element holds pins and device properties.

**Slide bullets:**

- Element

**On-screen metrics:**

```
dev
```

## Step 4 — Nesting

![Step 4](steps/04-nest.png)

**Caption (transcript):** Obj values feed Netlist; Element wraps devices.

**Slide bullets:**

- nest

**On-screen metrics:**

```
3
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: Obj, Netlist, Element — three pillars.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

