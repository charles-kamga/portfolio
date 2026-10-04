---
title: "DarwinX Neighbour"
description: "Assistant de bureau modulaire et scratchpad HUD persistant pour Linux (Hyprland / Wayland) développé en Python 3 et CustomTkinter."
category: "desktop"
categoryLabel: "Systèmes & Outils Desktop"
date: "2024"
tags:
  [
    "Python 3",
    "CustomTkinter",
    "Linux (Hyprland)",
    "PipeWire",
    "Multithreading",
    "Psutil",
  ]
sourceUrl: "https://github.com/charles-kamga/Skilling-Darwinx-1"
image: "/assets/projects/darwinx-neighbour/darwinx-neighbour-ui.png"
badge: "Linux Productivity HUD"
featured: true
metrics:
  - label: "Plateforme"
    value: "Arch Linux / Hyprland"
  - label: "Concurrence"
    value: "ThreadPool Non-Bloquant"
  - label: "Moteur Audio"
    value: "PipeWire / MPV"
---

## 🎯 Contexte & Problème Réel (Situation & Tâche)

Dans un environnement de développement sous Linux avec gestionnaire de fenêtres en mosaïque (tiling window manager tel que Hyprland), le basculement permanent de bureau ou d'espace de travail pour noter une idée rapide, lancer un minuteur Pomodoro, enregistrer un mémo vocal ou surveiller les ressources machine brise le flux de concentration (flow state).

L'objectif était de bâtir un HUD (Heads-Up Display) de productivité persistant, ultra-réactif, capable d'apparaître instantanément sous un raccourci clavier global sans jamais geler l'interface graphique.

---

## 🛠️ Architecture & Réalisation Technique (Action)

1. **Interface Graphique Réactive avec CustomTkinter** :
   - Conception d'une interface épurée en mode sombre basée sur CustomTkinter v6, optimisée pour s'intégrer harmonieusement à l'esthétique d'un bureau Wayland moderne.

2. **Architecture Asynchrone & ThreadPool Dédié** :
   - Séparation stricte entre la boucle d'événements principale de l'interface (main thread UI) et les opérations lourdes (lectures d'E/S disque, enregistrement audio, requêtes d'état système via `psutil`).
   - Implémentation d'un pool de threads (`thread_pool.py`) pour exécuter les tâches en arrière-plan sans provoquer de saccades ou de blocages du pointeur.

3. **Capture Audio & Mémos via PipeWire** :
   - Intégration directe avec le serveur de son moderne Linux (PipeWire) pour capturer instantanément des mémos vocaux compressés à la volée.
   - Intégration d'un générateur de bruits d'ambiance et de concentration utilisant `mpv` en processus léger d'arrière-plan.

4. **Intégration Hyprland Scratchpad & Épinglage** :
   - Configuration de règles de fenêtrage Wayland (`hyprctl`) et scripts d'appel pour basculer instantanément la fenêtre entre l'état caché et affiché en surimpression sur n'importe quel écran, avec fonction d'épinglage HUD permanent.

5. **Moteur d'Orchestration Réactif (Routines Combo)** :
   - Conception d'un ordonnanceur de séquences multi-modules enchaînant automatiquement plusieurs sous-systèmes : démarrage d'un bruit blanc ambiant à volume calibré, création d'une entrée de session dans le scratchpad, synchronisation de cycles Pomodoro de deep work et arrêt programmé des flux sonores.
   - Moniteur d'exécution en temps réel permettant à l'utilisateur de basculer d'un onglet à l'autre sans jamais interrompre la routine active.

---

## ⚠️ Blocages & Difficultés Rencontrées

- **Gel de la boucle graphique Tkinter lors des accès E/S** : Tkinter étant nativement mono-threadé, tout accès disque (sauvegarde de note) ou appel système synchrone figeait l'ensemble de la fenêtre pendant quelques centaines de millisecondes.
  - _Solution apportée_ : Création d'un routeur d'actions découplé avec passage de messages thread-safe et mise à jour différée de l'UI via `root.after()`.
- **Comportement des fenêtres flottantes sous Wayland / Hyprland** : Contrairement à X11, Wayland interdit aux applications de positionner arbitrairement leurs fenêtres sur l'écran pour des raisons de sécurité.
  - _Solution apportée_ : Écriture de règles spécifiques dans `hyprland.conf` associant la classe de fenêtre `darwinx-neighbour` à un slot de type _special workspace / scratchpad_ avec animation de glissement fluide.

---

## 💡 Ce que ce projet m'a appris (Résultats & Bilan)

- Gestion concrète du multithreading et des conditions de concurrence (race conditions) dans une application graphique Python.
- Maîtrise des protocoles et subtilités de fenêtrage sous Linux Wayland par rapport à X11.
- Pratique des API système POSIX et de l'orchestration audio avec PipeWire.
