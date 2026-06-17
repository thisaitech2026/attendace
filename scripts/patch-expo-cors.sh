#!/usr/bin/env bash
set -euo pipefail

TARGET="node_modules/expo/node_modules/@expo/cli/build/src/start/server/middleware/CorsMiddleware.js"

if [[ ! -f "$TARGET" ]]; then
  echo "CORS patch skipped: $TARGET not found"
  exit 0
fi

if rg -q 'isAllowedDevHost' "$TARGET"; then
  exit 0
fi

python3 - <<'PY'
from pathlib import Path

target = Path("node_modules/expo/node_modules/@expo/cli/build/src/start/server/middleware/CorsMiddleware.js")
text = target.read_text()

helper = """
const isAllowedDevHost = (hostname)=>{
    return hostname.endsWith('.loca.lt') || hostname.endsWith('.agent.cvm.dev') || hostname.endsWith('.ngrok-free.app') || hostname.endsWith('.ngrok.io');
};
function createCorsMiddleware(exp) {
"""

text = text.replace("function createCorsMiddleware(exp) {", helper, 1)
text = text.replace(
    "const isAllowedHost = allowedHosts.includes(host) || isLocalhost;",
    "const isAllowedHost = allowedHosts.includes(host) || isLocalhost || isAllowedDevHost(hostname);",
)
text = text.replace(
    "} else if (!isLocalhost && isAllowedHost) {",
    "} else if (!isLocalhost && (isAllowedHost || isAllowedDevHost(hostname))) {",
)

target.write_text(text)
print("Applied Expo dev-server CORS patch")
PY
