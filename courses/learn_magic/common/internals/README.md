# Part D — Magic internals excerpts

Teaching orientation for the upstream Magic tree. These are **annotated sketches**
aligned with public Magic layout (`tiles/`, `planes/`, `cells/`, `drc/`, `commands/`),
not a vendored copy of the Magic source.

## Tree map

```
Magic/
  tiles/       # Tile, Rect, painted geometry
  planes/      # Layer planes, DRC, extract hooks
  cells/       # CellDef, hierarchy, ports
  drc/         # DRC rule scan (Part B thin metal1)
  commands/    # Tcl command registration
  cif/         # cifwrite / streamout helpers
```

## Upstream pointers

- Tile model: `tiles/`
- Layer planes: `planes/`
- Cell definitions: `cells/`
- DRC engine: `drc/DRCcheck.c`
- Tcl commands: `commands/`

Clone upstream when contributing: http://opencircuitdesign.com/magic/
