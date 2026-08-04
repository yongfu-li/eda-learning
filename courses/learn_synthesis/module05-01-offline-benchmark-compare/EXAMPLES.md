# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/synthesis/index.html`](../../../platform/benchmarks/synthesis/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **illegal first** (unmapped / functional fail), then area, then delay.
3. Confirm **area_map** / **portfolio** beat **identity**; course area is in the GOLDENS.mapAreaMin ballpark.
4. **Example** → Techmap area → **Load example** → **Register solver**.

## Upload contract

```js
export function synthesize(nodes, opts = {}) {
  // opts.library, opts.cutK
  // nodes: AIG [{ id, type: "pi"|"and", name?, fanin?, po? }]
  return {
    nodes, // optional rewritten AIG
    mapping: /* [{ node, cell, area }] */,
    area: /* number */,
    delay: /* number */,
    detail: "my-techmap",
  };
}
```

Also accepted: `export function map(...)` or `export default ...`.

## Built-in engines

| Id | Idea |
|----|------|
| `identity` | Unmapped baseline (illegal) |
| `area_map` / `delay_map` | Course techmap area / delay |
| `nand_map` / `nor_aware` / `aoi_cover` | Library-style covers |
| `cut_cover` / `rewrite_map` / `strash_map` | Cuts / rewrite / hash-aware |
| `delay_first` / `area_pareto` | Objective picks |
| `sequential` / `multistart` / `portfolio` | Pipe / best-of |

## Offline JSON (optional)

Load `tiny_synth.json` and compare area vs delay reports offline if working outside the platform scoreboard.
