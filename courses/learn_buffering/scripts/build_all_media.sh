#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COURSE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT="$(cd "${COURSE_DIR}/../.." && pwd)"
SKILL="${ROOT}/.cursor/skills/module-slides/scripts"
source "${SKILL}/_require_unix.sh"
cd "$ROOT"
bash "${SKILL}/narrate_clips.sh" --course-dir "$COURSE_DIR"
python3 "${ROOT}/platform/scripts/publish_course_platform.py" learn_buffering
echo Done: "$COURSE_DIR"
