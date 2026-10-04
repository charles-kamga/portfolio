---
title: "Faceless Pipeline"
description: "Pipeline CLI autonome de génération et publication automatisée de vidéos courtes (Shorts 9:16) sur YouTube : cascade multi-LLM, synthèse vocale, rendu FFmpeg et auto-upload."
category: "ai"
categoryLabel: "Media Automation & CLI"
date: "2024"
tags:
  [
    "Python",
    "CLI (Typer/Rich)",
    "FFmpeg",
    "Cascade Multi-LLM",
    "Edge-TTS",
    "Whisper",
    "YouTube API",
  ]
sourceUrl: "https://github.com/charles-kamga/faceless-pipeline"
image: "/assets/projects/faceless-pipeline/faceless-cli.png"
badge: "Automated Video Engine"
featured: true
metrics:
  - label: "Format cible"
    value: "Shorts 9:16 vertical"
  - label: "Production"
    value: "+5.8k vues (YouTube)"
  - label: "Architecture"
    value: "Pipeline CLI (M1 à M8)"
  - label: "Résilience"
    value: "Stale Cascade & Verrous"
---

## 🎯 Contexte & Problème Réel (Situation & Tâche)

La production régulière et soutenue de contenus éducatifs en vulgarisation informatique et technologique sur YouTube (formats courts _Shorts_ 9:16) exige l'enchaînement sans faille d'une chaîne de traitement complexe : écriture scénarisée avec accroche percutante (_hook_), génération de voix off fluide, sélection d'illustrations de stock pertinentes, montage vertical calibré à la milliseconde, incrustation de sous-titres synchronisés et téléversement.

Deux premières implémentations (une interface Web trop lourde à maintenir et un CLI surdimensionné) avaient mis en lumière des problèmes de résilience : un seul fournisseur LLM indisponible ou un échec de rendu FFmpeg bloquait tout le processus.

L'objectif était de concevoir **Faceless Pipeline** (`faceless-studio`) : un outil CLI en Python épuré, modulaire, opérable à coût zéro avec des points de contrôle humains (_checkpoints_) ou en mode automatisé (_Turbo_), capable de sortir une vidéo finalisée et prête à la diffusion en une commande.

---

## 🛠️ Architecture & Réalisation Technique (Action)

1. **Interface CLI avec Typer, Rich & Questionary** :
   - Interface terminal interactive avec retours d'état stylisés, barres de progression et checkpoints de validation (validation du script, écoute de la voix off, revue du montage avant publication).

2. **Cascade Résiliente Multi-LLM (Module M1)** :
   - Moteur de génération scénaristique conçu pour basculer automatiquement entre plusieurs fournisseurs (Gemini, Groq, Mistral) dès la détection d'une limite de quota HTTP 429 ou d'un timeout réseau, avec gabarit de secours autonome pour éliminer tout point de rupture unique.

3. **Moteur Vocal Hybride & Normalisation Audio (Module M2)** :
   - Synthèse vocale basée sur Edge-TTS avec fallback ElevenLabs. Vérification stricte des langues cibles et contrôle de pitch pour garantir une restitution vocale naturelle.

4. **Extraction Visuelle Bilingue (Module M3)** :
   - Les moteurs de banques d'images (Pexels) étant indexés quasi exclusivement en anglais, une étape d'extraction par LLM traduit les concepts du script français en mots-clés visuels concrets en anglais avant l'interrogation de l'API, garantissant un taux de découverte de visuels de 100 %.

5. **Filtergraph FFmpeg & Auto-Ducking (Module M4)** :
   - Normalisation automatique de médias de résolutions et durées disparates (`scale` préservant l'aspect ratio $\rightarrow$ `crop` 9:16 $\rightarrow$ `setsar=1` $\rightarrow$ 30 fps fixe).
   - Assemblage calé sur la durée exacte de l'audio avec mixage intelligent (_sidechain ducking_) réduisant automatiquement le volume de la musique de fond lors des prises de parole.

6. **Sous-Titrage Whisper & Alignement Algorithmique (Module M5)** :
   - Transcription mot à mot via Groq Whisper avec générateur d'alignement algorithmique de secours (répartition temporelle calculée) en cas de panne de l'API de transcription.

7. **Orchestration d'État & Sécurité de Publication (Modules M8 & Core)** :
   - **Invalidation en cascade (_stale cascade_)** : toute modification ou régénération d'un module amont (ex: script M1) invalide automatiquement les livrables avals déjà calculés pour éviter toute incohérence au montage.
   - **Verrouillage exclusif du manifeste** : opérations d'écriture atomiques avec verrou de fichier (`manifest.json.lock`) pour prévenir la corruption concurrente des métadonnées de projet.
   - **Double verrouillage de publication** : protection stricte empêchant toute publication accidentelle sur la chaîne YouTube sans validation explicite.

---

## ⚠️ Blocages & Difficultés Rencontrées

- **Échecs silencieux et vidéos déformées sous FFmpeg** : Des sources visuelles aux ratios hétérogènes (16:9, carré, 4:3) produisaient des étirements visuels inacceptables lors d'une simple concaténation naïve.
  - _Solution apportée_ : Écriture d'un filtre FFmpeg standardisé appliquant d'abord un redimensionnement proportionnel puis un recadrage centré en 1080x1920 avant concaténation.
- **Incohérence des éléments lors des reprises partielles** : Modifier le script après avoir généré l'audio et la vidéo laissait subsister d'anciens fragments visuels.
  - _Solution apportée_ : Implémentation du mécanisme de dépendance descendante (_stale cascade_) dans le gestionnaire d'état du projet.
- **Musique de fond écrasant la voix off** : Un volume fixe pour la piste audio musicale nuisait à l'intelligibilité des explications techniques.
  - _Solution apportée_ : Intégration d'un filtre `sidechain ducking` réduisant dynamiquement la bande sonore de 18 dB dès qu'un signal vocal est détecté.

---

## 💡 Ce que ce projet m'a appris (Résultats & Bilan)

- **Impact en production réelle** : Utilisation active pour alimenter la chaîne éducative _Curioso Savoir_, générant plus de 5 800 vues et +3 200 % de progression d'audience en 28 jours.
- Conception d'un pipeline de données déterministe avec gestion rigoureuse des états et de la concurrence sous Linux.
- Maîtrise avancée des filtres complexes de transcodage multimédia avec FFmpeg.

<div class="project-inline-preview" style="margin-top: 24px; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;">
  <p style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-primary); margin-bottom: 8px;">
    <i class="fas fa-video"></i> LIVRABLE VIDÉO GÉNÉRÉ PAR LE PIPELINE (MODULE M6)
  </p>
  <picture>
    <source srcset="/assets/projects/faceless-pipeline/pipeline-preview.webp" type="image/webp" />
    <img src="/assets/projects/faceless-pipeline/pipeline-preview.jpg" alt="Miniature YouTube Short générée par Faceless Pipeline" style="max-width: 260px; width: 100%; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);" loading="lazy" />
  </picture>
</div>
