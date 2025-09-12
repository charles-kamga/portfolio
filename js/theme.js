// Gestion du thème clair/sombre
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Fonction pour appliquer le thème
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeUI(theme);
}

// Fonction pour mettre à jour l'interface du thème
function updateThemeUI(theme) {
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  if (themeText) {
    themeText.textContent = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
  }
}

// Vérifier le thème sauvegardé ou la préférence système
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = prefersDarkScheme.matches;
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(systemPrefersDark ? 'dark' : 'light');
  }
}

// Basculer entre les thèmes
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Initialisation du thème au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Gestion du thème
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Initialiser le thème
  initTheme();

  // Écouter les changements de préférence système (API moderne)
  if (typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  } else if (typeof prefersDarkScheme.addListener === 'function') {
    // Fallback pour anciens navigateurs
    prefersDarkScheme.addListener((e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
});
