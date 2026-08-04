# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/equivalence/index.html`](../../../platform/benchmarks/equivalence/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **fail vs gold first**, then counterexample match, then runtime.
3. Confirm **truth_table** / **miter_eval** / **sat_miter** / **portfolio** match gold on course pairs; **identity** fails on `course_bad`.
4. **Example** → Truth-table CEC → **Load example** → **Register solver**.

## Upload contract

```js
export function check(spec, impl, opts = {}) {
  // opts.dontCare, opts.steps (sequential)
  // spec/impl: { pis, gates, state?, ffs?, init? }
  return {
    equivalent: /* boolean */,
    counterexample: /* PI → 0|1 or null */,
    rowsChecked: /* number */,
    detail: "my-cec",
  };
}
```

Also accepted: `export function cec(...)` or `export default ...`.

## Built-in engines

| Id | Idea |
|----|------|
| `identity` | Always ≡ (weak baseline) |
| `truth_table` / `miter_eval` / `gray_walk` | Exact combo CEC |
| `structural` / `fraig` | Hash / FRAIG-lite (+ TT) |
| `sat_miter` | Tseitin CNF + DPLL on miter |
| `random_sim` / `guided_cex` | Incomplete / hint-guided |
| `dont_care` / `sequential` | Masked CEC / SEC unroll |
| `multistart` / `portfolio` | Best across engines |

## Offline JSON (optional)

Load `../common/tiny_equiv.json` and compare `combo_pair_report` metrics offline if working outside the platform scoreboard.
