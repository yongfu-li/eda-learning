# Scope

**In:** Sequential circuit graphs, edge register counts w, retiming lag r(v), w_r = w + r(dst) − r(src), forward/backward moves, legal retiming (w_r ≥ 0), clock period as longest zero-weight path delay, FEAS lite, min-period search over candidates, register/area tradeoff.

**Out:** Full Whitney–Daniels (WD) / FEAS linear programs, multi-clock retiming, clock gating, physical placement — see STA and implementation flows.

**Toy instance:** `common/tiny_retime.json` — target period 5, baseline period 8, baseline registers 2.
