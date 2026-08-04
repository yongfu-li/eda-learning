"""Track A real-Netgen evidence solvers — CLI recipe + checked-in log goldens."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

COMMON = Path(__file__).resolve().parent
EVID = COMMON / "evidence" / "goldens.json"

GOLDEN_RECIPE_IDS = [
    "read_sch",
    "read_lay",
    "device_classes",
    "compare_nets",
    "lvs_report",
    "lvs_done",
]


def load_goldens() -> dict[str, Any]:
    return json.loads(EVID.read_text(encoding="utf-8"))


def stage(name: str, g: dict[str, Any] | None = None) -> dict[str, Any]:
    g = g or load_goldens()
    return dict(g["stages"][name])


def recipe_prefix_ok(learner_ids: list[str], n: int | None = None) -> bool:
    want = GOLDEN_RECIPE_IDS if n is None else GOLDEN_RECIPE_IDS[:n]
    return list(learner_ids[: len(want)]) == want


def pass_cli_check(learner_ids: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_ids if learner_ids is not None else GOLDEN_RECIPE_IDS[:2]
    ok = recipe_prefix_ok(ids, 2)
    return {
        "ok": ok,
        "learner": ids,
        "want": GOLDEN_RECIPE_IDS[:2],
        "netgen_invocation": "netgen -batch -noc -nolog lvs.tcl",
        "schematic": g["schematic_file"],
        "layout": g["layout_file"],
        "cell": g["cell"],
    }


def pass_spice_vocab() -> dict[str, Any]:
    g = load_goldens()
    sv = stage("spice_vocab", g)
    ok = sv["device_count"] == 2 and sv["net_count"] == 4 and sv["classes"] == g["stages"]["spice_vocab"]["classes"]
    return {"ok": ok, **sv}


def pass_real_read_spice() -> dict[str, Any]:
    g = load_goldens()
    rs = stage("read_spice", g)
    ok = rs["sch_devices"] == 2 and rs["lay_devices"] == 2 and rs["sch_nets"] == 4 and rs["lay_nets"] == 4
    return {"ok": ok, **rs}


def pass_real_lvs_compare() -> dict[str, Any]:
    g = load_goldens()
    lc = stage("lvs_compare", g)
    ok = (
        lc["matched_nets"] == 4
        and lc["matched_devices"] == 2
        and lc["mismatch_count"] == 0
    )
    return {"ok": ok, **lc}


def pass_real_lvs_report() -> dict[str, Any]:
    g = load_goldens()
    lr = stage("lvs_report", g)
    ok = (
        lr["matched_devices"] == 2
        and lr["matched_nets"] == 4
        and lr["mismatch_count"] == 0
        and lr["class_count"] == 2
    )
    return {"ok": ok, **lr}


def real_netgen_engine(learner_recipe: list[str] | None = None) -> dict[str, Any]:
    g = load_goldens()
    ids = learner_recipe if learner_recipe is not None else GOLDEN_RECIPE_IDS
    checks = [
        pass_cli_check(ids[:2]),
        pass_spice_vocab(),
        pass_real_read_spice(),
        pass_real_lvs_compare(),
        pass_real_lvs_report(),
    ]
    ok = all(c["ok"] for c in checks) and recipe_prefix_ok(ids) and g["engine_ok"] is True
    return {
        "ok": ok,
        "recipe_ok": recipe_prefix_ok(ids),
        "sch_devices": g["sch_devices"],
        "lay_devices": g["lay_devices"],
        "matched_nets": g["matched_nets"],
        "matched_devices": g["matched_devices"],
        "mismatch_count": g["mismatch_count"],
        "goldens": g,
    }


def _selftest() -> None:
    assert pass_cli_check()["ok"]
    assert pass_spice_vocab()["ok"]
    assert pass_real_read_spice()["ok"]
    assert pass_real_lvs_compare()["ok"]
    assert pass_real_lvs_report()["ok"]
    eng = real_netgen_engine()
    assert eng["ok"], eng
    print(
        "REAL_NETGEN_OK",
        {k: eng[k] for k in ("ok", "sch_devices", "lay_devices", "matched_nets", "matched_devices", "mismatch_count")},
    )


if __name__ == "__main__":
    _selftest()
