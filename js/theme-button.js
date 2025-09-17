// Inject a global theme toggle button into the DOM so it's available on all pages
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

  // Insert near end of body to avoid overlaying initial loaders
  if (document.body) {
    document.body.appendChild(btn);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
  }
})();
