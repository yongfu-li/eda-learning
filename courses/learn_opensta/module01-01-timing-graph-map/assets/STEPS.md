# Timing graph map — step-by-step (for slides / transcript)

**Module:** `module01-01-timing-graph-map`  
**Lab / algo:** `timing-graph-map`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=timing-graph-map&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Three cells

![Step 1](steps/01-cells.png)

**Caption (transcript):** Tiny netlist has AND2, BUF, and INV.

**Slide bullets:**

- u1
- u2
- u3

**On-screen metrics:**

```
3
```

## Step 2 — Pins

![Step 2](steps/02-pins.png)

**Caption (transcript):** Primary pins a, b, y plus internal nets.

**Slide bullets:**

- a
- b
- y

**On-screen metrics:**

```
pins
```

## Step 3 — Delay arcs

![Step 3](steps/03-arcs.png)

**Caption (transcript):** Each cell carries a delay that becomes a timing arc.

**Slide bullets:**

- delay

**On-screen metrics:**

```
arcs
```

## Step 4 — Timing graph

![Step 4](steps/04-graph.png)

**Caption (transcript):** OpenSTA builds a graph from cells and pins.

**Slide bullets:**

- graph

**On-screen metrics:**

```
map
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: cell_count=3.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

