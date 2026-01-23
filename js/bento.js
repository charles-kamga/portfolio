document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const widgets = document.querySelectorAll('.widget');

    // Handle Active State for Sidebar
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        const link = item.querySelector('a').getAttribute('href');
        if (link === currentPath || (currentPath === 'index.html' && link === '#accueil')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Fade-in effect for Widgets
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered effect
            }
        });
    }, observerOptions);

    widgets.forEach(widget => {
        widget.classList.add('fade-in');
        observer.observe(widget);
    });

    // Special case for smooth scroll on same page
    const anchorLinks = document.querySelectorAll('.nav-item a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Update active state
                navItems.forEach(i => i.classList.remove('active'));
                link.parentElement.classList.add('active');
            }
        });
    });
});
