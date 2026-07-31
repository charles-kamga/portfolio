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
      container.innerHTML = `
        <div style="color:var(--text-muted); text-align:center; padding: 40px; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); margin: 20px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--accent-primary); margin-bottom: 15px;"></i>
          <p>Impossible de charger les accréditations localement.</p>
          <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">Note: Le chargement des données nécessite un serveur web (CORS). Une fois en ligne sur GitHub, vos certifications s'afficheront parfaitement !</p>
        </div>
      `;
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
      
      const scrollButtons = categoriesMap[cat].length > 3 ? `
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

    const imageName = cert.image || 'default.png';
    const baseName = imageName.substring(0, imageName.lastIndexOf('.')) || imageName;

    return `
    <article class="widget certification-card">
      <div class="cert-image-container">
        <picture>
          <source srcset="assets/certifications/images/${baseName}.webp" type="image/webp">
          <img src="assets/certifications/images/${imageName}" 
               alt="${cert.title}" 
               class="cert-thumbnail"
               loading="lazy"
               onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23111%22 width=%22400%22 height=%22300%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23666%22 font-family=%22sans-serif%22 font-size=%2216%22>Certificat</text></svg>'">
        </picture>
      </div>
      <div class="cert-content">
        <div class="cert-meta">
          <span class="issuer">${cert.issuer}</span>
          <span class="date">${dateStr}</span>
        </div>
        <h3>${cert.title}</h3>
        <div class="skill-tags">${skillsHtml}</div>
        ${cert.url ? `
        <a href="${cert.url}" class="view-cert-link" target="_blank" rel="noopener noreferrer">
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
