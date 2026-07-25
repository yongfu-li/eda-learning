#!/usr/bin/env bash
set -euo pipefail
cd /mnt/d/proj/designs/eda_learning
python3 - <<'PY'
from pathlib import Path
p = Path("courses/learn_compaction/scripts")
for f in p.glob("*.sh"):
    f.write_bytes(f.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
    print("lf", f.name)
PY
bash courses/learn_compaction/scripts/capture_lab_snaps.sh
echo SNAPS_DONE
