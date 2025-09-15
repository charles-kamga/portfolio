// Gestion du menu de navigation et du défilement
class NavigationManager {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.header = document.querySelector('header');
    this.lastScrollTop = 0;
    this.scrolling = false;
    this.resizeTimeout = null;
    
    this.init();
  }
  
  init() {
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupScrollEvents();
    this.setupResizeHandler();
    this.highlightActiveLink();
  }
  
  setupMobileMenu() {
    if (!this.menuToggle) return;
    
    this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    
    // Fermer le menu au clic sur un lien
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
  }
  
  toggleMobileMenu() {
    const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true' || false;
    this.menuToggle.setAttribute('aria-expanded', !isExpanded);
    this.navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  }
  
  closeMobileMenu() {
    if (window.innerWidth <= 768) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  }
  
  setupSmoothScroll() {
    // Désactivé temporairement pour le débogage
    // Laisser le défilement natif du navigateur gérer les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Laisser le navigateur gérer le défilement
          // e.preventDefault();
          // this.scrollToElement(targetElement);
        }
      });
    });
  }
  
  scrollToElement() {
    // Désactivé
  }
  
  setupScrollEvents() {
    // Désactivé temporairement
    // Laisser le défilement natif du navigateur
  }
  
  handleScroll() {
    // Conserver uniquement le suivi de la position de défilement
    // pour la mise en surbrillance des liens
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    this.highlightActiveLink();
  }
  
  highlightActiveLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }
  
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
          this.closeMobileMenu();
        }
      }, 250);
    });
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
});
