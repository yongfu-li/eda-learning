# SAT / CNF encoding lite — step-by-step (for slides / transcript)

**Module:** `module02-05-sat-cnf-lite`  
**Lab / algo:** `sat-cnf-lite`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sat-cnf-lite&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Tseitin encode

![Step 1](steps/01-tseitin.png)

**Caption (transcript):** Each gate becomes a few CNF clauses (Tseitin).

**Slide bullets:**

- encode

**On-screen metrics:**

```
vars+clauses
```

## Step 2 — Spec CNF

![Step 2](steps/02-spec.png)

**Caption (transcript):** encode_sat_cnf_lite(spec) yields positive clause count.

**Slide bullets:**

- clauses

**On-screen metrics:**

```
n=6
```

## Step 3 — Assert miter=1

![Step 3](steps/03-assert.png)

**Caption (transcript):** Ask SAT: can bad miter output be 1?

**Slide bullets:**

- SAT query

**On-screen metrics:**

```
diff?
```

## Step 4 — SAT finds diff

![Step 4](steps/04-sat.png)

**Caption (transcript):** Tiny DPLL finds the bad miter satisfiable → not equivalent.

**Slide bullets:**

- SAT

**On-screen metrics:**

```
cex exists
```

## Step 5 — UNSAT means equiv

![Step 5](steps/05-unsat.png)

**Caption (transcript):** If miter=1 is UNSAT, circuits are equivalent.

**Slide bullets:**

- proof

**On-screen metrics:**

```
gold standard
```

