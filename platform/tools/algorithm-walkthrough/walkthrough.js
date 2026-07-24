/**
 * Step-by-step algorithm walkthroughs for PPT / transcript authoring.
 * URL: ?algo=affinity-metrics&step=1
 */
import {
  BAD_SEED,
  TINY_GRAPH,
  affinityEdgeWeight,
  affinitySharedNeighbors,
  cloneGraph,
  cutsize,
} from "../../assets/clustering-core.js";
import { drawGraph, el } from "../../assets/clustering-ui.js";
import { drawFloorplan } from "../../assets/floorplanning-core.js";
import {
  CELLS as PLACE_CELLS,
  NETS as PLACE_NETS,
  STARTER_PLACEMENT,
} from "../../assets/placement-core.js";
import { drawLegalization, OVERLAP_PLACEMENT } from "../../assets/legalization-core.js";
import { drawPlacement } from "../../assets/placement-ui.js";
import { drawTimingGraph } from "../../assets/sta-ui.js";
import { FLOORPLAN_ALGOS } from "./floorplanning-algos.js";
import { LEGALIZATION_ALGOS } from "./legalization-algos.js";
import { CONGESTION_ALGOS } from "./congestion-algos.js";
import { drawCongestion } from "../../assets/congestion-core.js";
import { GLOBAL_ROUTING_ALGOS } from "./global-routing-algos.js";
import { drawGlobalRoute, usageFromRoutes } from "../../assets/global-routing-core.js";
import { DETAILED_ROUTING_ALGOS } from "./detailed-routing-algos.js";
import { drawDetailedRoute, usageFromDetailedRoutes } from "../../assets/detailed-routing-core.js";
import { CLOCK_TREE_ALGOS } from "./clock-tree-algos.js";
import { drawClockTree } from "../../assets/clock-tree-core.js";
import { PLACEMENT_ALGO_IDS, PLACEMENT_ALGOS } from "./placement-algos.js";
import { STA_ALGOS } from "./sta-algos.js";

const graph = cloneGraph();

/** @typedef {{ id: string, title: string, caption: string, bullets: string[], metrics?: string[], assignment?: object|null, highlightPairs?: string[], showWeights?: boolean, pack?: object|null, pins?: object[], empty?: boolean }} Step */

/** @type {Record<string, { title: string, module: string, steps: Step[], kind?: string }>} */
const CLUSTER_ALGOS = {
  "affinity-metrics": {
    title: "Affinity metrics",
    module: "module01-01-affinity-metrics",
    steps: [
      {
        id: "raw-graph",
        title: "Start with a tiny weighted graph",
        caption:
          "Five cells A–E with edge weights. Heavy edges A–B and D–E both weigh 5; the bridge through C is weaker. Affinity will decide which pairs want to cluster first.",
        bullets: [
          "Nodes = cells / clusters to group",
          "Edge weight = how strongly a pair should stay together",
          "Reference instance used across all clustering labs",
        ],
        metrics: ["Graph: 5 nodes, 6 edges", "Heaviest edges: A–B=5, D–E=5"],
        assignment: null,
        highlightPairs: [],
      },
      {
        id: "edge-rank",
        title: "Edge-weight affinity ranks pairs",
        caption:
          "Pure edge-weight affinity just sorts existing edges. A–B and D–E tie at 5; tie-break puts A–B first. This ranking is the simplest merge priority.",
        bullets: [
          "score(u,v) = w(u,v)",
          "Sort descending by score",
          "Top pair becomes the first merge candidate",
        ],
        metrics: [
          "1. A–B @ 5",
          "2. D–E @ 5",
          "3. B–C @ 4",
          "4. C–D @ 2",
          "5. A–C @ 1",
          "6. C–E @ 1",
        ],
        assignment: null,
        highlightPairs: ["A|B"],
      },
      {
        id: "shared-idea",
        title: "Shared neighbors boost A–B",
        caption:
          "A and B already share edge weight 5. They also share neighbor C. Shared-neighbor affinity adds min(w(A,C), w(B,C)) = min(1,4) = 1, so A–B rises to 6.",
        bullets: [
          "Direct edge still counts",
          "Plus support through common neighbors",
          "Encourages dense triangles to cluster",
        ],
        metrics: [
          "w(A,B)=5",
          "shared via C: min(1,4)=1",
          "score(A,B)=6",
        ],
        assignment: null,
        highlightPairs: ["A|B", "A|C", "B|C"],
      },
      {
        id: "shared-rank",
        title: "Shared ranking reshuffles the list",
        caption:
          "Under shared-neighbor scoring, A–B and D–E lead at 6. Weak edge A–C jumps to 5 because of B. Non-edges like B–D can appear from shared support alone.",
        bullets: [
          "A–C: was 1 → now 5",
          "Invented pairs (e.g. B–D @ 2) show transitive pull",
          "Same idea feeds greedy merge priorities",
        ],
        metrics: (() => {
          const r = affinitySharedNeighbors(graph.nodes, graph.edges);
          return r.slice(0, 6).map(([u, v, s], i) => `${i + 1}. ${u}–${v} @ ${s}`);
        })(),
        assignment: null,
        highlightPairs: ["A|B", "A|C"],
      },
      {
        id: "takeaway",
        title: "Why affinity matters in EDA",
        caption:
          "Affinity is the objective’s local preference: which cells belong together before global constraints. Bad affinity → bad merges → harder refinement later.",
        bullets: [
          "Edge weight = connectivity / nets shared",
          "Shared neighbors ≈ denser local groups",
          "Next labs consume this ranking to merge",
        ],
        metrics: [
          "Edge top: A–B @ 5",
          "Shared top: A–B @ 6",
          "Teaching graph stays fixed for goldens",
        ],
        assignment: null,
        highlightPairs: ["A|B", "D|E"],
      },
    ],
  },

  "greedy-pair-merge": {
    title: "Greedy pair merge",
    module: "module01-03-greedy-pair-merge",
    steps: [
      {
        id: "singletons",
        title: "Every node starts alone",
        caption:
          "Agglomerative clustering begins with K=5 singletons. We repeatedly merge the highest-affinity legal pair until we hit target K.",
        bullets: [
          "Target here: K=2",
          "No capacity limit in the reference run",
          "Priority = current edge-weight ranking",
        ],
        metrics: ["K=5 → aim for K=2", "cutsize (all separate): 18"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
        highlightPairs: [],
      },
      {
        id: "merge-ab",
        title: "Merge 1: contract A–B",
        caption:
          "Heaviest edge is A–B at weight 5, so they merge first into a supernode. That protects the strongest connection immediately.",
        bullets: [
          "Pick top legal pair on current graph",
          "Contract into a cluster",
          "Recompute edges to the new supernode",
        ],
        metrics: ["merge: A–B @ 5 → C0", "clusters: AB | C | D | E"],
        assignment: { A: "0", B: "0", C: "C", D: "D", E: "E" },
        highlightPairs: ["A|B"],
      },
      {
        id: "absorb-c",
        title: "Merge 2: absorb C into AB",
        caption:
          "After contraction, C connects to {A,B} with combined weight 5. That ties D–E; alphabetical order merges C next, forming {A,B,C}.",
        bullets: [
          "Supernode edges sum parallel connections",
          "C joins the A–B community",
          "Still two merges left toward K=2",
        ],
        metrics: ["merge: C–C0 @ 5", "clusters: ABC | D | E", "cutsize now: 8"],
        assignment: { A: "0", B: "0", C: "0", D: "D", E: "E" },
        highlightPairs: ["B|C", "A|C"],
      },
      {
        id: "merge-de",
        title: "Merge 3: contract D–E",
        caption:
          "Last merge joins D–E at weight 5. We now have exactly two clusters: {A,B,C} versus {D,E}.",
        bullets: [
          "Reached target K=2",
          "Heavy edges sit inside clusters",
          "Only weak bridge edges remain cut",
        ],
        metrics: ["merge: D–E @ 5", "clusters: ABC | DE", "cutsize: 3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["D|E"],
      },
      {
        id: "final-cut",
        title: "Result: cutsize 3",
        caption:
          "Cut edges are C–D (2) and C–E (1). Greedy locked in the natural communities without backtracking—fast, but capacity rules can block this path.",
        bullets: [
          "Golden: ABC|DE, cut=3",
          "Capacity=2 would forbid size-3 {A,B,C}",
          "Refinement labs repair worse seeds later",
        ],
        metrics: ["Final parts: ABC|DE", "cutsize = 2+1 = 3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
    ],
  },

  "label-propagation": {
    title: "Label propagation",
    module: "module02-01-label-propagation",
    steps: [
      {
        id: "init",
        title: "Initialize: each node is its own label",
        caption:
          "Label propagation starts with five communities. Every node votes using weighted neighbor labels; async updates walk nodes in order A…E.",
        bullets: [
          "labels[v] = v initially",
          "No global objective—local majority votes",
          "Order matters for ties",
        ],
        metrics: ["labels: A,B,C,D,E", "num_clusters: 5"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
      },
      {
        id: "vote-idea",
        title: "Each node adopts the winning neighbor label",
        caption:
          "For a node v, sum edge weights by neighbor label and take the best. Dense A–B–C and D–E pull neighbors onto shared labels quickly.",
        bullets: [
          "vote(label) = Σ w(v, nbr) for nbrs with that label",
          "Ties broken lexicographically",
          "One sweep = one iteration",
        ],
        metrics: ["Focus: A hears B strongly (w=5)", "D hears E strongly (w=5)"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "after-iter1",
        title: "After iteration 1: already clustered",
        caption:
          "One async sweep flips A and C onto B, and D onto E. Communities {A,B,C} and {D,E} appear immediately on this tiny graph.",
        bullets: [
          "3 labels changed in iter 1",
          "A,B,C → label B",
          "D,E → label E",
        ],
        metrics: [
          'labels: {"A":"B","B":"B","C":"B","D":"E","E":"E"}',
          "cutsize: 3",
        ],
        assignment: { A: "B", B: "B", C: "B", D: "E", E: "E" },
      },
      {
        id: "iter2-stable",
        title: "Iteration 2: no changes → stop",
        caption:
          "A second sweep finds zero flips, so the algorithm reports iters_to_stable=2. Stability, not a cutsize objective, is the stopping rule.",
        bullets: [
          "changed == 0 ⇒ halt",
          "Golden: iters=2, cutsize=3",
          "Same communities greedy found",
        ],
        metrics: ["iters_to_stable: 2", "num_clusters: 2", "cutsize: 3"],
        assignment: { A: "B", B: "B", C: "B", D: "E", E: "E" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "When LP helps in EDA flows",
        caption:
          "LP is a cheap community detector—great as a seed or coarsening hint. It does not enforce balance or timing; refinement (KL/FM) still matters on hard instances.",
        bullets: [
          "Fast local updates",
          "Sensitive to node order",
          "Use with capacity / cut objectives downstream",
        ],
        metrics: ["Reference communities: ABC | DE"],
        assignment: { A: "B", B: "B", C: "B", D: "E", E: "E" },
      },
    ],
  },

  "kernighan-lin": {
    title: "Kernighan–Lin",
    module: "module02-05-kernighan-lin",
    steps: [
      {
        id: "bad-seed",
        title: "Bad seed: cutsize 12",
        caption:
          "Start from a terrible bipartition AE|BCD. Both heavy edges A–B and D–E are cut, so cutsize is 12. KL will search improving swaps.",
        bullets: [
          "Seed parts: A,E vs B,C,D",
          "Cut includes A–B(5) and D–E(5)",
          "Goal: reduce cut without enumerating all partitions",
        ],
        metrics: [`seed: ${JSON.stringify(BAD_SEED)}`, "cutsize: 12"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "gain-idea",
        title: "Score pairwise swaps by gain",
        caption:
          "KL considers swapping one vertex from each side. Gain estimates how much the cut shrinks. The best unlocked pair here is A↔D with gain 9.",
        bullets: [
          "D(v)=external−internal for each vertex",
          "Swap gain uses D values and the edge between the pair",
          "Lock pairs after considering them in a pass",
        ],
        metrics: ["Best candidate swap: A ↔ D", "gain g = 9"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|D"],
      },
      {
        id: "accept-swap",
        title: "Accept prefix: only A↔D",
        caption:
          "Pass 0 builds a sequence of candidate swaps, then keeps the prefix with best cumulative gain. Here best_k=1: perform A↔D once.",
        bullets: [
          "best_k = 1",
          "bestCum = 9",
          "cut 12 → 3 in one swap",
        ],
        metrics: [
          "pass 0: A/D(9)",
          "cutBefore=12 cutAfter=3",
          "improved=true",
        ],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "final",
        title: "Refined partition ABC|DE",
        caption:
          "After the swap, A joins B,C and D joins E. Heavy edges are internal; only the weak C–D/C–E bridge remains cut.",
        bullets: [
          "Final parts: ABC|DE",
          "Matches the greedy/LP communities",
          "Cutsize golden: 3",
        ],
        metrics: ["cutsize: 3", "parts: ABC|DE"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "pass1-stop",
        title: "Next pass finds nothing",
        caption:
          "Pass 1 reports improved=false. KL stops when a full pass cannot improve—local optimum for swap moves from this seed.",
        bullets: [
          "Local, not global, optimum",
          "Quality depends on the seed",
          "Still the classic bipartition refiner",
        ],
        metrics: ["pass 1: best_k=0 improved=false", "stop"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "fiduccia-mattheyses": {
    title: "Fiduccia–Mattheyses",
    module: "module02-07-fiduccia-mattheyses",
    steps: [
      {
        id: "bad-seed",
        title: "Same bad seed, different move set",
        caption:
          "FM starts from the same cutsize-12 seed, but moves one vertex at a time instead of swapping a pair. That suits hypergraph / cell-move implementations.",
        bullets: [
          "Single-vertex moves across the cut",
          "Bucketed gains for speed (classic FM)",
          "Balance tolerance limits lopsided moves",
        ],
        metrics: ["seed cutsize: 12", "parts: AE|BCD"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "move-d",
        title: "Move 1: flip D (gain 3)",
        caption:
          "Highest legal move sends D to the other side with gain 3. Partial progress: D joins E’s side early.",
        bullets: [
          "Pick unlocked vertex with best gain",
          "Apply move, lock vertex",
          "Update neighbor gains",
        ],
        metrics: ["move: D(g=3)", "running toward best prefix"],
        assignment: { A: "0", E: "0", D: "0", B: "1", C: "1" },
        highlightPairs: ["D|E"],
      },
      {
        id: "move-a",
        title: "Move 2: flip A (gain 6)",
        caption:
          "Next, A flips with gain 6. Cumulative gain is 3+6=9—the same total improvement KL found with one swap.",
        bullets: [
          "Two moves ≈ one KL swap’s worth of gain",
          "best_k=2 keeps both moves",
          "bestCum=9",
        ],
        metrics: ["moves: D(3), A(6)", "bestCum=9", "cut 12→3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B"],
      },
      {
        id: "final",
        title: "Final ABC|DE, cutsize 3",
        caption:
          "FM lands on the same refined bipartition as KL. Teaching point: move style differs, destination quality matches on this instance.",
        bullets: [
          "parts: ABC|DE",
          "cutsize: 3",
          "Compare with KL transcript side-by-side",
        ],
        metrics: ["cutsize: 3", "pass 0 improved=true"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "pass1-stop",
        title: "Pass 1 confirms local optimum",
        caption:
          "A second FM pass finds no improving move prefix. Stop. In real tools, FM often runs inside multilevel V-cycles with tighter balance and hyperedges.",
        bullets: [
          "improved=false on pass 1",
          "Cell moves scale to large netlists",
          "Next courses: multilevel + hypergraph",
        ],
        metrics: ["pass 1: best_k=0", "stop"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "size-constrained-agglomerative": {
    title: "Size-constrained agglomerative",
    module: "module01-05-size-constrained-agglomerative",
    steps: [
      {
        id: "capacity-rule",
        title: "Capacity blocks illegal merges",
        caption:
          "Same greedy heaviest-edge merge, but refuse any pair whose sizes sum above capacity. With capacity=2 on unit nodes, size-3 clusters are illegal.",
        bullets: [
          "Target K=2 with capacity=2",
          "Legal merges: size ≤ 2",
          "Unconstrained would absorb C into AB",
        ],
        metrics: ["capacity=2", "K=2", "start: five singletons"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
        highlightPairs: [],
      },
      {
        id: "merge-ab",
        title: "Merge A–B (still legal)",
        caption:
          "Heaviest edge A–B at weight 5 merges first. Combined size is 2 — exactly at capacity. C cannot join next.",
        bullets: [
          "First merge identical to unconstrained",
          "AB size = 2",
          "Next heaviest legal pair is D–E",
        ],
        metrics: ["merge: A–B @ 5", "clusters: AB | C | D | E"],
        assignment: { A: "0", B: "0", C: "C", D: "D", E: "E" },
        highlightPairs: ["A|B"],
      },
      {
        id: "merge-de",
        title: "Merge D–E; C stays alone",
        caption:
          "D–E merges at weight 5. Absorbing C into AB would create size 3 and is rejected, so we stop with three clusters even though target K=2.",
        bullets: [
          "Capacity stalls further merges",
          "Stuck at K=3 > target",
          "C is an isolated bridge node",
        ],
        metrics: ["merge: D–E @ 5", "parts: AB|C|DE", "cutsize: 8"],
        assignment: { A: "0", B: "0", C: "C", D: "1", E: "1" },
        highlightPairs: ["D|E"],
      },
      {
        id: "cut-8",
        title: "Result: cutsize 8",
        caption:
          "Cut edges include A–C, B–C, C–D, C–E. Capacity cost is +5 versus the unconstrained cut of 3.",
        bullets: [
          "Golden: AB|C|DE, cut=8",
          "Trade balance for worse cut",
          "Relax capacity to 3 to recover ABC|DE",
        ],
        metrics: ["cutsize: 8", "vs unconstrained: 3"],
        assignment: { A: "0", B: "0", C: "C", D: "1", E: "1" },
        highlightPairs: ["A|C", "B|C", "C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "Why capacity matters in EDA",
        caption:
          "Floorplanning and clustering often cap cluster area. Teaching point: constraints change the greedy path — you may never reach the unconstrained communities.",
        bullets: [
          "Capacity is a hard filter on merges",
          "May miss global cut optima",
          "Refinement / multilevel can help later",
        ],
        metrics: ["Starter golden: cut=8 with cap=2"],
        assignment: { A: "0", B: "0", C: "C", D: "1", E: "1" },
      },
    ],
  },

  "spectral-bisection": {
    title: "Spectral bisection",
    module: "module02-03-spectral-bisection",
    steps: [
      {
        id: "laplacian",
        title: "Build the Laplacian",
        caption:
          "Spectral methods read connectivity from the graph Laplacian L = D − A. The Fiedler vector (second eigenvector) encodes a soft cut.",
        bullets: [
          "Tiny n → pure shifted inverse iteration",
          "No external linear-algebra library",
          "Same TINY_GRAPH as other labs",
        ],
        metrics: ["nodes: 5", "edges: 6"],
        assignment: null,
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "fiedler-order",
        title: "Sort by Fiedler value",
        caption:
          "After iteration, nodes order low→high as E, D, C, B, A. E is most negative; A is most positive — natural bipartition candidates.",
        bullets: [
          "Order endpoints: E lowest, A highest",
          "Values are continuous soft memberships",
          "Balance filter rejects lopsided prefixes",
        ],
        metrics: ["order: E < D < C < B < A"],
        assignment: null,
        highlightPairs: [],
      },
      {
        id: "sweep-cut",
        title: "Sweep prefixes for best cut",
        caption:
          "Try every balanced prefix of the order as side 0. The winning split is {D,E} vs {A,B,C} with cutsize 3.",
        bullets: [
          "Balance window ≈ 20–80% size",
          "Pick minimum cut among legal splits",
          "Golden cut = 3",
        ],
        metrics: ["best parts: DE | ABC", "cutsize: 3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "final",
        title: "Result ABC|DE",
        caption:
          "Spectral recovers the same communities as unconstrained greedy and LP. Teaching point: global eigenvectors can find the cut without greedy merges.",
        bullets: [
          "parts: ABC|DE",
          "Heavy edges internal",
          "Bridge C–D/C–E cut",
        ],
        metrics: ["cutsize: 3", "parts: ABC|DE"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "When spectral helps",
        caption:
          "Spectral is a strong initializer for bipartition. On larger chips it pairs with multilevel; here the tiny instance is exact enough to grade against goldens.",
        bullets: [
          "Good seed for KL/FM",
          "Balance via sweep, not afterthought",
          "Next: swap/move refinement labs",
        ],
        metrics: ["Golden: cut=3, E lowest / A highest"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "multilevel-clustering": {
    title: "Multilevel clustering",
    module: "module03-01-multilevel-clustering",
    steps: [
      {
        id: "coarsen",
        title: "Coarsen with greedy merge",
        caption:
          "Multilevel starts by contracting the graph. Greedy pair merge to coarseK=2 builds a projected bipartition of the original nodes.",
        bullets: [
          "Coarsen → initial partition → refine",
          "Here: greedy to K=2",
          "Labels become FM sides 0/1",
        ],
        metrics: ["coarseK=2", "projected communities ready"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "project",
        title: "Project to a bipartition",
        caption:
          "Map the two coarse clusters onto sides 0 and 1. This seed is already near-optimal on TINY_GRAPH — unlike BAD_SEED’s cut of 12.",
        bullets: [
          "Projection preserves membership",
          "Contrast: bad seed AE|BCD",
          "Refinement polishes locally",
        ],
        metrics: ["projected cut ≈ 3", "BAD_SEED cut = 12"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "fm-refine",
        title: "FM-refine on the fine graph",
        caption:
          "Run Fiduccia–Mattheyses on the projected seed. On this instance refinement keeps ABC vs DE and renames sides to P0/P1.",
        bullets: [
          "Single-vertex moves with rollback",
          "Output labels: P0 and P1",
          "cutsize stays 3",
        ],
        metrics: ["FM refine", "labels → P{side}"],
        assignment: { A: "P0", B: "P0", C: "P0", D: "P1", E: "P1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "final",
        title: "Golden: cutsize 3",
        caption:
          "Final communities ABC|DE with P0/P1 labels. Multilevel’s value shows more on larger graphs; here it demonstrates the V-cycle shape.",
        bullets: [
          "parts: ABC|DE",
          "cutsize: 3",
          "Beats refining a random bad seed alone",
        ],
        metrics: ["cutsize: 3", "P0=ABC P1=DE"],
        assignment: { A: "P0", B: "P0", C: "P0", D: "P1", E: "P1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "Multilevel mindset",
        caption:
          "Coarsen for global structure, refine for local cut. Real placers nest this inside V-cycles with hyperedges and tighter balance — this lab is the skeleton.",
        bullets: [
          "Coarsen = greedy here",
          "Refine = FM here",
          "Next labs: hypergraph + EDA objectives",
        ],
        metrics: ["Starter golden: cut=3"],
        assignment: { A: "P0", B: "P0", C: "P0", D: "P1", E: "P1" },
      },
    ],
  },

  "hypergraph-clustering": {
    title: "Hypergraph clustering",
    module: "module03-03-hypergraph-clustering",
    steps: [
      {
        id: "nets",
        title: "Nets are hyperedges",
        caption:
          "TINY_HYPERGRAPH has four nets: multi-pin n1={A,B,C} weight 3, pair n2={D,E}, bridge n3={C,D}, and n4={A,B}. Cut counts whole nets, not pairs.",
        bullets: [
          "Hyperedge cut if pins span ≥2 clusters",
          "n1 pulls ABC together",
          "Graph clique expansion would look different",
        ],
        metrics: ["4 hyperedges", "5 nodes"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
        highlightPairs: ["A|B", "B|C", "A|C"],
      },
      {
        id: "affinity",
        title: "Affinity = shared pin weight",
        caption:
          "Greedy merge scores pairs by summed weights of hyperedges that contain both endpoints. A–B and A–C–B affinities favor the ABC community.",
        bullets: [
          "pair_affinity(a,b) = Σ w over shared nets",
          "Contract highest affinity pair",
          "Rewrite pins onto supernodes",
        ],
        metrics: ["priority: co-occurrence on nets"],
        assignment: Object.fromEntries(graph.nodes.map((n) => [n, n])),
        highlightPairs: ["A|B"],
      },
      {
        id: "merge-k2",
        title: "Merge down to K=2",
        caption:
          "Repeated contraction yields two clusters covering ABC and DE. Only bridge net n3 is cut.",
        bullets: [
          "Target K=2",
          "ABC stays on one supernode family",
          "DE on the other",
        ],
        metrics: ["parts: ABC|DE", "hyperedge cut: 1"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D"],
      },
      {
        id: "cut-1",
        title: "Hyperedge cut = 1",
        caption:
          "Golden: hyperedge cut 1 (n3 only). Pairwise graph cut on a clique expansion would score differently — that is the teaching contrast.",
        bullets: [
          "n1, n2, n4 uncut",
          "n3 cut → +1",
          "Objective matches netlist reality",
        ],
        metrics: ["hyperedge cut: 1", "parts: ABC|DE"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D"],
      },
      {
        id: "takeaway",
        title: "Why hypergraphs in EDA",
        caption:
          "Real nets touch many cells. Modeling them as hyperedges keeps the cut objective honest. Browser view clique-expands only for drawing.",
        bullets: [
          "Cut nets, not just edges",
          "Multi-pin nets dominate affinity",
          "Next: congestion / timing objectives",
        ],
        metrics: ["Starter golden: cut=1"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
      },
    ],
  },

  "congestion-aware-clustering": {
    title: "Congestion-aware clustering",
    module: "module04-01-congestion-aware-clustering",
    steps: [
      {
        id: "bad-seed",
        title: "Start from BAD_SEED",
        caption:
          "Same cutsize-12 seed AE|BCD. Congestion map marks C–D=5 and C–E=4 — cheap wire cuts may be expensive for routing.",
        bullets: [
          "plain cut ignores congestion",
          "penalty sums cong on cut edges",
          "λ trades plain vs penalty",
        ],
        metrics: [`seed cut: 12`, "cong: C|D=5, C|E=4"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "lam0",
        title: "λ=0 → ordinary FM",
        caption:
          "With λ=0, boosted weights equal original weights. FM recovers ABC|DE: plain=3 but penalty=9 because both congested bridges are cut.",
        bullets: [
          "plain=3, pen=9",
          "parts: ABC|DE",
          "Objective ignores routing pain",
        ],
        metrics: ["λ=0", "plain=3", "pen=9"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "boost",
        title: "Boost weights by λ·cong",
        caption:
          "For λ=5, C–D and C–E become very expensive to cut. FM optimizes the boosted graph, then we report plain cut and congestion penalty separately.",
        bullets: [
          "w' = w + λ·cong",
          "Run FM on w'",
          "Score plain + λ·pen on original",
        ],
        metrics: ["λ=5", "C–D and C–E heavily boosted"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "lam5",
        title: "λ=5 → pen 0, plain 5",
        caption:
          "Result AB|CDE: plain cut rises to 5, but congestion penalty drops to 0 — congested bridges stay internal.",
        bullets: [
          "parts: AB|CDE",
          "plain=5, pen=0",
          "objective=5",
        ],
        metrics: ["λ=5", "plain=5", "pen=0"],
        assignment: { A: "0", B: "0", C: "1", D: "1", E: "1" },
        highlightPairs: ["A|C", "B|C"],
      },
      {
        id: "takeaway",
        title: "Objective tradeoffs",
        caption:
          "EDA flows rarely optimize cut alone. λ makes the congestion tax explicit so students see the Pareto move between wire and routing.",
        bullets: [
          "λ=0 favors classic communities",
          "λ>0 protects congested edges",
          "Same FM engine, different weights",
        ],
        metrics: ["Goldens: (3,9) vs (5,0)"],
        assignment: { A: "0", B: "0", C: "1", D: "1", E: "1" },
      },
    ],
  },

  "timing-aware-clustering": {
    title: "Timing-aware clustering",
    module: "module04-03-timing-aware-clustering",
    steps: [
      {
        id: "criticality",
        title: "Mark critical edges",
        caption:
          "Criticality map emphasizes path A–B–C–D: A–B=5, B–C=4, C–D=3. Cutting critical edges hurts timing more than raw wire weight suggests.",
        bullets: [
          "weighted edge = w × criticality",
          "Start from BAD_SEED",
          "FM on the weighted graph",
        ],
        metrics: ["A|B=5", "B|C=4", "C|D=3"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "B|C", "C|D"],
      },
      {
        id: "weight",
        title: "Reweight then refine",
        caption:
          "Multiply each edge by its criticality (default 1 if missing). FM now strongly prefers keeping A–B and B–C internal.",
        bullets: [
          "Protect the critical path",
          "Still a bipartition FM",
          "Report plain and weighted cuts",
        ],
        metrics: ["engine: FM on weighted edges"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "B|C"],
      },
      {
        id: "result",
        title: "Land on ABC|DE",
        caption:
          "Timing-aware FM reaches ABC|DE. Plain cutsize is 3; weighted cut (criticality-scaled) is 7.",
        bullets: [
          "plain=3",
          "weightedCut=7",
          "parts: ABC|DE",
        ],
        metrics: ["plain: 3", "weighted: 7"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "protect",
        title: "Critical edges uncut",
        caption:
          "A–B and B–C stay inside ABC. The cut uses less critical bridges C–D and C–E — acceptable plain cut, better timing story.",
        bullets: [
          "A–B (crit 5) internal",
          "B–C (crit 4) internal",
          "Bridge cut carries lower timing risk",
        ],
        metrics: ["critical path protected"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["A|B", "B|C"],
      },
      {
        id: "takeaway",
        title: "Timing as an objective",
        caption:
          "Reweighting turns the same FM kernel into a timing-aware partitioner. Students compare plain vs weighted metrics on one seed.",
        bullets: [
          "Criticality ≠ congestion",
          "Same BAD_SEED, different map",
          "Goldens: plain 3 / weighted 7",
        ],
        metrics: ["Starter golden: ABC|DE"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
      },
    ],
  },

  "cutsize-balance": {
    title: "Cutsize & balance",
    module: "module01-01-cutsize-balance",
    steps: [
      {
        id: "graph",
        title: "Same graph, two bipartitions",
        caption:
          "TINY_GRAPH has five cells. Partition quality is measured by cutsize (sum of cut edge weights) and balance (how even the two sides are).",
        bullets: [
          "Cutsize = wire crossing the partition",
          "Balance ratio = min side / max side",
          "Both metrics matter in floorplanning",
        ],
        metrics: ["5 nodes, 6 edges", "Target: legal 2-way split"],
        assignment: null,
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "bad-seed",
        title: "Bad seed: cutsize 12",
        caption:
          "Seed AE|BCD cuts both heavy edges A–B(5) and D–E(5). Cutsize is 12 — a terrible wire cost even though the split is legal.",
        bullets: [
          "Parts: A,E vs B,C,D",
          "Heavy internal edges become cut edges",
          "Same graph used across partitioning labs",
        ],
        metrics: [`seed: ${JSON.stringify(BAD_SEED)}`, "cutsize: 12", "parts: AE|BCD"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "bad-balance",
        title: "Bad seed balance: ratio 2/3",
        caption:
          "Side sizes are 2 vs 3, so balance ratio = 2/3 and imbalance |2−3|/5 = 0.2. The split is moderately balanced — cutsize, not balance, is the problem.",
        bullets: [
          "ratio = min/max of side sizes",
          "imbalance = |s0−s1| / n",
          "Balance alone does not rank partitions",
        ],
        metrics: ["sizes: 2 vs 3", "ratio: 0.6667", "imbalance: 0.2"],
        assignment: { ...BAD_SEED },
      },
      {
        id: "golden",
        title: "Golden ABC|DE: cutsize 3",
        caption:
          "Golden bipartition ABC|DE keeps A–B and D–E internal. Only weak bridges C–D(2) and C–E(1) are cut — cutsize drops to 3 with the same 2/3 ratio.",
        bullets: [
          "Heavy edges stay inside communities",
          "Same balance ratio as bad seed",
          "Cutsize distinguishes quality",
        ],
        metrics: ["parts: ABC|DE", "cutsize: 3", "ratio: 2/3 (unchanged)"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "Cutsize + balance literacy",
        caption:
          "Two partitions can share the same balance but differ wildly in cut. EDA flows optimize cut under balance constraints — never balance alone.",
        bullets: [
          "Bad: AE|BCD cut 12, ratio 2/3",
          "Golden: ABC|DE cut 3, ratio 2/3",
          "Refinement labs repair bad seeds later",
        ],
        metrics: ["12 → 3 cut improvement", "ratio stays 2/3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["A|B", "D|E"],
      },
    ],
  },

  "initial-bipartition": {
    title: "Initial bipartition",
    module: "module01-03-initial-bipartition",
    steps: [
      {
        id: "empty",
        title: "Need a legal starting split",
        caption:
          "Refinement (KL/FM) needs a bipartition seed. Common builders: random, greedy heaviest-edge, or grow-from-node BFS. All must end with exactly two sides.",
        bullets: [
          "Random: shuffle + half/half",
          "Greedy: anchor heaviest edge",
          "Grow: BFS by heaviest neighbor",
        ],
        metrics: ["5 nodes → target ~2 vs 3 per side"],
        assignment: null,
        highlightPairs: [],
      },
      {
        id: "random-lucky",
        title: "Random seed=1: lucky ABC|DE",
        caption:
          "Random (seed=1) lands on ABC|DE with cutsize 3 — the golden communities by luck. Random seeds can also be terrible (seed=4 → cut 13).",
        bullets: [
          "Reproducible with fixed RNG seed",
          "Lucky draw matches golden",
          "Unlucky seeds need refinement",
        ],
        metrics: ["method: random seed=1", "parts: ABC|DE", "cutsize: 3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "greedy",
        title: "Greedy initial: AB|CDE cut 5",
        caption:
          "Greedy anchors heaviest edge A–B on side 0, then places remaining nodes to minimize added cut. Result AB|CDE has cutsize 5 — legal but worse than grow.",
        bullets: [
          "Starts with A–B @ weight 5",
          "Fills side 1 for balance",
          "Deterministic, not always optimal",
        ],
        metrics: ["method: greedy", "parts: AB|CDE", "cutsize: 5"],
        assignment: { A: "0", B: "0", C: "1", D: "1", E: "1" },
        highlightPairs: ["A|B", "C|D"],
      },
      {
        id: "grow-d",
        title: "Grow from D: ABC|DE cut 3",
        caption:
          "Grow from D pulls E first (w=5), then A and B via heavy edges. Side 0 = {D,E}, side 1 = {A,B,C} — cutsize 3, matching golden.",
        bullets: [
          "BFS by heaviest uncut neighbor",
          "Grow from E is symmetric",
          "Reference starter in the lab",
        ],
        metrics: ["method: grow seed D", "parts: ABC|DE", "cutsize: 3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["D|E", "A|B"],
      },
      {
        id: "takeaway",
        title: "Seed quality sets the ceiling",
        caption:
          "All three methods produce legal bipartitions, but cutsize ranges 3–13 on the same graph. Better seeds mean less work for KL/FM downstream.",
        bullets: [
          "Random: luck-dependent",
          "Greedy: cut 5 on this instance",
          "Grow D: cut 3 — lab reference",
        ],
        metrics: ["Always exactly 2 labels", "Grow D beats greedy here"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
    ],
  },

  "kl-partition": {
    title: "Kernighan–Lin bipartition",
    module: "module02-01-kl-partition",
    steps: [
      {
        id: "bad-seed",
        title: "Bad seed: cutsize 12",
        caption:
          "Start from a terrible bipartition AE|BCD. Both heavy edges A–B and D–E are cut, so cutsize is 12. KL will search improving swaps.",
        bullets: [
          "Seed parts: A,E vs B,C,D",
          "Cut includes A–B(5) and D–E(5)",
          "Goal: reduce cut without enumerating all partitions",
        ],
        metrics: [`seed: ${JSON.stringify(BAD_SEED)}`, "cutsize: 12"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "gain-idea",
        title: "Score pairwise swaps by gain",
        caption:
          "KL considers swapping one vertex from each side. Gain estimates how much the cut shrinks. The best unlocked pair here is A↔D with gain 9.",
        bullets: [
          "D(v)=external−internal for each vertex",
          "Swap gain uses D values and the edge between the pair",
          "Lock pairs after considering them in a pass",
        ],
        metrics: ["Best candidate swap: A ↔ D", "gain g = 9"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|D"],
      },
      {
        id: "accept-swap",
        title: "Accept prefix: only A↔D",
        caption:
          "Pass 0 builds a sequence of candidate swaps, then keeps the prefix with best cumulative gain. Here best_k=1: perform A↔D once.",
        bullets: [
          "best_k = 1",
          "bestCum = 9",
          "cut 12 → 3 in one swap",
        ],
        metrics: [
          "pass 0: A/D(9)",
          "cutBefore=12 cutAfter=3",
          "improved=true",
        ],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "final",
        title: "Refined partition ABC|DE",
        caption:
          "After the swap, A joins B,C and D joins E. Heavy edges are internal; only the weak C–D/C–E bridge remains cut.",
        bullets: [
          "Final parts: ABC|DE",
          "Matches the greedy/LP communities",
          "Cutsize golden: 3",
        ],
        metrics: ["cutsize: 3", "parts: ABC|DE"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "pass1-stop",
        title: "Next pass finds nothing",
        caption:
          "Pass 1 reports improved=false. KL stops when a full pass cannot improve — local optimum for swap moves from this seed.",
        bullets: [
          "Local, not global, optimum",
          "Quality depends on the seed",
          "Still the classic bipartition refiner",
        ],
        metrics: ["pass 1: best_k=0 improved=false", "stop"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "fm-partition": {
    title: "Fiduccia–Mattheyses bipartition",
    module: "module02-03-fm-partition",
    steps: [
      {
        id: "bad-seed",
        title: "Same bad seed, different move set",
        caption:
          "FM starts from the same cutsize-12 seed, but moves one vertex at a time instead of swapping a pair. That suits hypergraph / cell-move implementations.",
        bullets: [
          "Single-vertex moves across the cut",
          "Bucketed gains for speed (classic FM)",
          "Balance tolerance limits lopsided moves",
        ],
        metrics: ["seed cutsize: 12", "parts: AE|BCD"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "move-d",
        title: "Move 1: flip D (gain 3)",
        caption:
          "Highest legal move sends D to the other side with gain 3. Partial progress: D joins E's side early.",
        bullets: [
          "Pick unlocked vertex with best gain",
          "Apply move, lock vertex",
          "Update neighbor gains",
        ],
        metrics: ["move: D(g=3)", "running toward best prefix"],
        assignment: { A: "0", E: "0", D: "0", B: "1", C: "1" },
        highlightPairs: ["D|E"],
      },
      {
        id: "move-a",
        title: "Move 2: flip A (gain 6)",
        caption:
          "Next, A flips with gain 6. Cumulative gain is 3+6=9 — the same total improvement KL found with one swap.",
        bullets: [
          "Two moves ≈ one KL swap's worth of gain",
          "best_k=2 keeps both moves",
          "bestCum=9",
        ],
        metrics: ["moves: D(3), A(6)", "bestCum=9", "cut 12→3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B"],
      },
      {
        id: "final",
        title: "Final ABC|DE, cutsize 3",
        caption:
          "FM lands on the same refined bipartition as KL. Teaching point: move style differs, destination quality matches on this instance.",
        bullets: [
          "parts: ABC|DE",
          "cutsize: 3",
          "Compare with KL transcript side-by-side",
        ],
        metrics: ["cutsize: 3", "pass 0 improved=true"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "pass1-stop",
        title: "Pass 1 confirms local optimum",
        caption:
          "A second FM pass finds no improving move prefix. Stop. In real tools, FM often runs inside multilevel V-cycles with tighter balance and hyperedges.",
        bullets: [
          "improved=false on pass 1",
          "Cell moves scale to large netlists",
          "Next: multilevel + hypergraph partition",
        ],
        metrics: ["pass 1: best_k=0", "stop"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "spectral-partition": {
    title: "Spectral bipartition",
    module: "module02-05-spectral-partition",
    steps: [
      {
        id: "laplacian",
        title: "Build the Laplacian",
        caption:
          "Spectral methods read connectivity from the graph Laplacian L = D − A. The Fiedler vector (second eigenvector) encodes a soft cut.",
        bullets: [
          "Tiny n → pure shifted inverse iteration",
          "No external linear-algebra library",
          "Same TINY_GRAPH as other labs",
        ],
        metrics: ["nodes: 5", "edges: 6"],
        assignment: null,
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "fiedler-order",
        title: "Sort by Fiedler value",
        caption:
          "After iteration, nodes order low→high as E, D, C, B, A. E is most negative; A is most positive — natural bipartition candidates.",
        bullets: [
          "Order endpoints: E lowest, A highest",
          "Values are continuous soft memberships",
          "Balance filter rejects lopsided prefixes",
        ],
        metrics: ["order: E < D < C < B < A"],
        assignment: null,
        highlightPairs: [],
      },
      {
        id: "sweep-cut",
        title: "Sweep prefixes for best cut",
        caption:
          "Try every balanced prefix of the order as side 0. The winning split is {D,E} vs {A,B,C} with cutsize 3.",
        bullets: [
          "Balance window ≈ 20–80% size",
          "Pick minimum cut among legal splits",
          "Golden cut = 3",
        ],
        metrics: ["best parts: DE | ABC", "cutsize: 3"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "final",
        title: "Result ABC|DE",
        caption:
          "Spectral recovers the same communities as unconstrained greedy and grow-from-D. Global eigenvectors find the cut without greedy merges.",
        bullets: [
          "parts: ABC|DE",
          "Heavy edges internal",
          "Bridge C–D/C–E cut",
        ],
        metrics: ["cutsize: 3", "parts: ABC|DE"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "When spectral helps",
        caption:
          "Spectral is a strong initializer for bipartition. On larger chips it pairs with multilevel; here the tiny instance grades against golden cut 3.",
        bullets: [
          "Good seed for KL/FM",
          "Balance via sweep, not afterthought",
          "Used inside recursive bisection too",
        ],
        metrics: ["Golden: cut=3, E lowest / A highest"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
      },
    ],
  },

  "recursive-bisection": {
    title: "Recursive bisection",
    module: "module02-07-recursive-bisection",
    steps: [
      {
        id: "start",
        title: "Start: one part, k=4 target",
        caption:
          "Recursive bisection builds k-way partitions by repeated 2-way splits. Target k=4 on TINY_GRAPH: bisect the largest part until four labels exist.",
        bullets: [
          "Always split the largest current part",
          "Inner split uses spectral bisection",
          "History logs each bisection step",
        ],
        metrics: ["target k=4", "step 0: ABCDE cut=0"],
        assignment: { A: "0", B: "0", C: "0", D: "0", E: "0" },
      },
      {
        id: "split-1",
        title: "Bisect 1: ABC|DE cut 3",
        caption:
          "First spectral split on the whole graph yields ABC|DE — same golden bipartition with cutsize 3. Two parts remain; need two more splits.",
        bullets: [
          "Largest part = all five nodes",
          "Spectral → ABC vs DE",
          "Heavy edges A–B, D–E internal",
        ],
        metrics: ["step 1: ABC|DE", "cutsize: 3", "k=2 so far"],
        assignment: { A: "1", B: "1", C: "1", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "split-2",
        title: "Bisect 2: split ABC → AB|C",
        caption:
          "Largest part ABC (size 3) is bisected next. A and B stay together (w=5); C becomes its own part. Three parts: AB, C, DE.",
        bullets: [
          "Split ABC via induced spectral",
          "A–B heavy edge survives",
          "cutsize rises to 8",
        ],
        metrics: ["step 2: AB|C|DE", "cutsize: 8", "k=3"],
        assignment: { A: "1", B: "1", C: "2", D: "0", E: "0" },
        highlightPairs: ["A|B", "C|D"],
      },
      {
        id: "split-3",
        title: "Bisect 3: split DE → D|E",
        caption:
          "Largest remaining part DE is bisected, cutting the weight-5 D–E edge. Final four parts: AB, C, D, E singleton aside from AB pair.",
        bullets: [
          "Split DE — pays the heavy edge",
          "k=4 reached",
          "AB still uncut",
        ],
        metrics: ["step 3: AB|C|D|E", "cutsize: 13", "k=4"],
        assignment: { A: "1", B: "1", C: "2", D: "3", E: "0" },
        highlightPairs: ["D|E", "C|D"],
      },
      {
        id: "takeaway",
        title: "Recursive bisection tradeoff",
        caption:
          "k=4 costs cut 13 because splitting DE destroys the weight-5 edge. k=3 stops earlier at AB|C|DE cut 8 — fewer splits can mean lower total cut.",
        bullets: [
          "Largest-part-first scheduling",
          "Each split is local spectral",
          "Compare k=3 (cut 8) vs k=4 (cut 13)",
        ],
        metrics: ["Final: AB|C|D|E cut=13", "k=3 reference: cut=8"],
        assignment: { A: "1", B: "1", C: "2", D: "3", E: "0" },
      },
    ],
  },

  "multiway-partition": {
    title: "Multiway partition",
    module: "module03-01-multiway-partition",
    steps: [
      {
        id: "problem",
        title: "k-way vs naive assignment",
        caption:
          "Real placers need k>2 parts. Recursive bisection respects graph structure; naive round-robin assigns nodes by index mod k — often catastrophic cut.",
        bullets: [
          "k=3 on TINY_GRAPH",
          "Recursive: repeated bisection",
          "Round-robin: A→0, B→1, C→2, …",
        ],
        metrics: ["target k=3", "same graph, two strategies"],
        assignment: null,
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "recursive",
        title: "Recursive: AB|C|DE cut 8",
        caption:
          "Recursive bisection to k=3 first splits ABC|DE (cut 3), then bisects ABC → AB|C|DE. A–B and D–E stay uncut; total cutsize is 8.",
        bullets: [
          "Structure-aware splits",
          "A,B share a part",
          "D,E share a part",
        ],
        metrics: ["parts: AB|C|DE", "cutsize: 8", "3 labels"],
        assignment: { A: "1", B: "1", C: "2", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "roundrobin",
        title: "Round-robin: AD|BE|C cut 18",
        caption:
          "Alphabetical round-robin puts A,D on part 0; B,E on part 1; C alone on part 2. Almost every edge crosses — cutsize 18.",
        bullets: [
          "A and B on different parts",
          "D and E on different parts",
          "Ignores connectivity entirely",
        ],
        metrics: ["parts: AD|BE|C", "cutsize: 18", "gap vs recursive: 10"],
        assignment: { A: "0", B: "1", C: "2", D: "0", E: "1" },
        highlightPairs: ["A|B", "D|E", "A|C"],
      },
      {
        id: "compare",
        title: "Structure beats indexing",
        caption:
          "Round-robin cuts A–B(5) and D–E(5) — the two strongest edges. Recursive keeps them internal and pays only bridge cuts through C.",
        bullets: [
          "18 − 8 = 10 cut gap",
          "Same k, wildly different quality",
          "Why tools use recursive / multilevel",
        ],
        metrics: ["recursive: 8", "round-robin: 18"],
        assignment: { A: "1", B: "1", C: "2", D: "0", E: "0" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "takeaway",
        title: "Multiway literacy",
        caption:
          "Direct k-way FM exists in production tools, but recursive bisection is the teaching baseline: global structure emerges from local 2-way splits.",
        bullets: [
          "Never round-robin a netlist",
          "Recursive k=3: AB|C|DE",
          "Multilevel wraps the same idea",
        ],
        metrics: ["Starter golden: recursive cut=8"],
        assignment: { A: "1", B: "1", C: "2", D: "0", E: "0" },
      },
    ],
  },

  "terminal-propagation": {
    title: "Terminal propagation",
    module: "module03-03-terminal-propagation",
    steps: [
      {
        id: "fixed-terminals",
        title: "Fix pads A and E to opposite sides",
        caption:
          "I/O terminals are pinned: A→side 0, E→side 1. Free nodes B, C, D propagate by taking the side of the strongest neighboring fixed/assigned node.",
        bullets: [
          "Terminals never flip",
          "Free nodes vote by edge weight",
          "Iterate until stable",
        ],
        metrics: ["fixed: A=0, E=1", "free: B, C, D"],
        assignment: { A: "0", E: "1", B: "B", C: "C", D: "D" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "b-joins-a",
        title: "B joins A (w=5)",
        caption:
          "B hears A strongly on side 0 (A–B weight 5) versus weak pull from E. B adopts side 0 immediately.",
        bullets: [
          "vote(side) = Σ w to neighbors on that side",
          "Heavy A–B affinity wins",
          "Fixed A anchors the ABC community",
        ],
        metrics: ["B → side 0", "A–B internal"],
        assignment: { A: "0", B: "0", E: "1", C: "C", D: "D" },
        highlightPairs: ["A|B"],
      },
      {
        id: "d-joins-e",
        title: "D joins E (w=5)",
        caption:
          "D hears E on side 1 (D–E weight 5). D adopts side 1, forming the DE block opposite ABC.",
        bullets: [
          "Symmetric to B joining A",
          "Fixed E anchors DE",
          "Two communities emerging",
        ],
        metrics: ["D → side 1", "D–E internal"],
        assignment: { A: "0", B: "0", D: "1", E: "1", C: "C" },
        highlightPairs: ["D|E"],
      },
      {
        id: "c-bridge",
        title: "C bridges by neighbor vote",
        caption:
          "C connects to both communities. Neighbor vote sums favor joining A/B side (w=4+1 vs w=2+1). C lands on side 0 with A,B.",
        bullets: [
          "Bridge node follows stronger pull",
          "Cut edges: C–D, C–E only",
          "cutsize = 3",
        ],
        metrics: ["C → side 0", "parts: ABC|DE", "cutsize: 3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "Fixed I/O drives partition",
        caption:
          "Terminal propagation converges in 2 iterations on this graph. Real designs pin hundreds of pads — free logic follows connectivity to terminals.",
        bullets: [
          "A/E terminals → ABC|DE",
          "Same golden as spectral/grow",
          "Cheap seed before FM refine",
        ],
        metrics: ["iters: 2", "cutsize: 3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["A|B", "D|E"],
      },
    ],
  },

  "hypergraph-partition": {
    title: "Hypergraph partition",
    module: "module03-05-hypergraph-partition",
    steps: [
      {
        id: "nets",
        title: "Nets are hyperedges",
        caption:
          "TINY_HYPERGRAPH has four nets: n1={A,B,C} w=3, n2={D,E}, n3={C,D}, n4={A,B}. Cut counts whole nets spanning ≥2 sides — not pairwise edges alone.",
        bullets: [
          "Hyperedge cut if pins span sides",
          "n1 pulls ABC together",
          "Drawing uses clique expansion",
        ],
        metrics: ["4 hyperedges", "5 nodes"],
        assignment: null,
        highlightPairs: ["A|B", "B|C"],
      },
      {
        id: "bad-seed",
        title: "Bad seed: hyperedge cut 6",
        caption:
          "BAD_SEED AE|BCD cuts nets n1(3), n2(2), and n4(1) — hyperedge cut 6. Same seed as graph labs, worse hyper objective.",
        bullets: [
          "n1 spans A vs B,C",
          "n2 spans D,E vs B,C,D",
          "Pairwise cut ≠ hyper cut",
        ],
        metrics: ["seed: AE|BCD", "hyperedge cut: 6"],
        assignment: { ...BAD_SEED },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "fm-run",
        title: "FM on clique expansion",
        caption:
          "Hypergraph FM clique-expands nets to pair edges, then runs standard FM from the bad seed. Objective reports hyperedge cut on the original nets.",
        bullets: [
          "Clique expansion for moves",
          "Score hyperedge cut after moves",
          "Same FM kernel as graph labs",
        ],
        metrics: ["engine: FM on expansion", "seed hyper cut: 6"],
        assignment: { ...BAD_SEED },
      },
      {
        id: "refined",
        title: "Refined ABC|DE: hyper cut 1",
        caption:
          "FM reaches ABC|DE. Only bridge net n3={C,D} crosses sides — hyperedge cut 1. n1, n2, n4 stay uncut.",
        bullets: [
          "n1 ABC internal",
          "n2 DE internal",
          "n3 is the sole cut net",
        ],
        metrics: ["parts: ABC|DE", "hyperedge cut: 1", "pair cut: 1"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D"],
      },
      {
        id: "takeaway",
        title: "Why hypergraphs in partition",
        caption:
          "Real netlists are hypergraphs. Modeling nets honestly changes the cut objective — clique expansion is for moves, hyper cut is for scoring.",
        bullets: [
          "6 → 1 hyper cut improvement",
          "Multi-pin nets dominate affinity",
          "Production tools use native hyper FM",
        ],
        metrics: ["Starter golden: hyper cut=1"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
      },
    ],
  },

  "multilevel-partition": {
    title: "Multilevel partition",
    module: "module04-01-multilevel-partition",
    steps: [
      {
        id: "coarsen",
        title: "Coarsen with greedy merge",
        caption:
          "Multilevel V-cycle contracts the graph via greedy pair merge to coarseK=2. Supernodes C1={A,B,C} and C2={D,E} capture community structure.",
        bullets: [
          "Greedy heaviest-edge merges",
          "Log each contraction",
          "Coarse graph has 2 clusters",
        ],
        metrics: ["coarseK=2", "labels: C1, C2"],
        assignment: { A: "C1", B: "C1", C: "C1", D: "C2", E: "C2" },
        highlightPairs: ["A|B", "D|E"],
      },
      {
        id: "project",
        title: "Project to fine bipartition",
        caption:
          "Map coarse clusters to sides 0/1: ABC→0, DE→1. Projected seed ABC|DE already has cutsize 3 — unlike BAD_SEED's cut of 12.",
        bullets: [
          "Projection preserves membership",
          "Good global seed from coarsening",
          "Ready for local FM refine",
        ],
        metrics: ["project: ABC|DE", "cutsize: 3", "BAD_SEED cut: 12"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "refine",
        title: "FM refine on fine graph",
        caption:
          "FM polishes the projected seed. On TINY_GRAPH the projection is already optimal — refine keeps ABC|DE at cutsize 3.",
        bullets: [
          "Single-vertex moves with rollback",
          "Local search on fine graph",
          "No improvement needed here",
        ],
        metrics: ["refine: ABC|DE", "cutsize: 3"],
        assignment: { A: "0", B: "0", C: "0", D: "1", E: "1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "final",
        title: "Final P0/P1 labels",
        caption:
          "Output renames sides to P0/P1 for placers. Final communities ABC|DE with cutsize 3 — multilevel beats refining a random bad seed alone.",
        bullets: [
          "P0 = ABC, P1 = DE",
          "cutsize: 3",
          "V-cycle complete",
        ],
        metrics: ["final: ABC|DE", "cutsize: 3", "labels: P0, P1"],
        assignment: { A: "P0", B: "P0", C: "P0", D: "P1", E: "P1" },
        highlightPairs: ["C|D", "C|E"],
      },
      {
        id: "takeaway",
        title: "Multilevel V-cycle mindset",
        caption:
          "Coarsen for global structure, project, refine locally. Real placers nest this in repeated V-cycles with hyperedges and balance — this lab is the skeleton.",
        bullets: [
          "coarsen → project → refine",
          "Beats BAD_SEED cut 12 → 3",
          "Industry default for large netlists",
        ],
        metrics: ["Starter golden: cut=3"],
        assignment: { A: "P0", B: "P0", C: "P0", D: "P1", E: "P1" },
      },
    ],
  },
};

export const ALGOS = {
  ...CLUSTER_ALGOS,
  ...FLOORPLAN_ALGOS,
  ...STA_ALGOS,
  ...PLACEMENT_ALGOS,
  ...LEGALIZATION_ALGOS,
  ...CONGESTION_ALGOS,
  ...GLOBAL_ROUTING_ALGOS,
  ...DETAILED_ROUTING_ALGOS,
  ...CLOCK_TREE_ALGOS,
};

function qs() {
  const u = new URL(location.href);
  return {
    algo: u.searchParams.get("algo") || "affinity-metrics",
    step: Math.max(1, parseInt(u.searchParams.get("step") || "1", 10) || 1),
  };
}

function render() {
  const { algo, step } = qs();
  const pack = ALGOS[algo] || ALGOS["affinity-metrics"];
  const steps = pack.steps;
  const idx = Math.min(steps.length, Math.max(1, step)) - 1;
  const s = steps[idx];

  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  for (const [id, p] of Object.entries(ALGOS)) {
    nav.append(
      el("a", {
        className: "btn " + (id === algo ? "btn-primary" : "btn-ghost"),
        href: `?algo=${id}&step=1`,
        text: p.title,
      })
    );
  }
  nav.append(el("span", { text: " · " }));
  for (let i = 1; i <= steps.length; i++) {
    nav.append(
      el("a", {
        className: "btn " + (i === idx + 1 ? "btn-secondary" : "btn-ghost"),
        href: `?algo=${algo}&step=${i}`,
        text: String(i),
      })
    );
  }

  const frame = document.getElementById("walk-frame");
  frame.innerHTML = "";
  const banner = el("div", { className: "walk-banner" }, [
    el("div", { className: "algo", text: pack.title }),
    el("h1", { text: s.title }),
    el("div", {
      className: "step-meta",
      text: `Step ${idx + 1} / ${steps.length} · ${s.id} · ${pack.module}`,
    }),
  ]);

  const canvas = el("canvas", { className: "cluster-canvas" });
  const left = el("div", { className: "walk-canvas-wrap" }, [canvas]);
  const explain = el("div", { className: "walk-explain" }, [
    el("h2", { text: "Explanation" }),
    el("p", { className: "caption", text: s.caption }),
    el(
      "ul",
      {},
      s.bullets.map((b) => el("li", { text: b }))
    ),
    el("div", {
      className: "walk-metrics",
      text: (s.metrics || []).join("\n"),
    }),
  ]);

  const body = el("div", { className: "walk-body" }, [left, explain]);
  frame.append(banner, body);

  if (pack.kind === "floorplan" || s.pack != null) {
    drawFloorplan(canvas, {
      pack: s.pack || {},
      pins: s.pins || [],
    });
  } else if (pack.kind === "sta" || s.timing != null) {
    drawTimingGraph(canvas, s.timing || {}, {
      levels: s.levels || null,
      highlightPins: s.highlightPins || [],
      highlightArcs: s.highlightArcs || [],
      tags: s.tags || {},
    });
  } else if (pack.kind === "legalization") {
    drawLegalization(canvas, {
      positions: s.positions || OVERLAP_PLACEMENT,
      highlight: s.highlight || [],
    });
  } else if (pack.kind === "congestion") {
    drawCongestion(canvas, {
      positions: s.positions,
      heat: s.heat || null,
      heatMode: s.heatMode || "cong",
      highlight: s.highlight || [],
    });
  } else if (pack.kind === "global-routing") {
    const grRoutes = s.routes || [];
    const grUsage = s.usage || (grRoutes.length ? usageFromRoutes(grRoutes) : null);
    drawGlobalRoute(canvas, {
      positions: s.positions,
      usage: grUsage,
      routes: grRoutes,
      highlightPath: s.highlightPath || null,
      selectedNet: s.selectedNet ?? null,
      highlight: s.highlight || [],
    });
  } else if (pack.kind === "detailed-routing") {
    const drRoutes = s.routes || [];
    const drUsage = s.usage || (drRoutes.length ? usageFromDetailedRoutes(drRoutes) : null);
    drawDetailedRoute(canvas, {
      positions: s.positions,
      usage: drUsage,
      routes: drRoutes,
      cap: s.cap ?? undefined,
      highlightPath: s.highlightPath || null,
      selectedNet: s.selectedNet ?? null,
      highlight: s.highlight || [],
    });
  } else if (pack.kind === "clock-tree") {
    drawClockTree(canvas, {
      positions: s.positions,
      tree: s.tree || undefined,
      selectedSink: s.selectedSink || null,
      highlight: s.highlight || [],
      showSkew: s.showSkew !== false,
    });
  } else if (
    pack.kind === "placement" ||
    s.positions != null ||
    PLACEMENT_ALGO_IDS.has(algo)
  ) {
    drawPlacement(canvas, PLACE_CELLS, s.positions || STARTER_PLACEMENT, PLACE_NETS, {
      highlightNets: s.highlightNets || [],
      highlightCells: s.highlightCells || [],
      grid: s.grid ?? 2,
      showNets: s.showNets,
      showBBox: s.showBBox,
    });
  } else {
    drawGraph(canvas, TINY_GRAPH, {
      assignment: s.assignment || null,
      highlightPairs: s.highlightPairs || [],
    });
  }

  // unused import guard for edge ranking goldens in affinity metrics text
  void affinityEdgeWeight;
  void cutsize;

  frame.dataset.ready = "1";
  frame.dataset.algo = algo;
  frame.dataset.step = String(idx + 1);
  frame.dataset.stepId = s.id;
  frame.dataset.module = pack.module;
}

render();
