"""Equivalence instance helpers (Track A)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping, Optional, Sequence, Tuple

OPS = frozenset({"AND", "OR", "NOT", "XOR", "BUF"})


def load(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def get_combo(data: Mapping[str, Any], key: str) -> dict[str, Any]:
    return dict(data["combinational"][key])


def get_sequential(data: Mapping[str, Any], key: str) -> dict[str, Any]:
    return dict(data["sequential"][key])


def gate_map(circuit: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    return {g["id"]: dict(g) for g in circuit.get("gates", [])}


def output_gate(circuit: Mapping[str, Any]) -> dict[str, Any]:
    for g in circuit.get("gates", []):
        if g.get("output"):
            return dict(g)
    raise ValueError("circuit has no output gate")


def topo_order(circuit: Mapping[str, Any]) -> List[str]:
    """Topological order of gate ids (PIs excluded)."""
    gates = gate_map(circuit)
    pis = set(circuit.get("pis", []))
    state = set(circuit.get("state", []))
    known = pis | state
    order: List[str] = []
    pending = set(gates)
    while pending:
        progressed = False
        for gid in list(pending):
            ins = gates[gid]["inputs"]
            if all(i in known for i in ins):
                order.append(gid)
                known.add(gid)
                pending.remove(gid)
                progressed = True
        if not progressed:
            raise ValueError(f"cycle or missing inputs in circuit: {pending}")
    return order


def eval_op(op: str, vals: Sequence[int]) -> int:
    op = op.upper()
    if op == "AND":
        return 1 if all(v == 1 for v in vals) else 0
    if op == "OR":
        return 1 if any(v == 1 for v in vals) else 0
    if op == "NOT":
        return 0 if vals[0] == 1 else 1
    if op == "XOR":
        return sum(vals) % 2
    if op == "BUF":
        return int(vals[0])
    raise ValueError(f"unknown op {op}")


def resolve_value(name: str, values: Mapping[str, int]) -> int:
    if name not in values:
        raise KeyError(f"unknown signal {name}")
    v = values[name]
    if v == -1:
        raise ValueError(f"signal {name} is X (unknown)")
    return int(v)


def evaluate_circuit(
    circuit: Mapping[str, Any],
    assignment: Mapping[str, int],
) -> int:
    """
    Evaluate primary output (first PO) for a combinational or one-cycle combo cloud.
    assignment maps PI names and optional state regs to 0/1; X = -1 is rejected.
    """
    vals: dict[str, int] = {k: int(v) for k, v in assignment.items()}
    for pi in circuit.get("pis", []):
        vals.setdefault(pi, 0)
    for st in circuit.get("state", []):
        vals.setdefault(st, 0)
    for gid in topo_order(circuit):
        g = gate_map(circuit)[gid]
        ins = [resolve_value(i, vals) for i in g["inputs"]]
        vals[gid] = eval_op(g["op"], ins)
    out_g = output_gate(circuit)
    return resolve_value(out_g["id"], vals)


def all_assignments(pis: Sequence[str]) -> List[dict[str, int]]:
    n = len(pis)
    rows: List[dict[str, int]] = []
    for mask in range(1 << n):
        row = {pis[i]: (mask >> i) & 1 for i in range(n)}
        rows.append(row)
    return rows


def truth_table(circuit: Mapping[str, Any]) -> List[dict[str, Any]]:
    pis = list(circuit["pis"])
    rows = []
    for asn in all_assignments(pis):
        rows.append({**asn, "out": evaluate_circuit(circuit, asn)})
    return rows


def format_assignment(asn: Mapping[str, int]) -> str:
    parts = [f"{k}={v}" for k, v in sorted(asn.items()) if k in "abc" or len(asn) <= 4]
    return ", ".join(parts)
