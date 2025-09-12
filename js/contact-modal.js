document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const modal = document.getElementById('contactModal');
  const btn = document.getElementById('contactBtn');
  const closeBtn = document.querySelector('.close');
  const form = document.getElementById('contactModalForm');
  const submitBtn = form ? form.querySelector('.submit-btn') : null;
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

  // Vérifier si les éléments existent avant d'ajouter les écouteurs
  if (!modal || !btn || !closeBtn || !form || !submitBtn || !btnText || !spinner) {
    console.error('Certains éléments du modal de contact sont manquants');
    return;
  }

  // Empêcher le défilement du fond quand le modal est ouvert
  function preventBodyScroll(prevent) {
    if (prevent) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  // Mettre à jour la hauteur maximale du modal en fonction du contenu
  function updateModalHeight() {
    if (!modal.classList.contains('show')) return;
    
    const header = document.querySelector('.modal-header');
    const modalBody = document.querySelector('.modal-body');
    const windowHeight = window.innerHeight;
    const headerHeight = header.offsetHeight;
    const maxBodyHeight = windowHeight - headerHeight - 80; // 80px de marge
    
    modalBody.style.maxHeight = `${maxBodyHeight}px`;
  }

  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', updateModalHeight);

  // Ouvrir le modal
  btn.addEventListener('click', () => {
    modal.classList.add('show');
    preventBodyScroll(true);
    updateModalHeight();
    // Focus sur le premier champ
    const firstInput = form.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
  });

  // Fermer le modal
  function closeModal() {
    modal.classList.remove('show');
    preventBodyScroll(false);
    // Réinitialiser le formulaire après l'animation
    setTimeout(() => {
      form.reset();
      // Supprimer les classes d'erreur
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      // Cacher le message de succès s'il est visible
      const successMsg = document.querySelector('.success-message');
      if (successMsg) {
        successMsg.style.display = 'none';
      }
      form.style.display = 'block';
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);

  // Fermer en cliquant en dehors du modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Validation du formulaire
  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMsg = formGroup.querySelector('.error-message');
    formGroup.classList.add('error');
    errorMsg.textContent = message;
    input.focus();
  }

  function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    formGroup.querySelector('.error-message').textContent = '';
  }

  // Validation de l'email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Gérer le défilement fluide vers les champs avec erreur
  function scrollToFirstError() {
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // Soumission du formulaire
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Réinitialiser les états précédents
      let isValid = true;
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Valider les champs
      const name = document.getElementById('modalName');
      const email = document.getElementById('modalEmail');
      const subject = document.getElementById('modalSubject');
      const message = document.getElementById('modalMessage');

      if (name.value.trim() === '') {
        showError(name, 'Le nom est requis');
        if (isValid) {
          isValid = false;
          // Faire défiler jusqu'au premier champ en erreur
          requestAnimationFrame(scrollToFirstError);
        }
      } else {
        showSuccess(name);
      }

      if (email.value.trim() === '') {
        showError(email, 'L\'email est requis');
        if (isValid) {
          isValid = false;
          requestAnimationFrame(scrollToFirstError);
        }
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Veuillez entrer un email valide');
        isValid = false;
      } else {
        showSuccess(email);
      }

      if (subject.value.trim() === '') {
        showError(subject, 'L\'objet est requis');
        if (isValid) {
          isValid = false;
          requestAnimationFrame(scrollToFirstError);
        }
      } else {
        showSuccess(subject);
      }

      if (message.value.trim() === '') {
        showError(message, 'Le message est requis');
        if (isValid) {
          isValid = false;
          requestAnimationFrame(scrollToFirstError);
        }
      } else {
        showSuccess(message);
      }

      if (!isValid) return;

      // Afficher l'état de chargement
      submitBtn.disabled = true;
      btnText.textContent = 'Envoi en cours...';
      spinner.style.display = 'block';

      try {
        // Remplacer par votre logique d'envoi
        // Exemple avec Formspree (à configurer avec votre propre ID)
        const response = await fetch('https://formspree.io/f/your-form-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value
          })
        });

        if (response.ok) {
          // Afficher le message de succès
          form.style.display = 'none';
          const successMsg = document.createElement('div');
          successMsg.className = 'success-message';
          successMsg.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; color: #2ecc71;"></i>
            <h3 style="margin-bottom: 0.5rem;">Message envoyé avec succès !</h3>
            <p>Je vous répondrai dès que possible.</p>
          `;
          form.parentNode.insertBefore(successMsg, form.nextSibling);
          
          // Fermer le modal après 3 secondes
          setTimeout(closeModal, 3000);
        } else {
          throw new Error('Erreur lors de l\'envoi du message');
        }
      } catch (error) {
        console.error('Error:', error);
        showError(submitBtn, 'Une erreur est survenue. Veuillez réessayer plus tard.');
      } finally {
        // Réinitialiser l'état du bouton
        submitBtn.disabled = false;
        btnText.textContent = 'Envoyer';
        spinner.style.display = 'none';
      }
    });
  }

  // Validation en temps réel avec défilement vers le champ en erreur
  const inputs = form ? form.querySelectorAll('input, textarea') : [];
  
  // Ajouter un gestionnaire pour le focus sur les champs en erreur
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup && formGroup.classList.contains('error')) {
        formGroup.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  });
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        showSuccess(input);
      }
    });
  });
});
