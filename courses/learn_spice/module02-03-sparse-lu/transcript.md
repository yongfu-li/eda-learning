# Sparse LU lite

**Module id:** module02-03-sparse-lu
**Lab:** sparse-lu
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why sparse

Production SPICE uses sparse LU — count nonzeros and inspect L/U structure.

## Slide 2 — The idea

GOLDEN: nnz=6 on the toy MNA conductance matrix.

<!-- algorithm-walkthrough -->

## Slide 3 — NNZ

![NNZ](assets/steps/01-nnz.png)

Count nonzeros in G.

## Slide 4 — Factor L

![Factor L](assets/steps/02-l.png)

Lower triangular factor.

## Slide 5 — Factor U

![Factor U](assets/steps/03-u.png)

Upper triangular factor.

## Slide 6 — Fwd/back idea

![Fwd/back idea](assets/steps/04-fb.png)

Solve Ly=b then Ux=y.

## Slide 7 — NNZ 6

![NNZ 6](assets/steps/05-n6.png)

GOLDEN nnz=6 on toy G.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sparse-lu**. Factor G; confirm nnz=6.

## Slide 9 — Implement track

Call sparse_lu_lite(G from dc_linear_solve); assert nnz==6.

## Slide 10 — Pitfalls

Confusing nnz with matrix dimension. Expecting fill-in on this tiny dense G.

## Slide 11 — Your turn

Next: Newton-Raphson on the same stamps.
