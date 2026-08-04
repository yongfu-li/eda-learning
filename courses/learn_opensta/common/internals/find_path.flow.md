# FindPath / report_checks — teaching flow

Aligned with Part B goldens on `tiny_combo`: path delay **2.0**, slack **8.0**,
path **b → n1 → n2 → y**.

```text
1. tag_endpoints   # Search knows which pins are report endpoints
2. walk_back       # From worst slack endpoint, follow prev arcs
3. emit_path       # Ordered pin list for the critical path
4. report_checks   # Format startpoint / endpoint / delay / slack (MET)
```

Upstream orientation: `search/` (FindPath / Search) + Tcl `report_checks`.
Not a line-by-line copy of OpenSTA — a reading map for contributors.
