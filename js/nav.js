/**
 * Fonction utilitaire pour limiter la fréquence d'exécution d'une fonction
 * @param {Function} fn - La fonction à exécuter
 * @param {number} limit - Délai minimum en millisecondes entre deux exécutions
 * @returns {Function} La fonction avec throttling
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Gestion de la navigation
function initNavigation() {
  // Éléments du DOM
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const menuToggle = navbar.querySelector('#menu-toggle');
  const navMenu = navbar.querySelector('#nav-menu');
  const navLinks = navbar.querySelectorAll('.nav-link');
  
  // Vérification des éléments requis
  if (!menuToggle || !navMenu) return;
  
  // Initialisation de l'état du menu
  let isMenuOpen = false;
  
  // Fonction pour ouvrir/fermer le menu mobile
  function toggleMenu(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    isMenuOpen = !isMenuOpen;
    
    // Mise à jour des classes et attributs
    menuToggle.classList.toggle('active', isMenuOpen);
    navMenu.classList.toggle('active', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    
    // Empêcher le défilement de la page lorsque le menu est ouvert
    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick, { capture: true, passive: true });
      document.addEventListener('keydown', handleEscapeKey, { passive: true });
    } else {
      removeEventListeners();
    }
  }
  
  // Fermer le menu lors d'un clic à l'extérieur
  function handleOutsideClick(event) {
    if (navMenu && !navMenu.contains(event.target) && 
        menuToggle && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  }
  
  // Fermer le menu avec la touche Échap
  function handleEscapeKey(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      closeMenu();
    }
  }
  
  // Nettoyage des écouteurs d'événements
  function removeEventListeners() {
    document.removeEventListener('click', handleOutsideClick, { capture: true });
    document.removeEventListener('keydown', handleEscapeKey);
  }
  
  // Fermer le menu
  function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    removeEventListeners();
  }
  
  // Gestion du défilement de la page avec throttling
  const handleScroll = throttle(() => {
    if (!navbar) return;
    
    const shouldScrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', shouldScrolled);
  }, 100);
  
  // Gestion du redimensionnement de la fenêtre avec debounce
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 1024 && isMenuOpen) {
        closeMenu();
      }
    }, 100);
  }
  
  // Initialisation des attributs ARIA
  function initAria() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    menuToggle.setAttribute('aria-label', 'Menu de navigation');
    menuToggle.setAttribute('role', 'button');
    
    navMenu.setAttribute('aria-hidden', 'true');
    navMenu.setAttribute('role', 'navigation');
    
    navLinks.forEach((link, index) => {
      link.setAttribute('tabindex', isMenuOpen ? '0' : '-1');
      link.setAttribute('role', 'menuitem');
    });
  }
  
  // Mise à jour de l'accessibilité lors de l'ouverture/fermeture du menu
  function updateAria() {
    navMenu.setAttribute('aria-hidden', String(!isMenuOpen));
    navLinks.forEach(link => {
      link.setAttribute('tabindex', isMenuOpen ? '0' : '-1');
    });
    
    // Gestion du focus
    if (isMenuOpen) {
      // Déplacer le focus vers le premier élément du menu
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      // Restaurer le focus sur le bouton du menu
      menuToggle.focus();
    }
  }
  
  // Ajout des écouteurs d'événements
  menuToggle.addEventListener('click', toggleMenu, { passive: true });
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu, { passive: true });
    link.addEventListener('keydown', (e) => {
      // Navigation au clavier dans le menu
      if (e.key === 'Escape') {
        closeMenu();
      } else if (e.key === 'Tab' && isMenuOpen) {
        const menuItems = Array.from(navMenu.querySelectorAll('a'));
        const firstItem = menuItems[0];
        const lastItem = menuItems[menuItems.length - 1];
        
        if (e.shiftKey && document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    });
  });
  
  // Gestion du défilement et du redimensionnement
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Initialisation
  initAria();
  handleScroll();
  
  // Exposer les méthodes pour une utilisation externe si nécessaire
  return {
    open: () => !isMenuOpen && toggleMenu(),
    close: closeMenu,
    toggle: toggleMenu
  };
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', initNavigation);
