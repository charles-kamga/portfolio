document.addEventListener("DOMContentLoaded", () => {
  const skillBars = document.querySelectorAll(".skill-bar");

  if (!skillBars.length) return;

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
        level.setAttribute("data-width", width); // garde la valeur cible
        level.style.width = "0%"; // démarre à zéro
      }
    }
  });

  // Observer l'apparition des barres
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const level = entry.target.querySelector(".skill-level");
      if (!level) return;

      const targetWidth = level.getAttribute("data-width");
      if (!targetWidth) return;

      if (entry.isIntersecting) {
        // Lance l’animation une seule fois
        if (!level.hasAttribute("data-animated")) {
          level.setAttribute("data-animated", "true");
          level.style.transition = "width 1.5s ease-in-out";
          requestAnimationFrame(() => {
            level.style.width = targetWidth;
          });
        }
      }
    });
  }, {
    threshold: 0.3, // déclenche quand ~30% de la barre est visible
  });

  // Appliquer l'observateur sur chaque barre
  skillBars.forEach(bar => observer.observe(bar));
});
