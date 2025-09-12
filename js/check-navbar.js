// Vérifie si la barre de navigation est en haut de la page et ajoute/supprime une classe en conséquence
function checkNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Écouteur d'événement pour le défilement
window.addEventListener('scroll', checkNavbar);

// Vérification initiale au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  checkNavbar();
  
  // Ajout d'une classe au body quand la page est chargée
  document.body.classList.add('page-loaded');
  
  // Animation d'entrée pour le contenu principal
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.style.opacity = '0';
    setTimeout(() => {
      mainContent.style.transition = 'opacity 0.5s ease-in-out';
      mainContent.style.opacity = '1';
    }, 100);
  }
});

// Gestion du chargement des images pour une meilleure performance
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialisation du chargement paresseux des images
document.addEventListener('DOMContentLoaded', lazyLoadImages);
