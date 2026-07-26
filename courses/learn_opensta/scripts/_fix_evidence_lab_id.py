#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[2]

# Patch generate_part_b.py lab id
gen = root / "courses/learn_opensta/scripts/generate_part_b.py"
t = gen.read_text(encoding="utf-8")
t = t.replace('"real-evidence"', '"opensta-evidence"')
t = t.replace("'real-evidence'", "'opensta-evidence'")
t = t.replace("real-evidence", "opensta-evidence")
# restore module folder name
t = t.replace("module08-03-opensta-evidence", "module08-03-real-evidence")
# restore title words if mangled — "Real OpenSTA evidence" should stay
t = t.replace("OpenSTA opensta-evidence", "OpenSTA evidence")
gen.write_text(t, encoding="utf-8", newline="\n")
print("patched", gen)

# Fix LAB_TO_ALGO: keep yosys real-evidence; opensta uses opensta-evidence
cap = root / ".cursor/skills/module-slides/scripts/capture_algorithm_walkthrough.py"
ct = cap.read_text(encoding="utf-8")
# Remove accidental second real-evidence if we added opensta one as real-evidence
lines = ct.splitlines(keepends=True)
out = []
seen_real_evidence = False
for ln in lines:
    if '"real-evidence"' in ln and "opensta" not in ln.lower():
        if seen_real_evidence and "opensta-engine" in "".join(out[-15:]):
            # skip duplicate near opensta block — replace with opensta-evidence
            out.append('    "opensta-evidence": ("opensta-evidence", 5),\n')
            continue
        seen_real_evidence = True
        out.append(ln)
    elif '"real-evidence": ("real-evidence", 5)' in ln and seen_real_evidence:
        out.append('    "opensta-evidence": ("opensta-evidence", 5),\n')
    else:
        out.append(ln)
text = "".join(out)
if '"opensta-evidence"' not in text:
    text = text.replace(
        '    "real-report-checks": ("real-report-checks", 5),\n}',
        '    "real-report-checks": ("real-report-checks", 5),\n'
        '    "opensta-evidence": ("opensta-evidence", 5),\n}',
    )
# Ensure exactly one yosys real-evidence remains
count = text.count('"real-evidence": ("real-evidence", 5)')
print("yosys real-evidence entries", count)
cap.write_text(text, encoding="utf-8", newline="\n")
print("opensta-evidence", text.count('"opensta-evidence"'))

# Fix tools index + capture/media scripts
for rel in [
    "platform/tools/index.html",
    "courses/learn_opensta/scripts/capture_part_b.sh",
    "courses/learn_opensta/scripts/build_part_b_media.sh",
]:
    p = root / rel
    if not p.is_file():
        continue
    s = p.read_text(encoding="utf-8")
    s2 = s.replace("real-evidence", "opensta-evidence")
    # don't break yosys links on tools index if any — opensta section only
    if rel.endswith("index.html"):
        # only replace in opensta section: already done globally is risky for yosys
        # re-read and do careful replace
        s = p.read_text(encoding="utf-8")
        if 'href="real-evidence/">Real OpenSTA evidence' in s or "opensta-evidence" in s:
            s2 = s.replace('href="real-evidence/">Real OpenSTA evidence', 'href="opensta-evidence/">Real OpenSTA evidence')
            s2 = s2.replace("real-evidence/", "opensta-evidence/")  # only if we already have opensta list
        # safer: replace the opensta list item we added
        s2 = s.replace(
            '<li><a href="real-evidence/">Real OpenSTA evidence</a></li>',
            '<li><a href="opensta-evidence/">Real OpenSTA evidence</a></li>',
        )
        if s2 == s:
            s2 = s.replace(
                '<li><a href="opensta-evidence/">Real OpenSTA evidence</a></li>',
                '<li><a href="opensta-evidence/">Real OpenSTA evidence</a></li>',
            )
    p.write_text(s2 if rel.endswith(".sh") else s2, encoding="utf-8", newline="\n")
    print("patched", rel)
