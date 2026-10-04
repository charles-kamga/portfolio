# Ligne Éditoriale & Positionnement Ingénierie

Ce document fixe les standards de rédaction, de valorisation technique et de conversion recruteur pour tout contenu rédigé sur le portfolio de **Charles Cyrille Kamga Mukam**.

---

## 1. Posture & Positionnement

- **Cible** : Tech Leads, Directeurs de l'Ingénierie (VP Eng), Ingénieurs Recruteurs et pairs développeurs.
- **Tonalité** : Précise, factuelle, axée sur la rigueur système, la sécurité et la clarté architecturale.
- **Vocabulaire clé** : _Security by Design, architecture résiliente, sockets BSD, POSIX, complexité algorithmique, multi-stage builds, scans SAST, idempotence, OWASP Top 10, isolation des processus._
- **Ce qu'on évite** : Le jargon marketing creux ("passionné dynamique et motivé"), les superlatifs non prouvés ("expert absolu"), les anglicismes mal maîtrisés.

---

## 2. Le Modèle STAR d'une Réalisation Technique

Chaque projet présenté dans `projects.html` ou documenté par l'agent doit être structuré selon la logique **STAR** (_Situation, Tâche, Architecture, Résultat_) :

### A. Le Problème Technique Réel (Situation & Tâche)

Identifier clairement le verrou résolu, pas simplement la technologie utilisée :

- _Exemple faible_ : "Application de chat en Node.js."
- _Exemple fort_ : "Système de communication temps réel pair-à-pair chiffré via WebRTC avec serveur de signalisation Node.js/Socket.IO autonome pour limiter la latence réseau."

### B. Choix d'Architecture & Décision Justifiée

Expliquer **pourquoi** telle technologie ou structure a été retenue :

- Pourquoi du C bas niveau ? (Contrôle déterministe de la mémoire, absence de garbage collector).
- Pourquoi des sockets bruts ou Flask local ? (Zéro dépendance vers un cloud tiers, débit maximal en réseau local).

### C. Métriques Chiffrées & Preuves d'Ingénierie (Résultats)

Un projet backend se valorise par ses chiffres :

- **Débit & Latence** : "Transfert local atteignant 45 Mo/s sur Wi-Fi 5 GHz."
- **Complexité temporelle & spatiale** : "Table de hachage O(1) avec fonction murmur3."
- **Fiabilité & Sécurité** : "Zéro fuite mémoire vérifiée sous Valgrind (0 bytes in 0 blocks), validation SAST Bandit avec zéro alerte haute sévérité."
- **Packaging & Déploiement** : Version sémantique taguée (ex: `v1.8.2`), image Docker allégée multi-stage (`< 35 Mo`).

---

## 3. Les Anti-Patterns Éditoriaux à Bannir

1. **Les jauges de compétences en pourcentage** :  
   Bannir définitivement `Python : 85%` ou `Docker : 70%`. Utiliser des regroupements par contexte d'usage ("Maîtrise en production", "Pratique avancée", "Notions & veille active").
2. **La dilution du signal technique** :  
   Ne jamais afficher des attestations bureautiques (Google Drive, Excel, Time Management) à côté de compétences d'ingénierie système ou de cybersécurité.
3. **Les boutons inactifs frustrants** :  
   Un lien désactivé "Projet Privé" sans détail est un signal négatif. Toujours accompagner un projet privé d'une étude de cas anonymisée (schéma d'architecture, technologies, défis relevés).
4. **La friction de prise de contact** :  
   Les recruteurs tech évaluent un profil en 30 secondes. L'accès au CV (format PDF lisible par les ATS) et à l'email doit être direct (1 clic).

---

## 4. Normalisation des Certifications (`certifications.json`)

Toute certification ajoutée doit respecter ces 4 impératifs :

1. **Émetteur reconnu** : Universités de premier plan (Yonsei, UC Irvine), leaders industriels (IBM, Google Cloud, AWS, Linux Foundation).
2. **Lien de vérification officiel** : URL de credential cliquable et authentifiée (`coursera.org/verify/...` ou `credly.com/...`).
3. **Catégorisation stricte** :
   - `Cybersecurity` : Audit, Pentest, Cryptographie, Architecture de sécurité.
   - `Networks` : Télécoms, TCP/IP, Routage, Wi-Fi, Protocoles IoT.
   - `Systems` : Administration Linux, POSIX, Kernel, Sécurité des BDD.
4. **Acquisitions de compétences claires** : 4 à 6 mots-clés techniques précis (ex: `["TCP/IP", "DNS Security", "Firewalls", "VPN"]`).
