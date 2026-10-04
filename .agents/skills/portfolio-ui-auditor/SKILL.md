---
name: portfolio-ui-auditor
description: >-
  Audite la qualité de code, l'accessibilité WCAG 2.2 AA, le design responsive mobile/desktop,
  l'intégrité des assets d'images (WebP/PNG) et la validité SEO du portfolio de Charles Kamga.
  Utiliser lorsque l'utilisateur demande d'auditer le site, vérifier les contrastes, tester le responsive ou valider les assets.
disable-slash-command: false
---

# Portfolio UI/UX & Code Auditor — Runbook de Contrôle Qualité

Cette compétence permet à l'agent de mener un audit systématique de conformité technique, ergonomique et visuelle avant toute livraison ou déploiement.

---

## 1. Audit Statique Automatisé

Exécuter le script de validation intégré :

```bash
npm run audit
```

Ce script vérifie automatiquement :

1. La présence et l'intégrité des 6 fichiers HTML du portfolio.
2. La validité syntaxique de [certifications.json](file:///assets/data/certifications.json) et l'existence physique de toutes les images pointées.
3. La parité WebP pour chaque asset PNG/JPG (évite les erreurs HTTP 404).
4. La présence des balises SEO indispensables (`description`, `canonical`, `og:image`).
5. L'accessibilité des formulaires (chaque `<label for="...">` doit correspondre à un champ `<input id="...">`).

---

## 2. Grille de Contrôle Visuelle & Responsive

Pour valider l'expérience utilisateur, exécuter ces vérifications :

### A. Défilement Horizontal (Largeur 375px)

- Ouvrir la page sur une émulation mobile (largeur 375px).
- Vérifier que la règle `overflow-x: hidden` est active et qu'aucun widget ou tableau ne force une barre de défilement horizontale.
- Tester la zone du pouce (_Thumb Zone_) : la barre inférieure `.bottom-nav` doit rester fixée en bas, avec une marge de sécurité pour le Home Indicator iOS (`env(safe-area-inset-bottom)`).

### B. Contrôle du Cockpit Desktop (Largeur >= 1025px)

- Sur grand écran, la page d'accueil [index.html](file:///index.html) doit tenir sur la hauteur de l'écran (`100vh`) sans déclencher de scrollbar verticale.
- Si un widget déborde, ajuster les paddings (`padding: 16px 20px`) ou la taille des polices plutôt que de casser la grille.

### C. Accessibilité Clavier & Navigation

- Naviguer avec la touche `Tab` :
  - L'anneau de focus doit être distinctement visible (`outline: 2px solid #00d1ff`).
  - Aucun élément actif ne doit disparaître sous la barre mobile lors de la tabulation (`scroll-padding-bottom: 80px`).

---

## 3. Boucle de Remédiation

Si l'audit remonte des anomalies :

- **Images manquantes ou 404** : Lancer `npm run optimize:images` pour générer les fichiers `.webp`.
- **Problème de formatage** : Exécuter `npm run format`.
- **Problème de contraste** : Consulter les tokens dans [.agents/rules/ui-ux-design-system.md](file:///.agents/rules/ui-ux-design-system.md) et s'assurer que le ratio de contraste reste supérieur ou égal à 4.5:1.
