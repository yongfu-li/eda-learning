# Pin / name binding

**Module id:** module02-03-pin-binding
**Lab:** pin-binding
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Pin binding

Binding table maps layout X0→mn1 and layout nets to schematic ports.

## Slide 2 — The idea

GOLDEN: X0→mn1, X1→mp1; 4 net binds.

<!-- algorithm-walkthrough -->

## Slide 3 — Dev bind

![Dev bind](assets/steps/01-dev.png)

Device binding: X0→mn1, X1→mp1.

## Slide 4 — Net bind

![Net bind](assets/steps/02-net.png)

Net binding: net_a→a, net_y→y.

## Slide 5 — Supplies

![Supplies](assets/steps/03-sup.png)

net_vss→vss, net_vdd→vdd.

## Slide 6 — Pairs

![Pairs](assets/steps/04-pairs.png)

Four net pairs and two device pairs.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: device_count=2, net_count=4.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **pin-binding**. Select X0 and mn1; confirm binding table.

## Slide 9 — Implement track

Call pin_binding(); assert devices['X0']=='mn1' and len(nets)==4.

## Slide 10 — Pitfalls

Binding by position instead of connectivity. Missing a supply bind.

## Slide 11 — Your turn

Next: device matching.
