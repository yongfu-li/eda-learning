/** Walkthrough packs for learn_drc (kind: drc). */
import { STARTER, GOLDENS, cloneDesign, drawDrc } from "../../assets/drc-core.js";

void drawDrc;

function step(id, title, caption, bullets, metrics, extra = {}) {
  return {
    id,
    title,
    caption,
    bullets,
    metrics,
    design: cloneDesign(STARTER),
    ...extra,
  };
}

export const DRC_ALGOS = {
  "rule-deck": {
    kind: "drc",
    title: "Rule deck load",
    module: "module01-01-rule-deck",
    steps: [
      step("deck", "Deck", "Eight rules in the tiny_drc deck.", ["deck"], [`r=${GOLDENS.ruleCount}`], {
        mode: "deck",
        highlight: ["W.M1", "W.M2", "W.VIA", "S.M1", "S.M2", "E.VIA_M1", "E.VIA_M2", "B.VIA_M1_not_M2"],
        metricText: "rules=8",
      }),
      step("types", "Types", "width, space, enclosure, boolean rule types.", ["types"], ["4"], {
        mode: "deck",
        highlight: ["W.M1", "S.M1", "E.VIA_M1", "B.VIA_M1_not_M2"],
        metricText: "width/space/enc/bool",
      }),
      step("layers", "Layers", "Rules reference M1, M2, and VIA layers.", ["layers"], [`L=${GOLDENS.layerCount}`], {
        mode: "deck",
        highlight: ["W.M1", "W.M2", "W.VIA", "E.VIA_M2"],
        metricText: "M1/M2/VIA",
      }),
      step("load", "Load", "load_deck returns rules and by_type buckets.", ["load"], ["by_type"], {
        mode: "deck",
        highlight: ["W.M1", "S.M1", "E.VIA_M1"],
        metricText: "load_deck()",
      }),
      step("count", "Count", "GOLDEN: rule_count=8.", ["GOLDEN"], ["8"], {
        mode: "deck",
        highlight: ["W.M1", "S.M1", "E.VIA_M2", "B.VIA_M1_not_M2"],
        metricText: "rule_count=8",
      }),
    ],
  },
  "width-checker": {
    kind: "drc",
    title: "Width checker",
    module: "module01-03-width-checker",
    steps: [
      step("rule", "Rule", "W.M1 width limit 3 on M1 layer.", ["W.M1"], ["limit=3"], {
        mode: "deck",
        highlight: ["W.M1"],
        metricText: "W.M1 limit=3",
      }),
      step("scan", "Scan", "Walk M1 shapes A, B, and D.", ["M1"], ["A/B/D"], {
        highlight: ["A", "B", "D"],
        metricText: "M1 shapes",
      }),
      step("measure", "Measure", "Compare min(width,height) to limit.", ["min"], ["w/h"], {
        highlight: ["A", "B", "D"],
        metricText: "min(w,h)",
      }),
      step("hit", "Hit", "Shape D is too narrow — width=1.", ["D"], ["1"], {
        highlight: ["D"],
        selectedShape: "D",
        metricText: "D width=1",
      }),
      step("golden", "Golden", "GOLDEN: width viol=1, rule W.M1.", ["GOLDEN"], ["1"], {
        highlight: ["D"],
        markers: [{ rule_id: "W.M1", type: "width", shapes: ["D"] }],
        metricText: "width=1 W.M1",
      }),
    ],
  },
  "spacing-checker": {
    kind: "drc",
    title: "Spacing checker",
    module: "module01-05-spacing-checker",
    steps: [
      step("rule", "Rule", "S.M1 spacing limit 2 on M1.", ["S.M1"], ["limit=2"], {
        mode: "deck",
        highlight: ["S.M1"],
        metricText: "S.M1 limit=2",
      }),
      step("pairs", "Pairs", "Compare M1 pairs with y-projection overlap.", ["pairs"], ["A–B"], {
        highlight: ["A", "B"],
        metricText: "y overlap",
      }),
      step("gap", "Gap", "horiz_gap A–B equals 1, below limit 2.", ["gap"], ["1"], {
        highlight: ["A", "B"],
        metricText: "gap=1",
      }),
      step("hit", "Hit", "Shapes A and B violate S.M1.", ["A", "B"], ["viol"], {
        highlight: ["A", "B"],
        metricText: "A–B hit",
      }),
      step("golden", "Golden", "GOLDEN: space=1 A–B, rule S.M1.", ["GOLDEN"], ["1"], {
        highlight: ["A", "B"],
        markers: [{ rule_id: "S.M1", type: "space", shapes: ["A", "B"] }],
        metricText: "space=1 S.M1",
      }),
    ],
  },
  "enclosure-checker": {
    kind: "drc",
    title: "Enclosure checker",
    module: "module02-01-enclosure-checker",
    steps: [
      step("rule", "Rule", "E.VIA_M2: VIA inside M2 by limit 1.", ["E.VIA_M2"], ["limit=1"], {
        mode: "deck",
        highlight: ["E.VIA_M2"],
        metricText: "E.VIA_M2",
      }),
      step("via", "VIA", "Inner shape V on VIA layer.", ["VIA"], ["V"], {
        highlight: ["V"],
        selectedShape: "V",
        metricText: "inner V",
      }),
      step("m2", "M2", "Outer M2 shape C should enclose V.", ["M2"], ["C"], {
        highlight: ["C", "V"],
        metricText: "outer M2",
      }),
      step("margin", "Margin", "V is not enclosed by M2 — violation.", ["margin"], ["fail"], {
        highlight: ["V", "C"],
        metricText: "not enclosed",
      }),
      step("golden", "Golden", "GOLDEN: enc=1 V vs M2, E.VIA_M2.", ["GOLDEN"], ["1"], {
        highlight: ["V"],
        markers: [{ rule_id: "E.VIA_M2", type: "enclosure", shapes: ["V"], inner: "V" }],
        metricText: "enc=1 E.VIA_M2",
      }),
    ],
  },
  "violation-markers": {
    kind: "drc",
    title: "DRC violations",
    module: "module02-03-violation-markers",
    steps: [
      step("width", "Width m", "Width violation marker on D (W.M1).", ["width"], ["D"], {
        highlight: ["D"],
        markers: [{ rule_id: "W.M1", type: "width", shapes: ["D"] }],
        metricText: "W.M1 D",
      }),
      step("space", "Space m", "Spacing marker on shapes A and B (S.M1).", ["space"], ["A–B"], {
        highlight: ["A", "B"],
        markers: [{ rule_id: "S.M1", type: "space", shapes: ["A", "B"] }],
        metricText: "S.M1 A–B",
      }),
      step("enc", "Enc m", "Enclosure marker on V (E.VIA_M2).", ["enc"], ["V"], {
        highlight: ["V"],
        markers: [{ rule_id: "E.VIA_M2", type: "enclosure", shapes: ["V"] }],
        metricText: "E.VIA_M2 V",
      }),
      step("rule", "Rule id", "Each violation carries a rule_id field.", ["rule_id"], ["3"], {
        highlight: ["D", "A", "B", "V"],
        metricText: "rule_id on each",
      }),
      step("golden", "Golden", "GOLDEN: violation_count=3 with rule_id.", ["GOLDEN"], ["3"], {
        highlight: ["D", "A", "B", "V"],
        metricText: "violations=3",
      }),
    ],
  },
  "multi-layer-deck": {
    kind: "drc",
    title: "Multi-layer rule deck",
    module: "module03-01-multi-layer-deck",
    steps: [
      step("cross", "Cross", "Deck rules span M1, M2, and VIA.", ["layers"], ["M1/M2/VIA"], {
        mode: "deck",
        highlight: ["W.M1", "W.M2", "W.VIA", "E.VIA_M2"],
        metricText: "cross-layer",
      }),
      step("enc", "Enc rules", "Two enclosure rules: E.VIA_M1 and E.VIA_M2.", ["enc"], ["2"], {
        mode: "deck",
        highlight: ["E.VIA_M1", "E.VIA_M2"],
        metricText: "enc_rules=2",
      }),
      step("bool", "Boolean", "B.VIA_M1_not_M2 boolean rule on VIA.", ["boolean"], ["1"], {
        mode: "deck",
        highlight: ["B.VIA_M1_not_M2"],
        metricText: "boolean rule",
      }),
      step("fire", "Fire", "E.VIA_M2 fires — V not enclosed by M2.", ["fire"], ["V"], {
        highlight: ["V", "E.VIA_M2"],
        markers: [{ rule_id: "E.VIA_M2", type: "enclosure", shapes: ["V"] }],
        metricText: "E.VIA_M2 fires",
      }),
      step("golden", "Golden", "GOLDEN: 2 enclosure rules; fires E.VIA_M2.", ["GOLDEN"], ["2"], {
        mode: "deck",
        highlight: ["E.VIA_M1", "E.VIA_M2"],
        metricText: "2 enc; E.VIA_M2",
      }),
    ],
  },
  "deck-boolean": {
    kind: "drc",
    title: "Deck boolean rules",
    module: "module03-03-deck-boolean",
    steps: [
      step("rule", "Rule", "and_not: VIA in M1 must_not overlap M2.", ["and_not"], ["deck"], {
        mode: "deck",
        highlight: ["B.VIA_M1_not_M2"],
        metricText: "and_not",
      }),
      step("via", "VIA", "Inner shape V on VIA layer.", ["VIA"], ["V"], {
        highlight: ["V"],
        selectedShape: "V",
        metricText: "inner V",
      }),
      step("m1", "M1", "V overlaps M1 shape A.", ["M1"], ["A"], {
        highlight: ["V", "A"],
        metricText: "V∩A",
      }),
      step("m2", "M2", "V does not overlap M2 shape C.", ["M2"], ["¬C"], {
        highlight: ["V", "C"],
        metricText: "V∩C=false",
      }),
      step("golden", "Golden", "GOLDEN: boolean hit=1 on V.", ["GOLDEN"], ["1"], {
        highlight: ["V"],
        markers: [{ rule_id: "B.VIA_M1_not_M2", type: "boolean", shapes: ["V"] }],
        metricText: "boolean hit V",
      }),
    ],
  },
  "drc-engine": {
    kind: "drc",
    title: "DRC engine",
    module: "module04-01-drc-engine",
    steps: [
      step("deck", "Deck", "Load deck rule_count=8.", ["deck"], [`r=${GOLDENS.ruleCount}`], {
        mode: "deck",
        highlight: ["W.M1", "S.M1", "E.VIA_M2"],
        metricText: "rules=8",
      }),
      step("checks", "Checks", "Run width, space, and enclosure checkers.", ["checks"], ["3"], {
        highlight: ["D", "A", "B", "V"],
        metricText: "width/space/enc",
      }),
      step("viol", "Viol", "Collect geometry violations count=3.", ["viol"], ["3"], {
        highlight: ["D", "A", "B", "V"],
        metricText: "violations=3",
      }),
      step("bool", "Bool", "Boolean hit=1 on V (separate from viol count).", ["boolean"], ["1"], {
        highlight: ["V"],
        metricText: "boolean=1",
      }),
      step("ok", "OK", "GOLDEN: ok=True viol=3.", ["GOLDEN"], ["ok"], {
        highlight: ["D", "A", "B", "V"],
        metricText: "ok=true viol=3",
      }),
    ],
  },
};
