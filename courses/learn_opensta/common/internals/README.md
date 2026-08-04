# Part D — OpenSTA internals excerpts

Teaching orientation for the upstream OpenSTA tree. These are **annotated sketches**
aligned with public OpenSTA layout (`network/`, `graph/`, `sdc/`, `search/`, `app/`),
not a vendored copy of the OpenSTA source.

## Tree map

```
OpenSTA/
  network/     # Network, Pin, Net, Instance
  graph/       # Graph, Vertex, Edge (timing)
  sdc/         # Sdc, clocks, constraints
  search/      # Search, FindPath, arrivals / required
  app/         # Tcl command registration (StaMain)
  liberty/     # Liberty reader (Part B vocabulary)
```

## Upstream pointers

- Network model: `network/`
- Timing graph: `graph/`
- Constraints: `sdc/`
- Path search / report: `search/FindPath.cc`, report checks Tcl cmds
- App / Tcl: `app/`

Clone upstream when contributing: https://github.com/The-OpenROAD-Project/OpenSTA
