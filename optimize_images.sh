#!/usr/bin/env bash
# optimize_images.sh – Convert PNG/JPG images to WebP and update HTML to use <picture> with lazy loading.
# Requirements: cwebp (installed), perl (for in‑place HTML modification).

set -euo pipefail

# Configuration
QUALITY=80   # WebP quality (0‑100)
KEEP_ORIGINALS=true   # Keep original PNG/JPG files (set false to delete after conversion)

# Directories to scan for images
IMAGE_DIRS=("assets/images" "assets/projects")

convert_image() {
  local src="$1"
  local dest="${src%.*}.webp"
  if [[ -f "$dest" ]]; then
    echo "WebP already exists: $dest"
    return
  fi
  echo "Converting $src → $dest"
  cwebp -q "$QUALITY" "$src" -o "$dest"
  if [[ "$KEEP_ORIGINALS" = false ]]; then
    rm -f "$src"
  fi
}

# Find and convert images
for dir in "${IMAGE_DIRS[@]}"; do
  while IFS= read -r -d '' img; do
    case "${img,,}" in
      *.png|*.jpg|*.jpeg) convert_image "$img" ;;
    esac
  done < <(find "$dir" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
done

# Update HTML files to use <picture> with WebP fallback and lazy loading.
# This perl one‑liner replaces <img src="path.ext" ...> with the appropriate block.
# It preserves existing alt, class, id, etc., and adds loading="lazy".

while IFS= read -r -d '' html; do
  perl -0777 -i -pe '
    s{<img\s+([^>]*?)src="([^"]+?)\.(png|jpe?g)"([^>]*?)>}{
      my $attrs = $1 . $4;
      my $src = $2;
      my $ext = $3;
      my $alt = $attrs =~ /alt="([^"]*)"/ ? $1 : "";
      my $rest = $attrs =~ s/\s*alt="[^"]*"//r; # remove existing alt from attrs
      "<picture>\n    <source srcset=\"${src}.webp\" type=\"image/webp\">\n    <img src=\"${src}.${ext}\" loading=\"lazy\" alt=\"$alt\"$rest>\n</picture>"
    }geis;
  ' "$html"
  echo "Updated HTML: $html"
done < <(find . -type f -name "*.html" -print0)

echo "Image optimization and HTML update complete."
