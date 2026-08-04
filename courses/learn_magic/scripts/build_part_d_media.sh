#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_magic/module14-01-tile-plane-model
bash "$NAR" courses/learn_magic/module14-03-read-drc-cifwrite
bash "$NAR" courses/learn_magic/module15-03-contribute-magic
bash "$NAR" courses/learn_magic/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_magic
echo MEDIA_MAGIC_PARTD_OK
