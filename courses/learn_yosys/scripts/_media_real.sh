#!/usr/bin/env bash
set -euo pipefail
ROOT=/mnt/d/proj/designs/eda_learning
cd "$ROOT"
sed -i 's/\r$//' .cursor/skills/module-slides/scripts/*.sh courses/learn_yosys/scripts/*.sh
NAR="$ROOT/.cursor/skills/module-slides/scripts/narrate_clips.sh"

mods=(
  module00-00-intro
  module06-01-yosys-cli
  module06-03-rtlil-vocab
  module07-01-real-proc
  module07-03-real-flatten-opt
  module08-01-aigmap-synth
  module08-03-real-evidence
  module05-03-offline-benchmark-compare
  module99-00-wrap
)

for m in "${mods[@]}"; do
  echo "=== media $m ==="
  bash "$NAR" "courses/learn_yosys/$m"
done

python3 platform/scripts/publish_course_platform.py learn_yosys
echo MEDIA_REAL_OK
