#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
for m in module14-01-netcomp-model module14-03-read-compare-c module15-03-contribute-netgen module99-00-wrap; do
  bash "$NAR" "courses/learn_netgen/$m"
done
python3 platform/scripts/publish_course_platform.py learn_netgen
echo MEDIA_NETGEN_PARTD_OK
