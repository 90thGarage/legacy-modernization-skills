#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repo_parent="$(dirname "$repo_root")"
repo_name="$(basename "$repo_root")"
marketplace_dir="$repo_parent/.agents/plugins"
marketplace_file="$marketplace_dir/marketplace.json"

mkdir -p "$marketplace_dir"

MARKETPLACE_FILE="$marketplace_file" REPO_NAME="$repo_name" python3 - <<'PY'
import json
import os
from pathlib import Path

marketplace_file = Path(os.environ["MARKETPLACE_FILE"])
repo_name = os.environ["REPO_NAME"]

if marketplace_file.exists():
    data = json.loads(marketplace_file.read_text())
else:
    data = {
        "name": "legacy-modernization-local",
        "interface": {"displayName": "Legacy Modernization Local"},
        "plugins": [],
    }

data["name"] = data.get("name") or "legacy-modernization-local"
data.setdefault("interface", {}).setdefault("displayName", "Legacy Modernization Local")
plugins = data.setdefault("plugins", [])

entry = {
    "name": "90thskills",
    "source": {
        "source": "local",
        "path": f"./{repo_name}",
    },
    "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL",
    },
    "category": "Developer Tools",
}

for index, plugin in enumerate(plugins):
    if plugin.get("name") in {"90thskills", "legacy-modernization-skills"}:
        plugins[index] = entry
        break
else:
    plugins.append(entry)

marketplace_file.write_text(json.dumps(data, indent=2) + "\n")
print(marketplace_file)
PY

codex plugin marketplace add "$repo_parent"
codex plugin add 90thskills@legacy-modernization-local

cat <<EOF

Installed 90thskills.

Restart Codex or open a new thread before using:
  /producto
  /product-modernizer
  /planner
  /builder
  /reviewer
EOF
