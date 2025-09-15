document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.01
    };

    // Callback pour l'Intersection Observer
    const onIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    // Créer un conteneur parent s'il n'existe pas
                    let container = img.parentElement;
                    
                    // Ajouter le skeleton loader
                    if (!container.classList.contains('has-loader')) {
                        container.classList.add('has-loader');
                        const loader = document.createElement('div');
                        loader.className = 'skeleton-loader';
                        container.insertBefore(loader, img);
                    }

                    // Charger l'image
                    const loadingImage = new Image();
                    loadingImage.src = src;
                    
                    loadingImage.onload = function() {
                        // Remplacer data-src par src
                        img.src = src;
                        img.style.opacity = '0';
                        
                        // Ajouter la classe loaded après un court délai pour permettre la transition
                        setTimeout(() => {
                            img.classList.add('loaded');
                            // Supprimer le skeleton après le chargement
                            const loader = container.querySelector('.skeleton-loader');
                            if (loader) {
                                setTimeout(() => {
                                    loader.style.opacity = '0';
                                    setTimeout(() => loader.remove(), 300);
                                }, 200);
                            }
                        }, 50);
                    };

                    loadingImage.onerror = function() {
                        console.error(`Erreur de chargement de l'image: ${src}`);
                        const loader = container.querySelector('.skeleton-loader');
                        if (loader) loader.remove();
                    };

                    // Ne plus observer cette image
                    observer.unobserve(img);
                }
            }
        });
    };

    // Initialiser l'Intersection Observer
    const observer = new IntersectionObserver(onIntersection, config);

    // Observer toutes les images avec data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        observer.observe(img);
    });

    // Fonction pour forcer le chargement d'une image
    window.loadImage = function(imgElement) {
        const src = imgElement.getAttribute('data-src');
        if (src) {
            imgElement.src = src;
            imgElement.classList.add('loaded');
        }
    };

    // Charger les images au survol sur les cartes (pour les appareils tactiles)
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function touchHandler() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight + 200) {
                    const src = img.getAttribute('data-src');
                    if (src && !img.src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                }
            });
            // Ne pas réécouter après le premier touch
            document.removeEventListener('touchstart', touchHandler);
        }, { once: true });
    }
});
