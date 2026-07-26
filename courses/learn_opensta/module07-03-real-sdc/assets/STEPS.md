# Real SDC + create_clock — step-by-step (for slides / transcript)

**Module:** `module07-03-real-sdc`  
**Lab / algo:** `real-sdc`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=real-sdc&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — create_clock

![Step 1](steps/01-clk.png)

**Caption (transcript):** create_clock -name clk -period 10.

**Slide bullets:**

- clk

**On-screen metrics:**

```
10
```

## Step 2 — Input delay

![Step 2](steps/02-in.png)

**Caption (transcript):** set_input_delay 0 on all inputs.

**Slide bullets:**

- in

**On-screen metrics:**

```
0
```

## Step 3 — Output delay

![Step 3](steps/03-out.png)

**Caption (transcript):** set_output_delay 0 on all outputs.

**Slide bullets:**

- out

**On-screen metrics:**

```
0
```

## Step 4 — Ideal network

![Step 4](steps/04-ideal.png)

**Caption (transcript):** Clock network delay is ideal in this lab.

**Slide bullets:**

- ideal

**On-screen metrics:**

```
0
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: clock clk period=10.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
10
```

