// Nouvelle implémentation de la navigation mobile
class MobileNavigation {
  constructor() {
    this.navBar = document.createElement('nav');
    this.navBar.className = 'mobile-nav';
    this.navItems = [
      { icon: 'fas fa-home', text: 'Accueil', href: 'index.html' },
      { icon: 'fas fa-code', text: 'Compétences', href: 'skills.html' },
      { icon: 'fas fa-project-diagram', text: 'Projets', href: 'projects.html' },
      { icon: 'fas fa-envelope', text: 'Contact', href: 'contact.html' }
    ];
    
    this.init();
  }
  
  init() {
    this.createNavigation();
    this.setupEventListeners();
    this.highlightActiveLink();
  }
  
  createNavigation() {
    // Création de la barre de navigation
    const navContent = document.createElement('div');
    navContent.className = 'mobile-nav__content';
    
    // Ajout des éléments de navigation
    this.navItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'mobile-nav__link';
      link.innerHTML = `
        <i class="${item.icon}"></i>
        <span class="mobile-nav__text">${item.text}</span>
      `;
      navContent.appendChild(link);
    });
    
    this.navBar.appendChild(navContent);
    document.body.appendChild(this.navBar);
  }
  
  setupEventListeners() {
    // Ajout d'un effet de rétroaction au toucher
    const links = this.navBar.querySelectorAll('.mobile-nav__link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Animation de clic
        const circle = document.createElement('span');
        circle.className = 'ripple';
        link.appendChild(circle);
        
        // Supprimer l'effet après l'animation
        setTimeout(() => circle.remove(), 500);
      });
    });
  }
  
  highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = this.navBar.querySelectorAll('.mobile-nav__link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
          current = section.getAttribute('id');
        }
      }, 250);
    });
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Ancienne initialisation commentée
  // new NavigationManager();
  
  // Nouvelle initialisation de la navigation mobile
  if (window.innerWidth <= 768) {
    new MobileNavigation();
  }
  
  // Gestion du redimensionnement pour activer/désactiver la navigation mobile
  window.addEventListener('resize', () => {
    const mobileNav = document.querySelector('.mobile-nav');
    if (window.innerWidth <= 768 && !mobileNav) {
      new MobileNavigation();
    } else if (window.innerWidth > 768 && mobileNav) {
      mobileNav.remove();
    }
  });
});
