from pathlib import Path
import re
import subprocess

root = Path("/mnt/d/proj/designs/eda_learning")
course = root / "courses/learn_compaction"
skill = root / ".cursor/skills/module-slides/scripts"

# dup titles check
for tr in sorted(course.glob("module*/transcript.md")):
    titles = re.findall(r"^## Slide \d+ — (.+)$", tr.read_text(encoding="utf-8"), re.M)
    seen = {}
    for t in titles:
        k = t.strip().lower()
        seen[k] = seen.get(k, 0) + 1
    dups = [t for t, c in seen.items() if c > 1]
    print(tr.parent.name, "DUPS" if dups else "ok", dups or "")
    if dups:
        raise SystemExit(f"duplicate slide titles in {tr}")

scripts = course / "scripts"
for f in scripts.glob("*.sh"):
    f.write_bytes(f.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))

remaining = [
    course / "module05-01-offline-benchmark-compare",
    course / "module99-00-wrap",
]
print("starting media build for remaining modules...")
subprocess.check_call(
    ["bash", str(skill / "narrate_clips.sh"), *[str(m) for m in remaining]],
    cwd=root,
)
print("MEDIA_OK")
