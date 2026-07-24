# Clock buffering on wires

**Module id:** module03-01-clock-buffering
**Lab:** clock-buffering
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Clock buffering on wires

Long wires lose slew; CTS inserts buffers along the tree.

## Slide 2 — The idea

If an edge longer than maxWireLen, split it into equal pieces and place a buffer at each joint. Buffered latency adds bufferDelay per buffer on the path.

<!-- algorithm-walkthrough -->

## Slide 3 — Long wires

![Long wires](assets/steps/01-idea.png)

Split edges longer than maxWireLen; place buffer squares at joints.

## Slide 4 — Before buffers

![Before buffers](assets/steps/02-before.png)

H-tree may have long Manhattan legs.

## Slide 5 — After insert

![After insert](assets/steps/03-after.png)

Insert buffers — joints appear on long segments.

## Slide 6 — Buffered latency

![Buffered latency](assets/steps/04-latency.png)

bufferedLatencies adds bufferDelay per buffer on the path.

## Slide 7 — Trade-off

![Trade-off](assets/steps/05-trade.png)

Buffers restore slew but add delay — skew may rise or fall.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **clock-buffering**. Build H-tree, click Insert buffers, count orange squares. Read buffered latencies for A.

## Slide 9 — Implement track

Call `insert_buffers(edge, max_span, buffer_delay)`. Assert max segment length ≤ max_span.

## Slide 10 — Pitfalls

Buffering without splitting edges. Counting buffer delay twice. Using max span zero.

## Slide 11 — Your turn

Next: meet a skew bound with buffers and topology choice.
