# Sequential unrolling

**Module id:** module03-03-sequential-unroll
**Lab:** sequential-unroll
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Seq unroll

Sequential equivalence often unrolls both designs for k cycles and runs combinational CEC on the unrolled POs.

## Slide 2 — The idea

sequential_unroll(spec, 2) expands FF next_q = a XOR q into time-stamped gates q_0,a_0,a_1,q_1,q_2.

<!-- algorithm-walkthrough -->

## Slide 3 — Flip-flop

![Flip-flop](assets/steps/01-ff.png)

Sequential toy: state q, next_q = a XOR q, output y=q.

## Slide 4 — Unroll k

![Unroll k](assets/steps/02-steps.png)

Unrolling k steps builds a combo circuit over time frames.

## Slide 5 — Frame PIs

![Frame PIs](assets/steps/03-pis.png)

Unroll adds a_0, a_1, … and q_0 as inputs.

## Slide 6 — Copied gates

![Copied gates](assets/steps/04-gates.png)

Each frame copies the combo cone.

## Slide 7 — Why unroll

![Why unroll](assets/steps/05-why.png)

Bounded SEC compares unrolled behaviors for k cycles.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sequential-unroll**. Show unrolled netlist view for n=2.

## Slide 9 — Implement track

Call sequential_unroll(DATA['sequential']['spec'], 2); inspect gates and PIs.

## Slide 10 — Pitfalls

Unrolling without resetting state. Confusing PO y with next state.

## Slide 11 — Your turn

Next: sequential CEC lite.
