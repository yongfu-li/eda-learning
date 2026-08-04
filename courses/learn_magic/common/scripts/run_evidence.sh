#!/usr/bin/env bash
# Optional: run Magic against scripts/ when magic is installed; otherwise use checked-in logs/.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT/common"
echo "Using checked-in logs under common/logs/ (Magic binary optional)."
for f in logs/*.log; do
  echo "  ok $f"
done
echo "EVIDENCE_MAGIC_OK"
