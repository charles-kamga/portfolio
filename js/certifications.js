document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('.certifications-grid');

  // If no container, we might not be on the certs page, stop.
  if (!gridContainer) return;

  const DATA_URL = 'assets/data/certifications.json';

  async function loadCertifications() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Erreur chargement certifications');

      const data = await response.json();

      // Sort by date descending (Newest first)
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

      renderCertifications(sortedData);
    } catch (error) {
      console.error('Erreur:', error);
      gridContainer.innerHTML = `<p style="color:red; text-align:center;">Impossible de charger les certifications.</p>`;
    }
  }

  function renderCertifications(certs) {
    gridContainer.innerHTML = certs.map(cert => createCertCard(cert)).join('');
  }

  function createCertCard(cert) {
    // Format Date
    const dateObj = new Date(cert.date);
    const dateStr = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate Skills HTML
    const skillsHtml = cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

    return `
    <div class="certification-card">
      <div class="certification-header">
        <div class="platform-logo">
          <i class="fas fa-certificate"></i>
        </div>
        <h3>${cert.title}</h3>
        <span class="issuer">${cert.issuer}</span>
      </div>
      <div class="certification-body">
        <div class="certificate-image">
          <!-- Image clickable to view full size -->
          <a href="assets/certifications/images/${cert.image || 'default.png'}" target="_blank" title="Voir l'image en grand">
            <img src="assets/certifications/images/${cert.image || 'default.png'}" 
                 alt="${cert.title}" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/400x300?text=Certificat'">
          </a>
        </div>
        <div class="certificate-details">
          <p class="date">
            <i class="far fa-calendar-alt"></i> 
            Obtenu le : ${dateStr}
          </p>
          <div class="skills-container">
            <i class="fas fa-tags"></i>
            <div class="skill-tags">
              ${skillsHtml}
            </div>
          </div>
          ${cert.url ? `
          <a href="${cert.url}" class="view-certificate" target="_blank">
            <i class="fas fa-check-circle"></i> Vérifier la certification
          </a>` : ''}
        </div>
      </div>
    </div>
    `;
  }

  loadCertifications();
});
