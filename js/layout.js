/**
 * Gestion de la mise en page et de l'espacement dynamique
 */

class LayoutManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mainContent = document.querySelector('main, .main-content');
    this.lastScrollTop = 0;
    this.isScrollingDown = false;
    this.scrollThreshold = 100; // Seuil de défilement pour le changement de hauteur
    
    this.init();
  }

  init() {
    if (!this.navbar || !this.mainContent) return;

    // Initialisation des styles
    this.updateStyles();
    
    // Écouteurs d'événements
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    
    // MutationObserver pour détecter les changements de classe sur la navbar
    this.observeNavbarChanges();
  }

  handleScroll() {
    if (!this.navbar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrollingDown = scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold;
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
    // Mise à jour des styles en fonction du défilement
    this.updateStyles();
  }

  handleResize() {
    this.updateStyles();
  }

  updateStyles() {
    if (!this.navbar || !this.mainContent) return;
    
    const navbarRect = this.navbar.getBoundingClientRect();
    const isScrolled = this.navbar.classList.contains('scrolled');
    const navbarHeight = isScrolled ? 'var(--navbar-scrolled-height, 70px)' : 'var(--navbar-height, 80px)';
    
    // Mise à jour de la hauteur de la navbar
    document.documentElement.style.setProperty('--navbar-current-height', navbarHeight);
    
    // Ajustement du padding-top du body
    document.body.style.paddingTop = navbarHeight;
    
    // Ajustement du scroll-padding-top pour les ancres
    document.documentElement.style.scrollPaddingTop = `calc(${navbarHeight} + 1rem)`;
    
    // Mise à jour des styles pour les ancres
    const anchorOffset = `calc(${navbarHeight} + 2rem)`;
    document.documentElement.style.setProperty('--anchor-offset', anchorOffset);
  }

  observeNavbarChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.updateStyles();
        }
      });
    });

    observer.observe(this.navbar, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si la gestion de la mise en page est nécessaire
  if (document.querySelector('.navbar')) {
    window.layoutManager = new LayoutManager();
  }
});
