document.addEventListener('DOMContentLoaded', function() {
  // Gestion du menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const logoLink = document.querySelector('.logo a');

  // Fonction pour basculer le menu
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Mise à jour de l'attribut aria-expanded
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  }

  // Fermer le menu lors du clic sur un lien
  function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Événements
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Fermer le menu lors du clic sur un lien ou le logo
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  if (logoLink) {
    logoLink.addEventListener('click', closeMenu);
  }

  // Animation des barres de compétences
  function setupSkillsAnimation() {
    // Vérifier si IntersectionObserver est disponible
    if (!('IntersectionObserver' in window)) {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      document.querySelectorAll('.skill-level').forEach(level => {
        const width = level.textContent.trim();
        level.style.width = width;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const skillLevel = entry.target.querySelector('.skill-level');
        if (!skillLevel) return;
        
        const width = skillLevel.getAttribute('data-width');
        if (!width) return;
        
        if (entry.isIntersecting) {
          // Entrée dans la zone visible : animation vers la largeur cible
          skillLevel.style.transition = 'width 1.5s ease-in-out';
          setTimeout(() => {
            skillLevel.style.width = width;
          }, 50);
        } else {
          // Sortie de la zone visible : retour à zéro
          skillLevel.style.transition = 'width 0.5s ease-out';
          skillLevel.style.width = '0';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Initialiser chaque barre de compétence
    document.querySelectorAll('.skill-bar').forEach(bar => {
      const skillLevel = bar.querySelector('.skill-level');
      if (skillLevel) {
        const width = skillLevel.textContent.trim();
        skillLevel.setAttribute('data-width', width);
        skillLevel.style.width = '0';
        observer.observe(bar);
      }
    });
  }
  
  // Initialiser l'animation des compétences
  setupSkillsAnimation();

  // Fermer le menu lors du redimensionnement de la fenêtre
  let resizeTimer;
  window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 400);
  });


  // Fonction pour vérifier si un élément est visible à l'écran
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
  }

  // Fonction pour gérer l'animation des sections
  function handleScrollAnimation() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
      if (isInViewport(section)) {
        section.classList.add('visible');
      }
    });
  }

  // Écouteur d'événement pour le défilement
  window.addEventListener('scroll', handleScrollAnimation);
  
  // Vérifier les sections visibles au chargement de la page
  handleScrollAnimation();

  // Animation fluide pour les liens de navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // Gestion du thème
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Vérifier le thème sauvegardé ou la préférence système
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Basculer entre les thèmes
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  // Mettre à jour l'icône du thème
  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeIcon.style.transform = 'rotate(0deg)';
    } else {
      themeIcon.textContent = '🌙';
      themeIcon.style.transform = 'rotate(0deg)';
    }
  }

  // Écouter le clic sur le bouton de thème
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Détection de la visibilité des sections pour les animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Gestion du clic sur le bouton email
  document.getElementById('emailButton')?.addEventListener('click', function() {
    window.location.href = 'mailto:charleskamgapr@gmail.com';
    return false;
  });

  // Navigation fluide
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Ne pas intercepter les liens externes ou les liens mailto/tel
      if (this.getAttribute('href').startsWith('http') || 
          this.getAttribute('href').startsWith('mailto:') || 
          this.getAttribute('href').startsWith('tel:')) {
        return;
      }
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});
