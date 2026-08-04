#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module09-01-hash-devices-algo module09-03-match-nets-algo module10-01-permute-pins-algo module10-03-netgen-algo-engine; do
  bash "$NAR" "courses/learn_netgen/$m"
done
python3 platform/scripts/publish_course_platform.py learn_netgen
echo MEDIA_NETGEN_PARTC_OK
