# Règles de Conception UI/UX & Design System Bento 2.0

Ce document définit les normes visuelles, ergonomiques et d'accessibilité que tout agent doit appliquer lors de la création ou modification d'interfaces sur le portfolio.

---

## 1. Tokens du Design System (style.css)

Toutes les couleurs, rayons et transitions doivent s'appuyer sur les variables `:root` :

```css
:root {
  --bg-dark: #050507; /* Fond d'ambiance principal (Niveau 0) */
  --bg-sidebar: #08080c; /* Surface sidebar latérale */
  --bg-card: rgba(
    18,
    18,
    26,
    0.6
  ); /* Surface vitrée des cartes Bento (Niveau 1) */
  --bg-card-hover: rgba(28, 28, 42, 0.85); /* État survol (Niveau 3) */
  --border-color: rgba(255, 255, 255, 0.08); /* Bordure sub-pixel discrète */
  --border-glow: rgba(0, 209, 255, 0.3); /* Halo cyan au focus/hover */
  --accent-primary: #00d1ff; /* Cyan électrique (Actions principales & focus) */
  --accent-secondary: #7e3ff2; /* Violet néon (Accents d'ingénierie) */
  --accent-soft: rgba(0, 209, 255, 0.12); /* Arrière-plans d'icônes et badges */
  --text-main: #fcfcfd; /* Texte haute lisibilité (Ratio > 14:1) */
  --text-muted: #9494a3; /* Métadonnées & labels secondaires */
  --sidebar-width: 280px; /* Largeur fixe de la sidebar desktop */
  --card-radius: 22px; /* Arrondi caractéristique Bento */
  --font-main: "Inter", sans-serif; /* Typographie corps de texte */
  --font-heading:
    "Space Grotesk", sans-serif; /* Typographie titres et chiffres */
  --transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); /* Courbe de bézier fluide */
}
```

---

## 2. La Grille des 24 Critères UI/UX Obligatoires

|   N°   | Catégorie  | Critère                              | Seuil d'Acceptation                                                                 |
| :----: | :--------- | :----------------------------------- | :---------------------------------------------------------------------------------- |
| **1**  | **A11y**   | Contraste texte normal vs fond       | Ratio **≥ 4.5:1** (Ne jamais descendre sous `#9494a3`)                              |
| **2**  | **A11y**   | Contraste texte grand & icônes UI    | Ratio **≥ 3.0:1**                                                                   |
| **3**  | **A11y**   | Anneau de focus visible              | `outline: 2px solid var(--accent-primary); outline-offset: 3px;`                    |
| **4**  | **A11y**   | Focus non masqué (WCAG 2.2 - 2.4.11) | `scroll-padding-bottom: 80px; scroll-padding-top: 30px;`                            |
| **5**  | **A11y**   | Nom accessible sur icônes seules     | 100% des liens/boutons sans texte visible ont un `aria-label`                       |
| **6**  | **A11y**   | Hiérarchie sémantique des titres     | 1 seul `<h1>` par page, suite `h1` -> `h2` -> `h3` sans saut de niveau              |
| **7**  | **A11y**   | Formulaires accessibles              | Tout `<label>` possède un attribut `for` pointant vers l'`id` de son champ          |
| **8**  | **A11y**   | Alternatives textuelles images       | `alt` descriptif sur toute image informative, `alt=""` si purement décorative       |
| **9**  | **Mobile** | Cibles tactiles interactives         | Minimum **44 × 44 px** sur tous les boutons et liens mobiles                        |
| **10** | **Mobile** | Espacement entre cibles tactiles     | Distance séparatrice **≥ 8 px** entre deux contrôles adjacents                      |
| **11** | **Mobile** | Défilement horizontal (375px)        | `overflow-x: hidden` strict, zéro débordement horizontal                            |
| **12** | **Mobile** | Prise en compte de la Safe Area iOS  | `padding-bottom: env(safe-area-inset-bottom, 8px)` sur la bottom bar                |
| **13** | **Mobile** | Dégagement de fin de page            | Contenu principal décalé pour ne pas être masqué par la bottom bar                  |
| **14** | **Bento**  | Surfaces étagées sans noir absolu    | Canvas `#050507`, cartes `#12121A`, sous-badges `#1C1C28`                           |
| **15** | **Bento**  | Bordures sub-pixels & biseau         | `1px solid rgba(255,255,255,0.08)` + reflet intérieur zénithal                      |
| **16** | **Bento**  | Chiffres dynamiques stables          | `font-variant-numeric: tabular-nums` sur horloge et compteurs                       |
| **17** | **CWV**    | Cumulative Layout Shift (CLS)        | **CLS = 0.00** (Attributs `width` et `height` obligatoires sur `<img>`)             |
| **18** | **CWV**    | Ratios d'aspect réservés             | Utilisation de `aspect-ratio: 16 / 9` sur les vignettes de projets                  |
| **19** | **CWV**    | Priorisation LCP (Avatar)            | `loading="eager"` et `fetchpriority="high"` (pas de `loading="lazy"`)               |
| **20** | **CWV**    | Polices sans blocage de rendu        | `&display=swap` dans l'URL Google Fonts et `preconnect` déclarés                    |
| **21** | **CWV**    | Formats d'image modernes             | Source WebP (`type="image/webp"`) avec fallback JPG/PNG                             |
| **22** | **Motion** | Propriétés animées GPU-only          | Animer uniquement `transform` et `opacity` (interdiction d'animer `width`/`height`) |
| **23** | **Motion** | Respect de `prefers-reduced-motion`  | Neutralisation des durées d'animation si le visiteur le demande                     |
| **24** | **Global** | Score Lighthouse Global              | Accessibilité = 100, Performance ≥ 95 sur Mobile & Desktop                          |

---

## 3. Anatomie d'une Carte Bento Réussie

```html
<article class="widget bento-card">
  <div class="widget-header">
    <span class="widget-title">
      <i class="fas fa-microchip" aria-hidden="true"></i> Titre du Bloc
    </span>
    <span class="status-indicator">En production</span>
  </div>

  <div class="bento-content">
    <p>Explication concise et directe de la réalisation ou du concept.</p>
  </div>

  <footer class="bento-footer">
    <div class="tech-stack">
      <span class="tech-tag">Python</span>
      <span class="tech-tag">Docker</span>
    </div>
  </footer>
</article>
```

---

## 4. Règle du Cockpit Desktop vs Flux Mobile

1. **Desktop (>= 1025px)** :
   - `height: 100vh` fixe pour `index.html`.
   - Les widgets s'organisent en grille CSS bidimensionnelle (`.dashboard-grid-single-screen`).
2. **Tablette & Mobile (<= 1024px)** :
   - Rupture obligatoire du mode fixe : `height: auto`, flux naturel vertical.
   - Les cartes passent en largeur 100% avec des marges latérales de 16px à 20px.
   - La sidebar disparaît et cède la place à la `.bottom-nav` persistante.
