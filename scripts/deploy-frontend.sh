#!/usr/bin/env bash
set -euo pipefail

# Deploy frontend to Vercel using VERCEL_TOKEN env var.
# Do NOT hardcode tokens. Export VERCEL_TOKEN in your environment or CI secrets.

if [ -z "${VERCEL_TOKEN-}" ]; then
  echo "VERCEL_TOKEN is not set. Export it and re-run." >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not installed. Installing..."
  npm install -g vercel || true
fi

vercel --prod --token "$VERCEL_TOKEN" --confirm || true
