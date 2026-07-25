from pathlib import Path
import subprocess
import sys

root = Path("/mnt/d/proj/designs/eda_learning")
subprocess.check_call(
    [sys.executable, str(root / ".cursor/skills/module-slides/scripts/verify_course_readme.py"),
     "courses/learn_compaction", "--modules"],
    cwd=root,
)
subprocess.check_call([sys.executable, str(root / "courses/learn_compaction/scripts/generate_tools.py")], cwd=root)
for f in (root / "courses/learn_compaction/scripts").glob("*.sh"):
    f.write_bytes(f.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
    print("lf", f.name)
print("prep_ok")
