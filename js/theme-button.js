// Inject a global theme toggle button into the navigation bar
(function () {
  if (document.getElementById('theme-toggle')) return; // avoid duplicates

  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.className = 'theme-toggle';
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Basculer le thème clair/sombre');

  const icon = document.createElement('span');
  icon.className = 'theme-icon';
  icon.textContent = '🌙';

  const text = document.createElement('span');
  text.className = 'theme-text';
  text.textContent = 'Mode sombre';

  btn.appendChild(icon);
  btn.appendChild(text);

  // Insert in the navigation bar next to the logo
  const insertThemeToggle = () => {
    const logo = document.querySelector('.logo');
    if (logo && logo.parentNode) {
      // Create a container for the theme toggle
      const themeContainer = document.createElement('div');
      themeContainer.className = 'theme-toggle-container';
      themeContainer.appendChild(btn);
      
      // Insert after the logo
      logo.parentNode.insertBefore(themeContainer, logo.nextSibling);
    } else {
      // Fallback to body if navigation bar isn't ready yet
      if (document.body) {
        document.body.appendChild(btn);
      } else {
        document.addEventListener('DOMContentLoaded', insertThemeToggle);
      }
    }
  };

  // Try to insert immediately, or wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertThemeToggle);
  } else {
    insertThemeToggle();
  }
})();
