#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_magic/module00-00-intro
bash "$NAR" courses/learn_magic/module01-01-paint-layers
bash "$NAR" courses/learn_magic/module01-03-select-box
bash "$NAR" courses/learn_magic/module02-01-contact-paint
bash "$NAR" courses/learn_magic/module02-03-magic-drc-map
bash "$NAR" courses/learn_magic/module03-01-gds-write-map
bash "$NAR" courses/learn_magic/module03-03-magic-engine
bash "$NAR" courses/learn_magic/module99-00-wrap
python3 platform/scripts/publish_course_platform.py learn_magic
echo MEDIA_MAGIC_PARTA_OK
