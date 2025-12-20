document.addEventListener("DOMContentLoaded", () => {
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillCategories = document.querySelectorAll(".skill-category");

  if (!skillBars.length) return;

  // Ajouter un index à chaque catégorie pour l'animation en cascade
  skillCategories.forEach((category, index) => {
    category.style.setProperty('--index', index);
    
    // Ajouter un délai d'animation progressif aux compétences
    const skills = category.querySelectorAll('.skill');
    skills.forEach((skill, skillIndex) => {
      skill.style.animationDelay = `${skillIndex * 0.05}s`;
    });
  });

  // Fonction utilitaire pour récupérer la largeur cible
  function getTargetWidth(element) {
    const width = element.getAttribute("data-skill") ||
                  element.getAttribute("data-width") ||
                  element.textContent.trim();
    return width && !width.includes("%") ? width + "%" : width;
  }
  
  // Préparer les barres : toujours à 0% au départ
  skillBars.forEach(bar => {
    const level = bar.querySelector(".skill-level");
    if (level) {
      const width = getTargetWidth(level);
      if (width) {
        level.setAttribute("data-width", width);
        level.style.width = "0%";
        
        // Créer l'infobulle à partir de l'attribut data-description du parent .skill
        const skill = bar.closest('.skill');
        if (skill && skill.dataset.description) {
          const tooltip = document.createElement("span");
          tooltip.className = "skill-tooltip";
          tooltip.textContent = skill.dataset.description;
          skill.appendChild(tooltip);
        }
      }
    }
  });

  // Observer l'apparition des barres
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.querySelector(".skill-level");
        if (!level) return;

        const targetWidth = level.getAttribute("data-width");
        if (!targetWidth) return;

        // Lance l'animation une seule fois
        if (!level.hasAttribute("data-animated")) {
          level.setAttribute("data-animated", "true");
          
          // Délai progressif pour l'animation des barres basé sur la catégorie
          const category = entry.target.closest('.skill-category');
          const categoryIndex = category ? parseInt(category.style.getPropertyValue('--index') || 0) : 0;
          const delay = categoryIndex * 100;
          
          setTimeout(() => {
            requestAnimationFrame(() => {
              level.style.width = targetWidth;
              
              // Animation du pourcentage
              const percentElement = entry.target.closest('.skill').querySelector('.skill-percent');
              if (percentElement) {
                let current = 0;
                const target = parseInt(targetWidth);
                const duration = 1500; // 1.5s
                const stepTime = 20; // 20ms
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const animatePercent = () => {
                  current = Math.min(current + increment, target);
                  percentElement.textContent = `${Math.round(current)}%`;
                  
                  if (current < target) {
                    setTimeout(animatePercent, stepTime);
                  }
                };
                
                animatePercent();
              }
            });
          }, delay);
        }
      }
    });
  }, {
    threshold: 0.2, // Déclenche quand 20% de l'élément est visible
    rootMargin: '0px 0px -50px 0px' // Détecte un peu avant d'arriver à l'élément
  });

  // Appliquer l'observateur sur chaque barre
  skillBars.forEach(bar => {
    observer.observe(bar);
    
    // Animation au survol
    bar.addEventListener('mouseenter', () => {
      const level = bar.querySelector('.skill-level');
      if (level && level.hasAttribute('data-animated')) {
        level.style.transform = 'scaleY(1.3)';
        level.style.transition = 'transform 0.2s ease';
      }
    });
    
    bar.addEventListener('mouseleave', () => {
      const level = bar.querySelector('.skill-level');
      if (level) {
        level.style.transform = 'scaleY(1)';
      }
    });
  });
  
  // Animation des cartes au chargement
  const animateCategories = () => {
    skillCategories.forEach((category, index) => {
      setTimeout(() => {
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
      }, index * 100);
    });
  };
  
  // Démarrer l'animation après un court délai
  // Démarrer l'animation après un court délai
  setTimeout(animateCategories, 300);
});
