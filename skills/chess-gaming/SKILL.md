---
name: "chess-gaming"
description: "Jouer aux échecs via DarwinxBot contre un humain sur LocalChess."
---

# ♘ Chess Gaming — Jouer aux échecs avec DarwinxBot

## Description
Ce skill enregistre ma capacité à jouer aux échecs contre un humain en utilisant le bot DarwinxBot (`darwinx_bot.py`) connecté au serveur **LocalChess — Chess Arena Pro**.

## Prérequis
- Le serveur LocalChess doit tourner (Flask + Flask-SocketIO, port 5000 par défaut)
- Python 3 avec les dépendances :
  - `python-socketio` + `websocket-client`
  - `python-chess`
  - `requests`
- La machine hôte doit pouvoir exécuter des processus en arrière-plan (préférer `background` ou `sessions_spawn` pour les sessions isolées)

## Fichier clé
- **`darwinx_bot.py`** : Client Socket.io autonome situé dans le dossier du projet (par ex. `/home/charles/Documents/Work/LocalChess/darwinx_bot.py`)
- **Venv projet** : `/home/charles/Documents/Work/LocalChess/venv/bin/python`

## Procédure de mise en route

### 1. Vérifier que le serveur répond
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/
# Doit retourner 302 (redirection login) ou 200
```

### 2. Tuer les éventuels anciens processus DarwinxBot
```bash
pkill -f darwinx_bot 2>/dev/null
```

### 3. Lancer le bot selon le mode souhaité

| Mode | Commande |
|---|---|
| **Auto-join** (rejoindre un salon libre) | `python darwinx_bot.py --auto-join --name Darwinx --skill 6` |
| **Salon spécifique** | `python darwinx_bot.py --room duel_xxx --name Darwinx --skill 6` |
| **Créer une partie IA** (attendre un humain) | `python darwinx_bot.py --create-ai --name Darwinx --skill 6` |

Utiliser `PYTHONUNBUFFERED=1` pour voir les logs en temps réel.
Lancer en `background` avec `yieldMs` pour laisser le bot tourner.

### 4. Interaction via le chat en jeu
Le bot peut dialoguer automatiquement dans le chat de l'arène. Il reconnaît :
- Les salutations → répond poliment
- Les questions (`?`) → réflexion
- Les félicitations/GG → compliments
- Les accusations de triche → déni élégant
- Les mentions de son nom → réponse

### 5. Difficulté (skill level)
- **1-2** : Coups aléatoires (débutant)
- **3-4** : Évaluateur matériel simple + développement central
- **5-6** : Évaluateur matériel + recherche MVV-LVA + blitz tactique
- **7-8** : Meilleur coup garanti sur l'évaluateur interne
- **9-10** : (Avec Stockfish) temps de calcul augmenté, jeu de grand maître

Sans Stockfish installé, le bot utilise un évaluateur Python pur (performant jusqu'au niveau 6-7 contre un humain amateur).

## Comportement de jeu
- Joue automatiquement quand c'est son tour (délai aléatoire 0.5-1.5s simulant la réflexion)
- Propose une revanche automatiquement après chaque partie (sauf si annulation)
- Les messages de taquinerie (15% de chance par coup) rendent l'expérience plus vivante

## Résolution de problèmes fréquents
- **Erreur de connexion `One or more namespaces failed to connect`** → Installer `websocket-client` dans l'environnement Python utilisé
- **Le bot ne voit pas les salons** → L'utilisateur humain doit avoir créé un salon via l'UI (MULTI LAN → CRÉER) avant le lancement en auto-join
- **Partie bloquée après revanche** → Vérifier que le `join_room` du bot arrive après la création du nouveau salon; corriger si nécessaire le timing dans `_do_rematch` côté serveur
