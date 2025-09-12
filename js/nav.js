// Gestion du menu de navigation mobile
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Basculer le menu mobile
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // Fermer le menu mobile lors du clic sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  });

  // Fermer le menu lors du redimensionnement de la fenêtre
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      if (navMenu) navMenu.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });

  // Ajout de la classe active au chargement de la page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage.includes(linkHref.replace('.html', '')) && linkHref !== 'index.html')) {
      link.classList.add('active');
    }
  });
});

// Gestion du défilement fluide pour les ancres
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajustement pour la hauteur du header
          behavior: 'smooth'
        });
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', smoothScroll);
