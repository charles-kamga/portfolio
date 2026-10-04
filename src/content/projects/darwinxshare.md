---
title: "DarwinxShare Pro"
description: "Moteur de transfert Wi-Fi haute vitesse entre Linux et iOS avec serveur Flask embarqué, zéro cloud et gestion de sockets locaux."
category: "sys"
categoryLabel: "Systèmes & Réseaux"
date: "2024"
tags: ["Python", "Flask", "Sockets", "Linux Networking", "Local Security"]
sourceUrl: "https://github.com/charles-kamga/darwinxShare"
demoUrl: "https://github.com/charles-kamga/darwinxShare/releases/tag/v1.8.2.1"
image: "/assets/projects/darwinxshare/qr-access.webp"
badge: "Wi-Fi Transfer Engine"
featured: true
metrics:
  - label: "Latence transfert"
    value: "LAN direct"
  - label: "Dépendance Cloud"
    value: "0%"
  - label: "Protocole"
    value: "HTTP/Sockets"
---

## 🎯 Contexte & Problème Réel (Situation & Tâche)

Partager des fichiers volumineux (vidéos, archives, builds) entre un poste Linux (Arch Linux) et un iPhone/iPad sans passer par des services Cloud tiers (qui compressent les médias, brident la bande passante et exposent des métadonnées) est notoirement fastidieux dans l'écosystème Apple/Linux.

L'objectif était de concevoir un utilitaire autonome, instantanément accessible depuis un navigateur mobile par simple scan d'un QR code, capable d'échanger des flux de données à la vitesse maximale du réseau local sans aucune installation requise côté client mobile.

---

## 🛠️ Architecture & Réalisation Technique (Action)

1. **Serveur Backend Flask & Gestion Socket** :
   - Mise en place d'un serveur HTTP local léger en Python avec Flask servant une interface responsive optimisée pour Safari iOS.
   - Binding automatique sur l'adresse IP locale de l'interface Wi-Fi active via `socket.gethostbyname_ex` et inspection de routage Linux.

2. **Génération Dynamique de Session & QR Code** :
   - Génération d'un QR code dans le terminal ou via une fenêtre graphique contenant l'URL directe `http://<IP_LOCALE>:<PORT>`.
   - Contrôle d'accès par jetons de session éphémères pour empêcher tout accès non autorisé depuis d'autres appareils connectés au même réseau Wi-Fi.

3. **Streaming & Upload par Blocs (Chunked Transfer)** :
   - Implémentation du téléchargement et téléversement en flux continus (`stream_with_context`) pour éviter d'engorger la mémoire RAM lors du transfert de fichiers de plusieurs gigaoctets.

---

## ⚠️ Blocages & Difficultés Rencontrées

- **Gestion du multitâche sous iOS Safari** : iOS met rapidement en veille les connexions HTTP en arrière-plan dès que l'écran se verrouille ou que l'utilisateur change d'application, provoquant des ruptures de socket en plein milieu d'un gros transfert.
  - _Solution apportée_ : Ajout de la reprise de téléchargement via les en-têtes HTTP `Range` (`bytes=start-end`) et un système de chunking côté client avec confirmation d'acquittement.
- **Résolution d'adresses multi-interfaces sur Linux** : Si plusieurs interfaces (Docker `docker0`, VPN `tun0`, Wi-Fi `wlan0`) sont actives simultanément, déterminer la bonne adresse IP routable vers le smartphone n'est pas trivial.
  - _Solution apportée_ : Utilisation d'une connexion fictive UDP sans envoi de paquets (`socket.connect(('8.8.8.8', 80))`) pour interroger la table de routage du noyau Linux et obtenir l'IP de sortie correcte.

---

## 💡 Ce que ce projet m'a appris (Résultats & Bilan)

- Compréhension approfondie du protocole HTTP (en-têtes de streaming, `Content-Range`, `multipart/form-data`).
- Pratique concrète de l'inspection réseau sous Linux (`ip route`, gestion des interfaces réseau virtuelles).
- Importance d'anticiper les contraintes des systèmes d'exploitation mobiles (gestion agressive de l'énergie et des sockets).
