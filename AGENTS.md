# Configuration Agent : Portfolio de Charles Cyrille Kamga Mukam

Bienvenue sur le référentiel d'ingénierie et de configuration agent pour le portfolio de **Charles Cyrille Kamga Mukam**, Développeur Backend Junior & Passionné Linux/Sécurité.

Ce document constitue la **charte maîtresse et le contrat de pair-programming** applicable à tout agent AI intervenant sur ce dépôt.

---

## 1. Identité & Positionnement Professionnel (L'Aspect Vérité)

- **Nom complet** : Charles Cyrille Kamga Mukam
- **Rôle d'ingénierie** : Développeur Backend Junior & Passionné Linux/Sécurité
- **Posture & Éthique** : Transparence radicale. Aucune prétention d'expertise globale ("expert en rien"). Accent mis sur les réalisations réelles, l'expérimentation sur machine personnelle (Arch Linux / Hyprland), la rigueur de conception et l'apprentissage continu.
- **Stack cœur** : Python (FastAPI, Flask), Node.js (WebRTC, Socket.IO, Express), C (POSIX, sockets, structures de données O(1)), Linux (Arch Linux quotidien, scripting Bash, PipeWire), Docker, Sécurité Applicative (OWASP Top 10, défense en profondeur).
- **Accréditations majeures** : **IBM Cybersecurity Analyst Professional Certificate** (Coursera/IBM).
- **Engagement communautaire** : Membre actif et contributeur de **Python Cameroun**, bénévole **Google Developer Group (GDG)**, créateur de la chaîne éducative **Charltech** (YouTube).
- **Philosophie d'ingénierie** : _"Security by Design, clarté architecturale et robustesse système sans compromis."_

---

## 2. Architecture Technique du Dépôt

Le portfolio est propulsé par **Astro (Static Site Generation)** avec génération statique pure pour un temps de chargement instantané, zéro JavaScript superflu côté client et une sécurité maximale :

- **Générateur Statique** : Astro avec TypeScript (`astro.config.mjs`, `tsconfig.json`).
- **Design & Style** : CSS moderne scoped natif (`src/styles/global.css`), variables `:root`, Glassmorphism et Bento Grid, zéro framework CSS externe lourd.
- **Gestion du Contenu (Content Collections)** :
  - Projets documentés en Markdown (`src/content/projects/`) selon le modèle **STAR** honnête (Situation, Tâche, Action, Bilan & Apprentissages).
  - Données de certifications typées (`src/content/certifications/certifications.json`) avec notes de mise en pratique réelle.
- **Pipeline d'images** : Double distribution systématique WebP (`.webp`) + PNG/JPG via balises `<picture>`.
- **CI/CD** : Déploiement automatique sur GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).
- **Outillage** : Script d'audit automatisé `npm run audit`, script d'optimisation d'images `optimize_images.sh`, Prettier.

---

## 3. Garde-Fous Absolus (Règles Non Négociables)

Tout agent intervenant sur ce code **DOIT respecter rigoureusement** les règles fondamentales suivantes :

1. **Ergonomie Mobile & Défilement Horizontal Zéro** :  
   Sur mobile (≤ 768px et spécifiquement 375px), le layout suit un flux vertical fluide. Tout débordement horizontal (`overflow-x > 0`) est **strictement prohibé**. Les cibles tactiles doivent mesurer au minimum **44 × 44 px** avec un espacement d'au moins 8px.
2. **Double Format d'Image Obligatoire** :  
   Toute image ajoutée (projet, badge, certification) **DOIT** comporter sa version WebP (`.webp`) et sa version originale (PNG ou JPG), intégrées via une balise `<picture>` avec attributs `width`, `height` et `loading="lazy"` (sauf l'avatar Hero en `loading="eager"`).
3. **Intégrité de la Base Certifications** :  
   Ne jamais modifier le nom des images dans `public/assets/certifications/images/` sans répercuter le nom exact dans `src/content/certifications/certifications.json`. Conserver des certifications techniques vérifiables (Cybersécurité, Réseaux, Systèmes) avec une note d'expérimentation réelle.
4. **Harmonisation Permanente de la Navigation** :  
   Les pages doivent maintenir une navigation strictement symétrique :
   - Sidebar desktop : Dashboard (`/`), Réalisations (`/projects`), Accréditations (`/certifications`), Contact (`/contact`) + badge "Disponible".
   - Bottom-nav mobile : Accueil (`/`), Projets (`/projects`), Certifs (`/certifications`), Contact (`/contact`).
5. **Accessibilité WCAG 2.2 AA** :  
   Tout formulaire doit lier explicitement `<label for="id">` et `<input id="id">`. Tout bouton ou lien d'icône seul doit comporter un attribut `aria-label`. Le contraste texte/fond doit toujours dépasser **4.5:1**.
6. **Ligne Éditoriale & Modèle STAR** :  
   Chaque projet doit être rédigé avec humilité et rigueur : présenter le problème réel, l'architecture choisie, les bugs/blocages réellement rencontrés et les enseignements techniques retirés.

---

## 4. Commandes de Validation Usuelles

```bash
# Lancer le serveur de développement local
npm run dev

# Compiler le site statique
npm run build

# Vérifier l'intégrité globale du portfolio (routes, 404s, JSON, SEO, WebP)
npm run audit

# Formater le code avec Prettier
npm run format
```
