document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return;
  }

  // Utility to apply reveal class based on data attributes
  const applyDataReveal = (el) => {
    const type = el.getAttribute('data-reveal'); // 'fade' | 'left' | 'right'
    const delay = el.getAttribute('data-reveal-delay'); // e.g., '200ms' or '0.2s'
    if (type) {
      const cls = type === 'left' ? 'reveal-left' : type === 'right' ? 'reveal-right' : 'reveal';
      el.classList.add(cls);
    }
    if (delay) {
      el.style.transitionDelay = delay;
    }
  };

  // Auto-targets across pages
  const autoTargets = [
    // Global common structures
    'header.navbar',
    '.nav-container',
    '.nav-link',
    'footer',
    // Sidebar and main layout
    '.profile-sidebar',
    '.nav-sidebar a',
    '.main-content',
    // Sections and headings
    'section',
    'section h1',
    'section h2',
    'section h3',
    'section p',
    // Lists and list items
    'ul li',
    // Buttons and links
    'a.btn, button, .btn',
    // Images/cards
    'img',
    '.card, .project, .certification-card, .skill-category',
    // Page-specific
    '.skills-header',
    '.skills-categories',
    '.skill-category .skill',
    '.projects-header',
    '.projects-grid .project',
    '.contact-container .social-section',
    '.contact-container .social-link',
    '.contact-form-section',
    '.certifications-section .certifications-grid',
    '.certification-card .certification-header',
    '.certification-card .certification-body',
  ];

  autoTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      // Respect explicit opt-out
      if (el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-delay')) {
        applyDataReveal(el);
      } else if (!el.classList.contains('reveal') &&
                 !el.classList.contains('reveal-left') &&
                 !el.classList.contains('reveal-right')) {
        // Alternate left/right for repeating items
        const isListItem = el.matches('li, .project, .skill-category .skill, .nav-sidebar a, .certification-card');
        if (isListItem) {
          el.classList.add(idx % 2 === 0 ? 'reveal-left' : 'reveal-right');
        } else {
          el.classList.add('reveal');
        }
      }
      // Stagger per selector group
      const delayMs = Math.min(idx * 70, 700);
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = `${delayMs}ms`;
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -12% 0px',
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
});
