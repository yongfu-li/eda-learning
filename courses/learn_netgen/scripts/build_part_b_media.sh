#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module06-01-netgen-cli module06-03-spice-vocab module07-01-real-read-spice module07-03-real-lvs-compare module08-01-real-lvs-report module08-03-netgen-evidence; do
  bash "$NAR" "courses/learn_netgen/$m"
done
python3 platform/scripts/publish_course_platform.py learn_netgen
echo MEDIA_NETGEN_PARTB_OK
