document.addEventListener('DOMContentLoaded', function() {
  // Configuration de l'Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Fonction de callback pour l'Intersection Observer
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Ne plus observer l'élément une fois qu'il est visible
        observer.unobserve(entry.target);
      }
    });
  };

  // Création de l'Intersection Observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Éléments à animer
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Observer chaque élément
  animatedElements.forEach((element, index) => {
    // Ajouter un délai progressif basé sur l'index
    element.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(element);
  });

  // Animation du bouton de retour en haut
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
