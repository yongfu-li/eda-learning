# Examples — Offline benchmark compare

## Platform benchmarks (primary)

1. Open `platform/benchmarks/partitioning/`.
2. **Selective:** Tiny instance → Run — read Runtime / Memory, then cut/balance.
3. Inspect the runtime vs memory scatter; click a row to highlight.
4. **Upload:** Load the example stub (or your `.js`), Register solver, Run again — your row sits **above** builtins.
5. **Dataset average:** check Tiny + Medium, average mode, Run — note mean ms (min–max) and mean memory.
6. Compare method-named builtins too: **Opposite-seed gain fill**, **Jacobi diffusion**, **BFS-inertial median**, **Metropolis pair-swap**, and **Multi-start constructive + FM** vs KL/FM/spectral on the same instance.
7. Scoreboard uses a **composite rank**: terminal violations → balance ≤ 0.25 → edge cut → critical-net cut → HPWL proxy → seed σ → runtime.
8. Use the **Hard suite** preset (noisy / preferential / perturbed grid / terminals / critical nets / dense) so solvers can separate.
9. Read the wide metrics table; parallel/energy show **N/A** in-browser.

### Upload contract

```js
export function partition(graph, opts = {}) {
  // graph.nodes, graph.edges[{u,v,w}], graph.sizes
  // return { assignment: { [node]: "0"|"1"|… }, detail?: string }
  return { assignment: { /* … */ }, detail: "my algo" };
}
```

## Optional external compare

1. Export `common/tiny_graph.json` or `common/medium_graph.json`.
2. Run your toy partitioner; record cutsize, balance, wall time, RSS if available.
3. If available, run KaHyPar / Metis-style on the same instance.
4. Fill a comparison table: quality, balance, runtime, memory, notes.
5. If the external tool is missing, document install blockers and still validate I/O.
