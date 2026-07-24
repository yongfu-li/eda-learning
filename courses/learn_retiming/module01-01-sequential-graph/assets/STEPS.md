# Sequential circuit graph — step-by-step (for slides / transcript)

**Module:** `module01-01-sequential-graph`  
**Lab / algo:** `sequential-graph`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sequential-graph&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Topology

![Step 1](steps/01-topo.png)

**Caption (transcript):** Five nodes: PI u, comb a/b/c, PO v, plus shortcut a→c.

**Slide bullets:**

- DAG

**On-screen metrics:**

```
nodes=5
```

## Step 2 — PI/PO

![Step 2](steps/02-pi.png)

**Caption (transcript):** Blue circle u is the primary input; red v is the primary output.

**Slide bullets:**

- Ports

**On-screen metrics:**

```
u / v
```

## Step 3 — Comb boxes

![Step 3](steps/03-comb.png)

**Caption (transcript):** Green boxes a, b, c carry combinational delay.

**Slide bullets:**

- delay d

**On-screen metrics:**

```
a=3 b=2 c=4
```

## Step 4 — Five edges

![Step 4](steps/04-edges.png)

**Caption (transcript):** Edge labels show register weight w. Five edges total.

**Slide bullets:**

- w labels

**On-screen metrics:**

```
edges=5
```

## Step 5 — Stats

![Step 5](steps/05-stats.png)

**Caption (transcript):** GOLDENS: 5 nodes, 5 edges, 3 comb, 2 base registers.

**Slide bullets:**

- graphStats

**On-screen metrics:**

```
regs=2
```

