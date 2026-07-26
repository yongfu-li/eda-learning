# Netlist nodes and ground — step-by-step (for slides / transcript)

**Module:** `module01-01-netlist-nodes`  
**Lab / algo:** `netlist-nodes`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=netlist-nodes&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Netlist

![Step 1](steps/01-nl.png)

**Caption (transcript):** Toy netlist with five elements.

**Slide bullets:**

- JSON

**On-screen metrics:**

```
n=5
```

## Step 2 — Ground

![Step 2](steps/02-gnd.png)

**Caption (transcript):** Node 0 is ground reference.

**Slide bullets:**

- gnd

**On-screen metrics:**

```
0
```

## Step 3 — Unknowns

![Step 3](steps/03-un.png)

**Caption (transcript):** Unknown voltages: nodes 1 and 2.

**Slide bullets:**

- MNA

**On-screen metrics:**

```
2
```

## Step 4 — Elements

![Step 4](steps/04-el.png)

**Caption (transcript):** V, R, R, C, D types.

**Slide bullets:**

- types

**On-screen metrics:**

```
V/R/C/D
```

## Step 5 — Count

![Step 5](steps/05-cnt.png)

**Caption (transcript):** GOLDEN element_count=5.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
5
```

