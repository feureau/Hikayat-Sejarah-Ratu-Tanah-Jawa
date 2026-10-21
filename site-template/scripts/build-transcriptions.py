#!/usr/bin/env python3
"""
Regenerate js/transcriptions-content.js from the .txt files listed in
js/transcriptions-data.js.
"""
import json, re
from pathlib import Path

BASE    = Path(__file__).parent.parent
DATA_JS = BASE / "js" / "transcriptions-data.js"
OUT     = BASE / "js" / "transcriptions-content.js"

src = DATA_JS.read_text(encoding="utf-8")

PATTERN = re.compile(
    r'\{\s*"id"\s*:\s*"([^"]+)"\s*,\s*"image"\s*:\s*"([^"]+)"\s*,\s*"text"\s*:\s*"([^"]+)"\s*\}'
)
entries = PATTERN.findall(src)
if not entries:
    raise SystemExit("No entries found in transcriptions-data.js.")

content = {}
missing = []
for entry_id, image, text_path in entries:
    p = BASE / text_path
    if p.exists():
        content[entry_id] = p.read_text(encoding="utf-8")
    else:
        missing.append(text_path)

payload = json.dumps(content, ensure_ascii=False)
payload = payload.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")

OUT.write_text(
    "/* AUTO-GENERATED from transcriptions — do not edit by hand. */\n"
    "window.__TRANSCRIPTIONS_CONTENT__ = " + payload + ";\n",
    encoding="utf-8",
)

print(f"Successfully generated {OUT.name} ({len(content)} entries).")
if missing:
    print(f"WARNING: {len(missing)} missing file(s):", missing)
