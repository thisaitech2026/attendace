#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/thisaitech2026/Rentalhouse.git"

echo "Pushing Rental House & Shop Management app to ${REPO_URL}..."

if ! git remote get-url origin 2>/dev/null | grep -q "Rentalhouse"; then
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REPO_URL"
fi

git checkout main
git push -u origin main --force

echo "Done. Repository: ${REPO_URL}"
