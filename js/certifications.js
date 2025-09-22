document.addEventListener('DOMContentLoaded', function() {
  // Sélection des éléments à animer
  const cards = document.querySelectorAll('.certification-card');
  
  // Fonction pour vérifier si un élément est dans le viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };

  // Fonction pour gérer l'animation des cartes
  const handleScrollAnimation = () => {
    cards.forEach((card, index) => {
      if (isInViewport(card) && !card.classList.contains('visible')) {
        // Ajoute la classe visible avec un délai progressif
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100);
      }
    });
  };

  // Observer les intersections avec le viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observer chaque carte
  cards.forEach(card => {
    observer.observe(card);
  });
  
  // Exécuter une première fois au chargement de la page
  handleScrollAnimation();

  // Animation au survol des boutons
  const buttons = document.querySelectorAll('.view-certificate, .back-button');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 7px 15px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // Effet de clic
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(1px)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px)';
    });
  });

  // Ajout d'un effet de chargement progressif pour les images
  const images = document.querySelectorAll('.certificate-image img');
  
  images.forEach(img => {
    // Ajouter une classe de chargement
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease-in-out';
    
    // Une fois l'image chargée, afficher avec un fondu
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
      
      // En cas d'erreur de chargement
      img.addEventListener('error', function() {
        this.style.opacity = '1';
        this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 300 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%231e293b\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'Arial\' font-size=\'14\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%23e2e8f0\'%3EImage non chargée%3C/text%3E%3C/svg%3E';
      });
    }
  });

  // Animation du titre principal
  const title = document.querySelector('.certifications-section h1');
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    setTimeout(() => {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }, 300);
  }
});
