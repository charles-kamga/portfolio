---
title: "Darwinx Video Pipeline"
description: "Architecture de traitement vidéo et audio automatisée avec FastAPI, WebSockets, cascade multi-LLM, synthèse vocale Kokoro ONNX et assemblage FFmpeg."
category: "ai"
categoryLabel: "Backend & IA"
date: "2024"
tags: ["FastAPI", "WebSockets", "Python", "ONNX", "FFmpeg", "Multi-LLM"]
sourceUrl: "https://github.com/charles-kamga/Darwinx_Faceless_Vid"
image: "/assets/projects/darwinx-video-pipeline/pipeline-preview.png"
badge: "Automated Media Engine"
featured: true
metrics:
  - label: "Moteur Audio"
    value: "Kokoro ONNX & Edge-TTS"
  - label: "Orchestration"
    value: "FastAPI / WebSocket"
  - label: "Rendu"
    value: "FFmpeg Hardware Accel"
---

## 🎯 Contexte & Problème Réel (Situation & Tâche)

La production régulière de contenus pédagogiques ou techniques (formats courts et longs) exige une suite complexe d'actions répétitives : génération d'un script scénarisé, synthèse vocale fluide, recherche de plans d'illustration cohérents, découpage audio et composition vidéo avec sous-titres synchronisés.

Faire cela manuellement ou via des scripts séquentiels rigides en ligne de commande engendre des blocages fréquents dès qu'un service externe tombe ou qu'une clé API atteint ses quotas. Le défi était de construire un pipeline backend modulaire, résilient et pilotable en temps réel.

---

## 🛠️ Architecture & Réalisation Technique (Action)

1. **Passerelle FastAPI & Télémétrie WebSocket** :
   - Mise en place d'un backend asynchrone avec FastAPI gérant le cycle de vie des tâches de rendu (`JobContext`).
   - Diffusion en temps réel de la progression étape par étape vers le client via WebSockets avec reprise d'état.

2. **Cascade Résiliente Multi-LLM** :
   - Moteur de génération de scripts conçu pour basculer automatiquement entre plusieurs modèles de langage en cas d'erreur HTTP 429 (rate limiting) ou de timeout, garantissant la complétion du job.

3. **Moteur Vocal Local & Hybride (Kokoro ONNX / Edge-TTS)** :
   - Intégration du modèle open-source Kokoro fonctionnant en local via le runtime ONNX (avec conversion de tenseurs `float32`) pour générer une voix naturelle sans coût API récurrent.
   - Fallback automatique vers Edge-TTS lorsque le traitement accéléré CPU/GPU local n'est pas disponible.

4. **Composition & Rendu FFmpeg** :
   - Automatisation du pipeline FFmpeg : alignement précis des pistes audio avec détection de silences, application d'effets visuels dynamiques (Ken Burns / zooms fluides) et incrustation de sous-titres animés.

---

## ⚠️ Blocages & Difficultés Rencontrées

- **Incompatibilité de types de tenseurs avec le runtime ONNX de Kokoro** : Lors des premiers tests d'inférence, Kokoro crashait sur le runtime ONNX Linux en raison d'un mismatch entre les formes de tenseurs et le dtype `float32` attendu par la couche vocale.
  - _Solution apportée_ : Réécriture de la routine de prétraitement audio pour forcer l'aplatissement des tableaux NumPy et la normalisation en `float32` avant passage au runtime ONNX.
- **Synchronisation temporelle des sous-titres avec le débit de parole** : Les modèles de voix ne parlent pas tous à la même cadence, ce qui décalait les sous-titres par rapport à l'audio au fur et à mesure que la vidéo avançait.
  - _Solution apportée_ : Analyse de durée mot à mot par extraction d'horodatages temporels (timestamps) via le moteur de synthèse, puis génération d'un fichier ASS / SRT calibré au milliseconde près.

---

## 💡 Ce que ce projet m'a appris (Résultats & Bilan)

- Maîtrise de l'asynchronisme Python (`asyncio`) et des flux WebSocket bidirectionnels.
- Manipulation concrète de modèles d'inférence ONNX en local sous Linux sans dépendance cloud.
- Pratique avancée des filtres complexes FFmpeg (`filter_complex`, enchaînement audio/vidéo).
