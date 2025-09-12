document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-form-btn');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    let isFormVisible = false;

    // Fonction pour basculer l'affichage du formulaire
    function toggleForm() {
        isFormVisible = !isFormVisible;
        
        if (isFormVisible) {
            contactForm.style.display = 'block';
            // Forcer le recalcul du style pour activer la transition
            void contactForm.offsetHeight;
            contactForm.classList.add('visible');
            // Faire défiler jusqu'au formulaire
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            contactForm.classList.remove('visible');
            // Attendre la fin de l'animation avant de masquer complètement
            setTimeout(() => {
                if (!isFormVisible) {
                    contactForm.style.display = 'none';
                }
            }, 300);
        }
    }

    // Gestionnaire d'événement pour le bouton de bascule
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleForm();
        });
    }

    // Gestion de la soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Désactiver le bouton d'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            // Réinitialiser le statut
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }
            
            try {
                // Récupérer l'URL d'action du formulaire
                const formAction = this.getAttribute('action');
                
                // Vérifier que l'URL Formspree est configurée
                if (formAction.includes('YOUR_FORMSPREE_ID')) {
                    throw new Error('Veuvez configurer votre ID Formspree dans l\'attribut action du formulaire.');
                }
                
                // Préparer les données du formulaire
                const formData = new FormData(this);
                
                // Envoyer les données à Formspree
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                // Vérifier la réponse
                if (response.ok) {
                    // Afficher le message de succès
                    showStatus(' Merci, votre message a été envoyé !', 'success');
                    // Réinitialiser le formulaire
                    this.reset();
                    // Masquer le formulaire après un délai
                    setTimeout(() => {
                        toggleForm();
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Une erreur est survenue lors de l\'envoi du formulaire.');
                }
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                showStatus(` ${error.message || 'Une erreur est survenue, veuillez réessayer.'}`, 'error');
            } finally {
                // Réactiver le bouton d'envoi
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
    
    // Fonction pour afficher les messages de statut
    function showStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = 'form-status';
        formStatus.classList.add(type, 'visible');
        
        // Faire défiler jusqu'au message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Masquer le message après 5 secondes (sauf pour les erreurs)
        if (type !== 'error') {
            setTimeout(() => {
                formStatus.classList.remove('visible');
            }, 5000);
        }
    }
});
