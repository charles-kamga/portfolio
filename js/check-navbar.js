/**
 * Vérifie si la navbar est présente sur la page et ajoute/supprime la classe 'navbar-visible' sur le body en conséquence
 */
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    document.body.classList.add('navbar-visible');
  } else {
    document.body.classList.remove('navbar-visible');
  }
});
