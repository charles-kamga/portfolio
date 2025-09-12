// document.addEventListener('DOMContentLoaded', function() {
  // Gestion du menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const logoLink = document.querySelector('.logo a');

  // Fonction pour basculer le menu
  function toggleMenu() {
    if (!menuToggle) return;
    menuToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Mise à jour de l'attribut aria-expanded
    if (menuToggle) {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    }
  }

  // Fermer le menu lors du clic sur un lien
  function closeMenu() {
    if (!menuToggle) return;
    menuToggle.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Événements du menu
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

  // Initialiser l'animation des compétences
  setupSkillsAnimation();

  // Gestion du redimensionnement de la fenêtre
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

  // Détection de la visibilité des sections pour les animations
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  // Observer les sections
  document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
  });
//   let resizeTimer;
//   window.addEventListener('resize', () => {
//     document.body.classList.add('resize-animation-stopper');
//     clearTimeout(resizeTimer);
//     resizeTimer = setTimeout(() => {
//       document.body.classList.remove('resize-animation-stopper');
//       if (window.innerWidth > 768) {
//         closeMenu();
//       }
//     }, 400);
//   });

//   // Détection de la visibilité des sections pour les animations
//   const sectionObserver = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('visible');
//       }
//     });
//   }, {
//     threshold: 0.1
//   });

//   // Observer les sections
//   document.querySelectorAll('.section').forEach(section => {
//     sectionObserver.observe(section);
//   });

//   // Gestion du clic sur le bouton email
//   document.getElementById('emailButton')?.addEventListener('click', function() {
//     window.location.href = 'mailto:charleskamgapr@gmail.com';
//     return false;
//   });

//   // Navigation fluide
//   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//       // Ne pas intercepter les liens externes ou les liens mailto/tel
//       if (this.getAttribute('href').startsWith('http') || 
//           this.getAttribute('href').startsWith('mailto:') || 
//           this.getAttribute('href').startsWith('tel:')) {
//         return;
//       }
      
//       e.preventDefault();
//       const targetId = this.getAttribute('href');
//       if (targetId === '#') return;
      
//       const targetElement = document.querySelector(targetId);
//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.offsetTop - 70,
//           behavior: 'smooth'
//         });
//       }
//     });
//   });
// });

// /**
//  * Animation des barres de compétences
//  * Utilise IntersectionObserver pour animer la largeur des barres
//  * lorsque celles-ci entrent dans la zone visible de l'écran.
//  */
// function setupSkillsAnimation() {
//   // Fonction utilitaire pour récupérer la largeur d'une compétence
//   function getSkillWidth(element) {
//     const width = element.getAttribute('data-skill') || 
//                  element.textContent.trim() ||
//                  element.getAttribute('data-width');
//     return width && !width.includes('%') ? width + '%' : width;
//   }

//   // Vérifier si la page contient des compétences
//   const skillBars = document.querySelectorAll('.skill-bar');
//   if (!skillBars.length) return;

//   // Fallback pour les navigateurs sans IntersectionObserver
//   if (!('IntersectionObserver' in window)) {
//     skillBars.forEach(bar => {
//       const level = bar.querySelector('.skill-level');
//       if (level) {
//         const width = getSkillWidth(level);
//         if (width) level.style.width = width;
//       }
//     });
//     return;
//   }

//   // Configuration de l'observateur
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       const level = entry.target.querySelector('.skill-level');
//       if (!level) return;
      
//       const width = level.getAttribute('data-width');
//       if (!width) return;
      
//       if (entry.isIntersecting) {
//         if (!level.hasAttribute('data-animated')) {
//           level.setAttribute('data-animated', 'true');
//           level.style.transition = 'width 1.5s ease-in-out';
//           requestAnimationFrame(() => level.style.width = width);
//         }
//       } else if (entry.boundingClientRect.top > 0) {
//         level.removeAttribute('data-animated');
//         level.style.transition = 'width 0.5s ease-out';
//         level.style.width = '0%';
//       }
//     });
//   }, {
//     threshold: 0.2,
//     rootMargin: '0px 0px -50px 0px'
//   });

//   // Initialisation des barres de compétences
//   skillBars.forEach(bar => {
//     const level = bar.querySelector('.skill-level');
//     if (level) {
//       const width = getSkillWidth(level);
//       if (width) {
//         level.setAttribute('data-width', width);
//         level.style.width = '0%';
//         level.style.transition = 'none';
//         observer.observe(bar);
//       }
//     }
//   });
// }
