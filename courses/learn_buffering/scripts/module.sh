#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
KEY="${1:-}"
shift || true
[[ -z "$KEY" || "$KEY" == "--help" ]] && { echo "Usage: $0 SS-AA [--check]"; exit 0; }
MOD_DIR="$(find "$ROOT" -maxdepth 1 -type d -name "module${KEY}-*" | head -1)"
[[ -z "$MOD_DIR" ]] && { echo "No module"; exit 1; }
echo "Module $KEY self-check"
python3 -c "import sys; sys.path.insert(0,'$ROOT/common'); from solvers import sequential_buffer; from bufutil import load; print(sequential_buffer(load('$ROOT/common/tiny_buf.json'))['van_ginneken']['best_delay'])"
