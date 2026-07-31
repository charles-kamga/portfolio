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

    // Fade-in effect for Widgets using IntersectionObserver
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    }, observerOptions);

    widgets.forEach(widget => {
        widget.classList.add('fade-in');
        observer.observe(widget);
    });

    // Live System Clock Widget
    const timeDisplay = document.getElementById('live-time-display');
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeDisplay.textContent = timeString + ' (UTC+1)';
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Smooth scroll for internal hash links
    const anchorLinks = document.querySelectorAll('.nav-item a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                navItems.forEach(i => i.classList.remove('active'));
                link.parentElement.classList.add('active');
            }
        });
    });
});
