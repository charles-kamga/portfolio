---
title: "MeetLocal"
description: "Plateforme de visioconférence et partage d'écran temps réel basée sur WebRTC, signalisation WebSocket sécurisée avec Node.js et Socket.IO."
category: "web"
categoryLabel: "Web & Temps Réel"
date: "2024"
tags: ["Node.js", "WebRTC", "Socket.IO", "WebSockets", "Express", "Security"]
sourceUrl: "https://github.com/charles-kamga/meetlocal"
image: "/assets/projects/meetlocal/PageDaceuil.png"
badge: "WebRTC Stream Engine"
featured: true
metrics:
  - label: "Architecture"
    value: "Mesh P2P + WSS"
  - label: "Latence"
    value: "Sub-seconde"
  - label: "Isolation"
    value: "Salons par Token"
---

## 🎯 Contexte & Problème Réel (Situation & Tâche)

Les plateformes de visioconférence courantes imposent le transit systématique de la vidéo et de l'audio à travers des serveurs médias centralisés, ce qui soulève des problématiques de confidentialité des flux et d'utilisation inutile de bande passante extérieure pour des utilisateurs situés sur un même réseau ou désireux d'échanger en pair-à-pair.

L'objectif était de concevoir un système de visioconférence épuré et sécurisé exploitant le protocole WebRTC pour établir des liaisons directes de navigateur à navigateur (P2P), avec un serveur Node.js dédié uniquement à la signalisation initiale et au contrôle d'accès.

---

## 🛠️ Architecture & Réalisation Technique (Action)

1. **Serveur de Signalisation Node.js & Socket.IO** :
   - Mise en place d'un serveur événementiel chargé d'échanger les métadonnées de connexion SDP (_Session Description Protocol_) et les candidats ICE (_Interactive Connectivity Establishment_) entre les pairs.
   - Gestion stricte de l'isolation des salons (rooms) via des identifiants cryptographiques pour empêcher toute intrusion entre réunions distinctes.

2. **Négociation WebRTC Pair-à-Pair** :
   - Initialisation des instances `RTCPeerConnection` côté client, gestion des flux médias locaux (`getUserMedia`) pour la caméra, le micro et le partage d'écran.
   - Routage automatique des flux audio/vidéo directs entre les participants dès la négociation réussie.

3. **Sécurisation & Résilience des Flux** :
   - Chiffrement DTLS-SRTP intrinsèque aux connexions WebRTC.
   - Gestion des reconnexions automatiques en cas de perte momentanée de paquets ou de saut de réseau.

---

## ⚠️ Blocages & Difficultés Rencontrées

- **Traversée des NAT et routeurs stricts (ICE candidate mismatch)** : Lors des tests entre deux machines situées derrière des box Internet différentes ou des réseaux mobiles stricts, la connexion P2P directe échouait car les adresses IP privées n'étaient pas routables publiquement.
  - _Solution apportée_ : Intégration et configuration de serveurs STUN publics fiables (`stun:stun.l.google.com:19302`) pour permettre la découverte des adresses IP publiques réflexives de chaque pair.
- **Gestion des déconnexions intempestives et flux orphelins** : Si un participant fermait brutalement son onglet, les autres participants continuaient d'attendre des paquets, laissant des éléments `<video>` figés à l'écran.
  - _Solution apportée_ : Mise en place d'un heartbeat régulier sur Socket.IO avec écoute des événements `disconnect` pour nettoyer proprement les `RTCPeerConnection` associées et notifier immédiatement l'UI des pairs restants.

---

## 💡 Ce que ce projet m'a appris (Résultats & Bilan)

- Compréhension approfondie du modèle WebRTC (offres/réponses SDP, serveurs STUN/TURN, candidats ICE).
- Programmation événementielle asynchrone avec Node.js et Socket.IO.
- Gestion des périphériques médias navigateurs et des contraintes de sécurité HTTPS/WSS obligatoires.
