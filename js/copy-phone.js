// Fonction pour copier le numéro de téléphone dans le presse-papier
function copyPhoneNumber() {
  const phoneNumber = '+237654175725';
  
  // Créer un élément temporaire pour la copie
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = phoneNumber;
  tempInput.select();
  
  try {
    // Exécuter la commande de copie
    const successful = document.execCommand('copy');
    const msg = successful ? 'Numéro copié !' : 'Échec de la copie';
    
    // Afficher un message de confirmation
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = msg;
    document.body.appendChild(notification);
    
    // Supprimer le message après 2 secondes
    setTimeout(() => {
      notification.remove();
    }, 2000);
    
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
  }
  
  // Nettoyer
  document.body.removeChild(tempInput);
}

// Ajouter l'événement de clic sur le numéro de téléphone
document.addEventListener('DOMContentLoaded', function() {
  const phoneLink = document.querySelector('a[href^="tel:"]');
  if (phoneLink) {
    // Empêcher l'ouverture du sélecteur de numéro sur mobile
    phoneLink.addEventListener('click', function(e) {
      e.preventDefault();
      copyPhoneNumber();
    });
    
    // Ajouter un titre pour l'accessibilité
    phoneLink.title = 'Copier le numéro';
  }
});
