const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const dataPath = path.join(__dirname, '../assets/certifications/data/certifications.json');
const outputPath = path.join(__dirname, '../certifications.html');
const templatePath = path.join(__dirname, 'templates/certifications-template.html');

// Lire les données des certifications
const certifications = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Générer le HTML pour une certification
function generateCertificationHTML(cert) {
  const skillsHTML = cert.skills.map(skill => 
    `<span class="skill-tag">${skill}</span>`
  ).join('\n');

  return `
    <div class="certification-card">
      <div class="certification-header">
        <div class="platform-logo">
          <i class="fas fa-${getIconForPlatform(cert.platform)}"></i>
        </div>
        <h3>${cert.title}</h3>
        <span class="issuer">${cert.issuer}</span>
      </div>
      <div class="certification-body">
        <div class="certificate-image">
          <img 
            src="./assets/certifications/images/${cert.image}" 
            alt="${cert.title} Certification"
            loading="lazy"
          >
        </div>
        <div class="certificate-details">
          <p class="date">
            <i class="far fa-calendar-alt"></i> 
            Date d'obtention : ${formatDate(cert.date)}
          </p>
          <div class="skills-container">
            <i class="fas fa-tags"></i>
            <div class="skill-tags">
              ${skillsHTML}
            </div>
          </div>
          <a 
            href="./assets/certifications/pdf/${cert.pdf}" 
            class="view-certificate" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <i class="fas fa-external-link-alt"></i> Voir le certificat PDF
          </a>
        </div>
      </div>
    </div>`;
}

// Obtenir l'icône appropriée pour la plateforme
function getIconForPlatform(platform) {
  const platformIcons = {
    'Coursera': 'graduation-cap',
    'Udemy': 'graduation-cap',
    'edX': 'university',
    'Google': 'google',
    'Microsoft': 'microsoft',
    'AWS': 'aws'
  };
  return platformIcons[platform] || 'certificate';
}

// Formater la date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Générer tout le contenu HTML
function generateHTML() {
  const certificationsHTML = certifications
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(cert => generateCertificationHTML(cert))
    .join('\n          ');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mes Certifications | Charles Kamga</title>
  <link rel="stylesheet" href="./css/base.css">
  <link rel="stylesheet" href="./css/certifications.css">
  <link rel="icon" href="./assets/images/les-iles-cook.png" type="image/png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <meta name="description" content="Mes certifications professionnelles - Développeur Web, Étudiant ICT, passionné d'IA et de cybersécurité.">
  <meta name="author" content="Charles Kamga">
</head>
<body>
  <a href="./skills.html" class="back-button">
    <i class="fas fa-arrow-left"></i>
    <span>Retour aux compétences</span>
  </a>
  
  <main class="certifications-container">
    <div class="content-wrapper">
      <section class="certifications-section">
        <h1><i class="fas fa-certificate"></i> Mes Certifications</h1>
        <div class="certifications-grid">
          ${certificationsHTML}
        </div>
      </section>
    </div>
  </main>

  <script src="./js/theme-button.js"></script>
  <script src="./js/theme.js"></script>
  <script src="./js/certifications.js"></script>
</body>
</html>`;
}

// Écrire le fichier HTML généré
fs.writeFileSync(outputPath, generateHTML().trim(), 'utf8');
console.log('Fichier certifications.html généré avec succès !');
