#!/usr/bin/env node
/**
 * audit-portfolio.js
 * Script d'audit automatique du portfolio de Charles Kamga Mukam (Architecture Astro).
 * Vérifie :
 * 1. Présence et validité des pages HTML compilées dans dist/
 * 2. Résolution de tous les chemins d'assets locaux (images, scripts, CSS)
 * 3. Parité WebP pour chaque image PNG/JPG
 * 4. Intégrité et conformité des données certifications
 * 5. Présence des balises SEO indispensables (canonical, og:image, description)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "../../../..");
const DIST_DIR = path.join(ROOT_DIR, "dist");

// Si dist n'existe pas, on lance le build
if (!fs.existsSync(DIST_DIR)) {
  console.log("⚡ Compilation Astro requise avant audit...");
  execSync("npm run build", { cwd: ROOT_DIR, stdio: "inherit" });
}

const EXPECTED_ROUTES = [
  "index.html",
  "projects/index.html",
  "projects/darwinxshare/index.html",
  "projects/darwinx-video-pipeline/index.html",
  "projects/darwinx-neighbour/index.html",
  "projects/meetlocal/index.html",
  "certifications/index.html",
  "contact/index.html",
];

let errors = [];
let warnings = [];
let passes = [];

function checkFileExists(relPath, base = ROOT_DIR) {
  const fullPath = path.join(base, relPath);
  return fs.existsSync(fullPath);
}

console.log("====================================================");
console.log("   AUDIT AUTOMATIQUE DU PORTFOLIO (ASTRO SSG)");
console.log("====================================================\n");

// 1. Vérification des routes compilées
console.log("🔍 [1/4] Vérification des routes générées dans dist/...");
EXPECTED_ROUTES.forEach((route) => {
  if (checkFileExists(route, DIST_DIR)) {
    passes.push(`Route présente : /${route.replace("/index.html", "")}`);
  } else {
    errors.push(`Route compilée manquante dans dist/ : ${route}`);
  }
});

// 2. Vérification des données de certifications
console.log("🔍 [2/4] Contrôle des données certifications...");
const certsJsonPath = path.join(
  ROOT_DIR,
  "src/content/certifications/certifications.json",
);
if (fs.existsSync(certsJsonPath)) {
  try {
    const certs = JSON.parse(fs.readFileSync(certsJsonPath, "utf-8"));
    if (!Array.isArray(certs)) {
      errors.push("certifications.json doit contenir un tableau JSON.");
    } else {
      passes.push(`certifications.json valide (${certs.length} entrées).`);
      certs.forEach((cert, idx) => {
        if (
          !cert.id ||
          !cert.title ||
          !cert.issuer ||
          !cert.image ||
          !cert.url ||
          !cert.practicalNote
        ) {
          errors.push(
            `Certification ${idx} ("${cert.title || "Inconnue"}") : champ obligatoire ou practicalNote manquant.`,
          );
        }
        const imgClean = cert.image.replace(/^\//, "");
        if (!checkFileExists(imgClean, path.join(ROOT_DIR, "public"))) {
          errors.push(
            `Certification "${cert.title}" : image introuvable dans public/ (${imgClean})`,
          );
        }
      });
    }
  } catch (err) {
    errors.push(
      `Erreur de syntaxe JSON dans certifications.json : ${err.message}`,
    );
  }
} else {
  errors.push("Fichier certifications.json introuvable !");
}

// 3. Scan SEO et intégrité des assets dans les fichiers HTML de dist/
console.log(
  "🔍 [3/4] Analyse de l'intégrité des pages HTML et SEO dans dist/...",
);
EXPECTED_ROUTES.forEach((route) => {
  const filePath = path.join(DIST_DIR, route);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  // SEO & Open Graph
  if (!/<meta[^>]+name=["']description["']/i.test(content)) {
    warnings.push(`${route} : balise meta description absente.`);
  } else {
    passes.push(`${route} : meta description OK`);
  }

  if (!/<link[^>]+rel=["']canonical["']/i.test(content)) {
    warnings.push(`${route} : balise canonical absente.`);
  }

  if (!/<meta[^>]+property=["']og:image["']/i.test(content)) {
    warnings.push(`${route} : balise og:image absente.`);
  }

  // Contrôle des assets locaux
  const srcRegex = /(?:src|srcset)=["'](\/(?:assets|manifest)[^"'?#]+)/g;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    const rawAsset = match[1].replace(/&amp;/g, "&");
    const assetPath = path.join(DIST_DIR, rawAsset);
    if (!fs.existsSync(assetPath)) {
      errors.push(
        `${route} : asset local introuvable dans dist/ (${rawAsset})`,
      );
    }
  }
});

// 4. Parité WebP dans public/assets/
console.log("🔍 [4/4] Vérification de la parité WebP dans public/assets/...");
function scanImages(dir) {
  const fullDir = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullDir)) return;
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanImages(res);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const base = res.substring(0, res.lastIndexOf("."));
      const webp = `${base}.webp`;
      if (!checkFileExists(webp)) {
        warnings.push(`Image sans alternative WebP : ${res}`);
      } else {
        passes.push(`Parité WebP OK : ${entry.name}`);
      }
    }
  }
}
scanImages("public/assets");

// 5. Rapport de synthèse
console.log("\n====================================================");
console.log("               RÉSULTAT DE L'AUDIT                  ");
console.log("====================================================\n");

console.log(`✅ Validations réussies : ${passes.length}`);
if (warnings.length > 0) {
  console.log(`⚠️ Avertissements (${warnings.length}) :`);
  warnings.forEach((w) => console.log(`   - ${w}`));
}
if (errors.length > 0) {
  console.log(`❌ Erreurs bloquantes (${errors.length}) :`);
  errors.forEach((e) => console.log(`   - ${e}`));
  console.log(
    "\nÉchec de l'audit. Veuillez corriger les anomalies ci-dessus.\n",
  );
  process.exit(1);
} else {
  console.log(
    "\n🎉 Audit réussi avec 0 erreur bloquante ! Le portfolio Astro respecte tous les standards.\n",
  );
  process.exit(0);
}
