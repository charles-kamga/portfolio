#!/usr/bin/env bash
# optimize_images.sh – Convert PNG/JPG images to WebP (idempotent).
# Requirements: cwebp (from libwebp-tools).
#
# This script ONLY converts images to WebP. It does NOT modify HTML files,
# because the HTML already uses <picture> tags with WebP sources.
# Re-running the script is safe: existing .webp files are skipped.

set -euo pipefail

# Configuration
QUALITY=80   # WebP quality (0‑100)

# Directories to scan for images
IMAGE_DIRS=("assets/images" "assets/projects")

convert_image() {
  local src="$1"
  local dest="${src%.*}.webp"
  if [[ -f "$dest" ]]; then
    echo "  ✓ Already exists: $dest"
    return
  fi
  echo "  → Converting $src → $dest"
  cwebp -q "$QUALITY" "$src" -o "$dest" -quiet
}

echo "=== Image Optimization ==="
echo ""

count=0
skipped=0

for dir in "${IMAGE_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then
    echo "⚠ Directory not found: $dir (skipping)"
    continue
  fi
  echo "Scanning $dir/ ..."
  while IFS= read -r -d '' img; do
    case "${img,,}" in
      *.png|*.jpg|*.jpeg)
        if [[ -f "${img%.*}.webp" ]]; then
          ((skipped++))
        else
          convert_image "$img"
          ((count++))
        fi
        ;;
    esac
  done < <(find "$dir" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
done

echo ""
echo "=== Done ==="
echo "  Converted: $count"
echo "  Skipped (already exist): $skipped"
