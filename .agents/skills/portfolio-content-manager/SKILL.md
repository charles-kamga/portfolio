---
name: portfolio-content-manager
description: >-
  Guide l'agent pour ajouter, modifier ou mettre à jour des réalisations/projets, des certifications,
  des compétences ou des widgets sur le portfolio de Charles Kamga. Utiliser lorsque l'utilisateur demande
  d'ajouter un projet, modifier une certification, ajouter une compétence ou mettre à jour le contenu.
disable-slash-command: false
---

# Portfolio Content Manager — Procédures d'Édition du Contenu

Cette compétence fournit le protocole pas-à-pas pour enrichir le portfolio de **Charles Cyrille Kamga Mukam** sans régression visuelle, technique ou de référencement.

---

## 1. Procédure d'Ajout d'un Nouveau Projet (`projects.html`)

### Étape 1 : Préparation des Assets Visuels

1. Créer un sous-dossier dans `assets/projects/<nom-du-projet>/`.
2. Y déposer l'image de capture ou le diagramme d'architecture au format PNG ou JPG (résolution recommandée : 800×450 ou ratio 16:9).
3. Exécuter le script de conversion WebP :
   ```bash
   ./.agents/skills/portfolio-content-manager/scripts/optimize.sh
   ```
4. Vérifier que le fichier `.webp` a bien été généré aux côtés du PNG/JPG.

### Étape 2 : Rédaction de la Carte Projet (Modèle STAR)

1. Ouvrir le gabarit de référence :
   [project-card-template.html](./resources/project-card-template.html)
2. Rédiger la description en respectant le modèle STAR :
   - Problème résolu.
   - Stack et architecture.
   - Métrique technique d'impact (débit Mo/s, complexité $O(1)$, tests Valgrind zero-leak).
3. Choisir la catégorie de filtrage appropriée pour `data-category` :
   - `sys` : Systèmes bas niveau (C), Réseaux, Linux, Sockets.
   - `web` : Applications web, APIs REST, WebRTC, Node.js, Python/Django/Flask.
   - `mobile` : Outils mobiles, passerelles iOS/Android.

### Étape 3 : Intégration dans `projects.html`

1. Insérer le bloc `<article class="project-card" data-category="...">` dans la `<div class="projects-grid">` de [projects.html](file:///home/charles/Documents/Work/Me/portfolio/projects.html).
2. S'assurer que les liens GitHub et Démo/Release comportent un attribut `aria-label` descriptif pour l'accessibilité.

---

## 2. Procédure d'Ajout d'une Certification (`certifications.html`)

### Étape 1 : Préparation de l'Image de Certification

1. Placer le visuel officiel du certificat dans `assets/certifications/images/` au format PNG.
2. Exécuter la compression WebP :
   ```bash
   ./.agents/skills/portfolio-content-manager/scripts/optimize.sh
   ```

### Étape 2 : Ajout dans `assets/data/certifications.json`

1. Consulter le schéma de conformité :
   [certification-schema.json](./resources/certification-schema.json)
2. Insérer une nouvelle entrée dans le tableau JSON :
   ```json
   {
     "id": "9",
     "title": "Nom Précis de la Certification",
     "issuer": "IBM",
     "date": "Oct 15, 2026",
     "category": "Cybersecurity",
     "skills": ["Compétence 1", "Compétence 2", "Compétence 3"],
     "image": "Nom Exact Image.png",
     "url": "https://coursera.org/verify/..."
   }
   ```
   > [!IMPORTANT]
   > Ne conserver que des certifications techniques à forte valeur ajoutée (Cybersécurité, Réseaux, Systèmes, Cloud). Bannir les attestations de bureautique grand public.

---

## 3. Procédure d'Ajout d'une Compétence Technique (`skills.html`)

1. Déterminer dans quel pilier insérer la compétence dans [skills.html](file:///home/charles/Documents/Work/Me/portfolio/skills.html) :
   - Langages & Cœur Système (`skill-card large`)
   - Écosystème Backend & APIs (`skill-card small`)
   - Architecture Linux & Sécurité (`skill-card large`)
   - Données & Persistance (`skill-card small`)
   - Arsenal d'Outils d'Ingénierie & Audit (Full width)
2. Ajouter le bloc avec l'icône Devicon ou SVG appropriée :
   ```html
   <div class="skill-item">
     <i class="devicon-[techno]-plain" aria-hidden="true"></i> [Nom Technique]
   </div>
   ```
3. Si un logo externe est nécessaire, **l'intégrer sous forme de SVG inline accessible** ou de fichier local, jamais via un lien d'image externe fragile.

---

## 4. Boucle de Validation Autonome

Après toute modification de contenu :

1. Lancer l'audit automatique :
   ```bash
   npm run audit
   ```
2. Vérifier que Prettier valide la mise en page :
   ```bash
   npm run format:check
   ```
3. Si nécessaire, ré-aligner les fichiers :
   ```bash
   npm run format
   ```
