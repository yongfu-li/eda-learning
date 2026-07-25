from pathlib import Path
import subprocess

root = Path("/mnt/d/proj/designs/eda_learning")
scripts = root / "courses/learn_compaction/scripts"
for f in scripts.glob("*.sh"):
    f.write_bytes(f.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
    print("lf", f.name)

subprocess.check_call(["bash", str(scripts / "capture_lab_snaps.sh")], cwd=root)
print("SNAPS_OK")
