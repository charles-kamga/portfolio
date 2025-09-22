const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Chemin du fichier à formater
const filePath = path.join(__dirname, '../certifications.html');

async function formatFile() {
  try {
    // Lire le fichier HTML
    const html = fs.readFileSync(filePath, 'utf8');

    // Formater le HTML avec Prettier
    const options = await prettier.resolveConfig(filePath);
    const formatted = await prettier.format(html, {
      ...options,
      parser: 'html',
      printWidth: 100,
      tabWidth: 2,
      htmlWhitespaceSensitivity: 'css',
    });

    // Écrire le fichier formaté
    fs.writeFileSync(filePath, formatted, 'utf8');
    console.log('Fichier HTML formaté avec succès !');
  } catch (err) {
    console.error('Erreur lors du formatage du fichier HTML :', err);
    process.exit(1);
  }
}

formatFile();
