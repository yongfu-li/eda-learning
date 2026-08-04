#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_netgen/module00-00-intro
bash "$NAR" courses/learn_netgen/module01-01-read-netlists-map
bash "$NAR" courses/learn_netgen/module01-03-device-classes-map
bash "$NAR" courses/learn_netgen/module02-01-flatten-permute-map
bash "$NAR" courses/learn_netgen/module02-03-compare-nets-map
bash "$NAR" courses/learn_netgen/module03-01-lvs-report-map
bash "$NAR" courses/learn_netgen/module03-03-netgen-engine
bash "$NAR" courses/learn_netgen/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_netgen
echo MEDIA_NETGEN_PARTA_OK
