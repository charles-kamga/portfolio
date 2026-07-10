---
name: "rotation-cles-api-par-provider"
description: "Ajoute une nouvelle clé API pour un provider déjà configuré et bascule automatiquement dessus si l'ancienne échoue, sans toucher au fallback de modèles."
---

# Rotation de clés API par provider

## Format d'entrée attendu
L'utilisateur donne des clés sous la forme : `Provider : <clé>`
Exemple : `Google : AIzaSy...`

## Procédure

### 1. Stocker la nouvelle clé comme un profil distinct
Ne jamais remplacer l'ancienne clé. Utiliser un nouveau profil nommé :

```bash
openclaw models auth paste-api-key --profile-id <provider>:<nom> --provider <provider>
```

Nommer le profil de façon à le distinguer de l'ancien (ex: `google:manual2`, `google:2026-07`). Vérifier avec `openclaw models auth --help` que la syntaxe n'a pas changé avant d'exécuter.

### 2. Configurer l'ordre de rotation
Une fois les deux profils présents, définir l'ordre :

```bash
openclaw models auth order set --provider <provider> <profil_prioritaire> <profil_secondaire>
```

Exemple pour Google avec la nouvelle clé en prioritaire :
```bash
openclaw models auth order set --provider google google:manual2 google:manual
```

### 3. Vérifier l'ordre appliqué
```bash
openclaw models auth order get --provider <provider>
```

### 4. Tester un appel réel
Basculer sur un modèle du provider et lancer un prompt pour confirmer que la rotation fonctionne.

### 5. Masquer les clés
Toujours masquer les clés dans les logs et réponses (ex: `****XlK`). Ne jamais les stocker en clair ailleurs que via le mécanisme d'auth officiel `openclaw models auth paste-api-key`.

---

## Cas d'usage typique (automatique)
Si en pleine séance un appel échoue avec 401/403 sur un provider qui a plusieurs profils :

1. Vérifier si l'ordre de rotation a déjà un profil de secours configuré (`openclaw models auth order get --provider <provider>`)
2. Si oui, la rotation est déjà en place — ne pas re-demander de clé
3. Ne re-demander une nouvelle clé QUE si tous les profils existants sont épuisés/invalides

---

## Garde-fous
- **Ne jamais supprimer un ancien profil sans confirmation explicite** — le garder en secours (reset de quota mensuel possible)
- **Ne pas confondre avec le fallback de modèles** (`openclaw models fallbacks`) — ce sont deux systèmes complètement séparés
- **Ne pas écraser** un profil existant — toujours ajouter un nouveau profil distinct
