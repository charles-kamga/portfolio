#!/usr/bin/env bash
# Script d'assistance pour le skill portfolio-content-manager
# Exécute l'optimisation des images et vérifie la parité WebP/PNG

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "=== Exécution de l'optimisation WebP ==="
./optimize_images.sh

echo "=== Vérification de la présence des fichiers .webp ==="
missing=0
while IFS= read -r -d '' img; do
  webp_path="${img%.*}.webp"
  if [[ ! -f "$webp_path" ]]; then
    echo "❌ Manquant : $webp_path"
    missing=$((missing + 1))
  fi
done < <(find assets/ -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

if [[ $missing -eq 0 ]]; then
  echo "✅ Toutes les images possèdent leur équivalent WebP !"
  exit 0
else
  echo "⚠️ $missing image(s) sans fichier WebP détectée(s)."
  exit 1
fi
