#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"
cd "$ROOT"
bash "$NAR" courses/learn_magic/module06-01-magic-cli
bash "$NAR" courses/learn_magic/module06-03-magic-tech-vocab
bash "$NAR" courses/learn_magic/module07-01-real-paint-save
bash "$NAR" courses/learn_magic/module07-03-real-drc
bash "$NAR" courses/learn_magic/module08-01-real-gds
bash "$NAR" courses/learn_magic/module08-03-magic-evidence
bash "$NAR" courses/learn_magic/module99-00-wrap
# lab id magic-evidence (not Yosys real-evidence / OpenSTA opensta-evidence)
python3 platform/scripts/publish_course_platform.py learn_magic
echo MEDIA_MAGIC_PARTB_OK
