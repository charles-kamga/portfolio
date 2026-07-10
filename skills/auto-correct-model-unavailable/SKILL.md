---
name: "auto-correct-model-unavailable"
description: "Corrige automatiquement les erreurs \"Unknown model\" ou \"no matching models.providers[...].models[]\". Logs dans `model-autofix.log`."
---

# Auto-correction modèle indisponible

## Déclencheur
- Erreur `"Unknown model"` ou `"no matching models.providers[...].models[] entry"` lors d'une tentative de fallback (manuelle ou automatique).
- **Activation automatique** via interception des erreurs OpenClaw (pas de commande utilisateur requise).

---

## Procédure

### 1. Parse l'erreur
Extraire :
- `provider_demande` (ex: `openai`)
- `model_id_demande` (ex: `gpt-4o-mini`)

### 2. Diagnostic (sans confirmation)
#### a) Provider existe ?
```bash
openclaw config get models.providers."${provider_demande}"
```
- **Si non** : Vérifier si une clé API existe pour ce provider :
  ```bash
  openclaw models auth | grep "${provider_demande}"
  ```
- **Si oui** : Vérifier si le modèle est dans `models[]` :
  ```bash
  openclaw config get models.providers."${provider_demande}".models | grep "${model_id_demande}"
  ```

### 3. Résolution
#### Cas 1 : Provider/modèle manquant mais clé API existante
- Récupérer la valeur `api` attendue via :
  ```bash
  openclaw config schema lookup models.providers."${provider_demande}".api
  ```
- **Patch securisé** (dry-run puis application si validé) :
  ```bash
  echo '{"models": {"providers": {"'"${provider_demande}"'": {"models": ["'"${model_id_demande}"'"]}}}}' | \
    openclaw config patch --stdin --dry-run && \
    openclaw config patch --stdin
  ```
- Valider la config :
  ```bash
  openclaw config validate
  ```
- Basculer vers le modèle :
  ```bash
  openclaw models set "${provider_demande}/${model_id_demande}"
  ```

#### Cas 2 : Clé API manquante
- Basculer vers un modèle **déjà fonctionnel** (priorité aux providers existants).
- Informer l'utilisateur :
  > *"Le modèle ${provider_demande}/${model_id_demande} nécessite une clé API absente. Bascule sur ${provider_alt}/${model_alt}."*

### 4. Mise à jour des fallbacks
```bash
openclaw models fallbacks add "${provider_demande}/${model_id_demande}"
```

### 5. Log
Écrire dans `~/.openclaw/workspace/model-autofix.log` :
```plaintext
[YYYY-MM-DD HH:MM:SS] Erreur: ${erreur_originale} | Diagnostic: ${diagnostic} | Action: ${action} | Résultat: ${résultat}
```

---

## Garde-fous
- **Jamais d'écrasement de config** : Uniquement `config patch` ou `config set`.
- **Dry-run obligatoire** avant toute écriture.
- **Arrêt après 2 tentatives infructueuses** : Rapport détaillé à l'utilisateur.
- **Clés API masquées** : Jamais affichées/loggées en clair.

---

## Déclenchement concret
- **Automatique** : Interception des erreurs OpenClaw via un hook système (à configurer dans `gateway`).
- **Manuel** (si besoin) :
  ```bash
  openclaw skill trigger auto-correct-model-unavailable --error="Unknown model: openai/gpt-4o-mini"
  ```
