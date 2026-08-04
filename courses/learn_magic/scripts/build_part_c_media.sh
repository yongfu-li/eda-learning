#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_magic/module09-01-paint-connectivity
bash "$NAR" courses/learn_magic/module09-03-drc-region-algo
bash "$NAR" courses/learn_magic/module10-01-extract-algo
bash "$NAR" courses/learn_magic/module10-03-magic-algo-engine
bash "$NAR" courses/learn_magic/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_magic
echo MEDIA_MAGIC_PARTC_OK
