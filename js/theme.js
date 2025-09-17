// Gestion du thème clair/sombre (robuste à l'injection tardive du bouton)
let themeToggle;
let themeIcon;
let themeText;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateRefs() {
  themeToggle = document.getElementById('theme-toggle');
  themeIcon = document.querySelector('.theme-icon');
  themeText = document.querySelector('.theme-text');
}

// Fonction pour appliquer le thème
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeUI(theme);
}

// Fonction pour mettre à jour l'interface du thème
function updateThemeUI(theme) {
  if (!themeIcon || !themeText) {
    // Re-récupère les refs si elles n'existent pas encore (injection tardive)
    updateRefs();
  }
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
  // Met à jour les références et attache l'événement si présent
  updateRefs();
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  } else {
    // Observe l'apparition du bouton si injecté dynamiquement
    const observer = new MutationObserver(() => {
      updateRefs();
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        observer.disconnect();
      }
    });
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
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
