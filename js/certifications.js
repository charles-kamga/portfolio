document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.certifications-container');
  if (!container) return;

  const DATA_URL = 'assets/data/certifications.json';

  const categoryIcons = {
    "Cybersecurity": '<i class="fas fa-shield-alt" style="color: var(--accent-primary);"></i>',
    "Networks": '<i class="fas fa-network-wired" style="color: #4ade80;"></i>',
    "Systems": '<i class="fas fa-server" style="color: #fca5a5;"></i>',
    "Productivity": '<i class="fas fa-bolt" style="color: #fcd34d;"></i>'
  };

  async function loadCertifications() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Erreur chargement certifications');
      const data = await response.json();
      
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderCertifications(sortedData);
      setupZoomEffect();
      setupCarouselButtons();
    } catch (error) {
      console.error('Erreur:', error);
      container.innerHTML = `<p style="color:red; text-align:center;">Impossible de charger les certifications.</p>`;
    }
  }

  function renderCertifications(certs) {
    // Grouper par catégorie
    const categoriesMap = certs.reduce((acc, cert) => {
      const cat = cert.category || 'Autres';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(cert);
      return acc;
    }, {});

    // Définir un ordre d'affichage (Cybersecurity d'abord)
    const order = ["Cybersecurity", "Networks", "Systems", "Productivity", "Autres"];
    const orderedCategories = Object.keys(categoriesMap).sort((a, b) => {
      let indexA = order.indexOf(a);
      let indexB = order.indexOf(b);
      indexA = indexA === -1 ? 99 : indexA;
      indexB = indexB === -1 ? 99 : indexB;
      return indexA - indexB;
    });

    let html = '';
    orderedCategories.forEach(cat => {
      const icon = categoryIcons[cat] || '<i class="fas fa-certificate" style="color: var(--text-muted);"></i>';
      
      const scrollButtons = cat === 'Cybersecurity' ? `
        <div class="carousel-nav">
          <button class="scroll-btn left-btn" aria-label="Scroll Left" data-target="${cat}"><i class="fas fa-chevron-left"></i></button>
          <button class="scroll-btn right-btn" aria-label="Scroll Right" data-target="${cat}"><i class="fas fa-chevron-right"></i></button>
        </div>
      ` : '';

      html += `
        <section class="category-section" id="section-${cat}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 class="category-title" style="margin-bottom: 0;">${icon} ${cat}</h2>
            ${scrollButtons}
          </div>
          <div class="cert-carousel">
            ${categoriesMap[cat].map(cert => createCertCard(cert)).join('')}
          </div>
        </section>
      `;
    });

    container.innerHTML = html;
  }

  function createCertCard(cert) {
    const dateObj = new Date(cert.date);
    const dateStr = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    const skillsHtml = cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

    return `
    <article class="widget certification-card">
      <div class="cert-image-container">
        <img src="assets/certifications/images/${cert.image || 'default.png'}" 
             alt="${cert.title}" 
             class="cert-thumbnail"
             onerror="this.src='https://via.placeholder.com/400x300?text=Certificat'">
      </div>
      <div class="cert-content">
        <div class="cert-meta">
          <span class="issuer">${cert.issuer}</span>
          <span class="date">${dateStr}</span>
        </div>
        <h3>${cert.title}</h3>
        <div class="skill-tags">${skillsHtml}</div>
        ${cert.url ? `
        <a href="${cert.url}" class="view-cert-link" target="_blank">
          <i class="fas fa-external-link-alt"></i> Vérifier l'accréditation
        </a>` : ''}
      </div>
    </article>
    `;
  }

  function setupZoomEffect() {
    const overlay = document.getElementById('zoom-overlay');
    const zoomImg = document.getElementById('zoom-img');
    const certImages = document.querySelectorAll('.cert-thumbnail');
    let zoomTimeout;

    certImages.forEach(img => {
      img.addEventListener('mouseenter', () => {
        zoomTimeout = setTimeout(() => {
          zoomImg.src = img.src;
          overlay.classList.add('active');
          img.style.opacity = '0.3';
        }, 800); // Latence de 0.8s pour les certifs
      });

      img.addEventListener('mouseleave', () => {
        clearTimeout(zoomTimeout);
        overlay.classList.remove('active');
        img.style.opacity = '1';
      });
    });
  }

  function setupCarouselButtons() {
    const leftBtns = document.querySelectorAll('.left-btn');
    const rightBtns = document.querySelectorAll('.right-btn');

    leftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const section = document.getElementById(`section-${targetId}`);
        const carousel = section.querySelector('.cert-carousel');
        const scrollAmount = carousel.clientWidth * 0.8;
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    });

    rightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const section = document.getElementById(`section-${targetId}`);
        const carousel = section.querySelector('.cert-carousel');
        const scrollAmount = carousel.clientWidth * 0.8;
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    });
  }

  loadCertifications();
});
