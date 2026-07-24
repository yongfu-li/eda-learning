# Polarity / inverter pairs — step-by-step (for slides / transcript)

**Module:** `module03-01-polarity-invert`  
**Lab / algo:** `polarity-invert`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=polarity-invert&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Invert flag

![Step 1](steps/01-flag.png)

**Caption (transcript):** INV_X1 has invert=true in the library.

**Slide bullets:**

- Library

**On-screen metrics:**

```
Purple
```

## Step 2 — One flip

![Step 2](steps/02-one.png)

**Caption (transcript):** A single INV yields negative polarity.

**Slide bullets:**

- flips=1

**On-screen metrics:**

```
positive=false
```

## Step 3 — Two flips

![Step 3](steps/03-two.png)

**Caption (transcript):** Two INVs restore positive sense.

**Slide bullets:**

- Parity

**On-screen metrics:**

```
positive=true
```

## Step 4 — Mix with BUF

![Step 4](steps/04-mix.png)

**Caption (transcript):** BUF cells do not flip.

**Slide bullets:**

- BUF_X1

**On-screen metrics:**

```
Parity unchanged
```

## Step 5 — Design rule

![Step 5](steps/05-rule.png)

**Caption (transcript):** Useful-skew flows may allow phase; this toy tracks parity.

**Slide bullets:**

- Toy scope

**On-screen metrics:**

```
Fanout next
```

