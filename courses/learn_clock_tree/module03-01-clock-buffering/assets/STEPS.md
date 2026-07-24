# Clock buffering on wires — step-by-step (for slides / transcript)

**Module:** `module03-01-clock-buffering`  
**Lab / algo:** `clock-buffering`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=clock-buffering&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Long wires

![Step 1](steps/01-idea.png)

**Caption (transcript):** Split edges longer than maxWireLen; place buffer squares at joints.

**Slide bullets:**

- maxWire=4
- Orange squares

**On-screen metrics:**

```
delay=1
```

## Step 2 — Before buffers

![Step 2](steps/02-before.png)

**Caption (transcript):** H-tree may have long Manhattan legs.

**Slide bullets:**

- No buffers yet

**On-screen metrics:**

```
Build H-tree
```

## Step 3 — After insert

![Step 3](steps/03-after.png)

**Caption (transcript):** Insert buffers — joints appear on long segments.

**Slide bullets:**

- buffers[]

**On-screen metrics:**

```
Mode …+buf
```

## Step 4 — Buffered latency

![Step 4](steps/04-latency.png)

**Caption (transcript):** bufferedLatencies adds bufferDelay per buffer on the path.

**Slide bullets:**

- Wire + buf

**On-screen metrics:**

```
Not just length
```

## Step 5 — Trade-off

![Step 5](steps/05-trade.png)

**Caption (transcript):** Buffers restore slew but add delay — skew may rise or fall.

**Slide bullets:**

- Skew bound lab
- learn_buffering next

**On-screen metrics:**

```
Toy model
```

