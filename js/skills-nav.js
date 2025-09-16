document.addEventListener('DOMContentLoaded', () => {
  const PAGE_SIZE = 3;

  const categories = document.querySelectorAll('.skill-category');
  categories.forEach((category, catIndex) => {
    const skills = Array.from(category.querySelectorAll('.skill'));
    if (skills.length <= PAGE_SIZE) return; // Pas de pagination si <= 3

    // Créer un conteneur pour les skills paginés
    const listContainer = document.createElement('div');
    listContainer.className = 'skill-list';
    listContainer.setAttribute('role', 'list');

    // Déplacer les skills existants dans le conteneur
    skills.forEach(s => listContainer.appendChild(s));

    // Insérer le conteneur au bon endroit (après le titre h3 s'il existe)
    const title = category.querySelector('h3');
    if (title && title.nextSibling) {
      category.insertBefore(listContainer, title.nextSibling);
    } else {
      category.appendChild(listContainer);
    }

    // Créer les contrôles de navigation
    const controls = document.createElement('div');
    controls.className = 'skill-nav';
    controls.setAttribute('role', 'navigation');
    controls.setAttribute('aria-label', 'Pagination des compétences');

    const prevBtn = document.createElement('button');
    prevBtn.className = 'skill-nav-btn prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Précédent');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'skill-nav-btn next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Suivant');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';

    const dots = document.createElement('div');
    dots.className = 'skill-dots';
    dots.setAttribute('role', 'tablist');

    const totalPages = Math.ceil(skills.length / PAGE_SIZE);
    const dotButtons = [];
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'skill-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', 'false');
      dot.setAttribute('aria-controls', `skill-page-${catIndex}-${i}`);
      dot.setAttribute('title', `Aller à la page ${i + 1}`);
      dot.addEventListener('click', () => setPage(i));
      dots.appendChild(dot);
      dotButtons.push(dot);
    }

    const counter = document.createElement('span');
    counter.className = 'skill-counter';

    controls.appendChild(prevBtn);
    controls.appendChild(dots);
    controls.appendChild(counter);
    controls.appendChild(nextBtn);

    category.appendChild(controls);

    let currentPage = 0;

    function render() {
      // Masquer/Afficher les éléments
      skills.forEach((skill, idx) => {
        const pageIndex = Math.floor(idx / PAGE_SIZE);
        const inPage = pageIndex === currentPage;
        skill.classList.toggle('is-hidden', !inPage);
        skill.setAttribute('role', 'listitem');
        // ID pour aria-controls
        skill.id = `skill-page-${catIndex}-${pageIndex}-item-${idx % PAGE_SIZE}`;
      });

      // Etat des boutons
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === totalPages - 1;

      // Dots
      dotButtons.forEach((btn, i) => {
        const selected = i === currentPage;
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-selected', selected ? 'true' : 'false');
      });

      // Compteur
      counter.textContent = `${currentPage + 1} / ${totalPages}`;

      // Focus management: déplacer le focus sur le premier élément visible lors d'une navigation clavier
      const firstVisible = skills[currentPage * PAGE_SIZE];
      if (firstVisible) {
        // rien à focuser directement ici, mais on peut s'assurer de la visibilité pour l'IO
      }
    }

    function setPage(page) {
      if (page < 0 || page >= totalPages) return;
      currentPage = page;
      render();
    }

    prevBtn.addEventListener('click', () => setPage(currentPage - 1));
    nextBtn.addEventListener('click', () => setPage(currentPage + 1));

    // Navigation clavier pour les boutons
    controls.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPage(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPage(currentPage + 1);
      }
    });

    // Initialisation
    setPage(0);
  });
});
