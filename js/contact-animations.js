
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

  // Animation du formulaire
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.classList.add('animate-on-scroll', 'slide-up');
  }

  // Animation du bouton de basculement du formulaire
  const toggleButton = document.getElementById('toggle-form-btn');
  if (toggleButton) {
    toggleButton.classList.add('animate-on-scroll', 'slide-up', 'delay-1');
  }

