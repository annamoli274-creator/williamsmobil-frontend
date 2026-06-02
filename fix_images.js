const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.ts');
let productsContent = fs.readFileSync(productsFilePath, 'utf8');

const baseDir = path.join(process.cwd(), 'public', 'images', 'conteneur');
const dirs = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

for (const dir of dirs) {
  const images = fs.readdirSync(path.join(baseDir, dir)).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
  if (images.length === 0) continue;
  
  const mainImage = `/images/conteneur/${dir}/${images[0]}`;
  const gallery = images.map(img => `/images/conteneur/${dir}/${img}`);
  
  // Replace in content
  const idRegex = new RegExp(`"id": "conteneur-${dir}"([^}]*?)"image": "(.*?)"`, 's');
  productsContent = productsContent.replace(idRegex, (match, p1, p2) => {
    return `"id": "conteneur-${dir}"${p1}"image": "${mainImage}"`;
  });
  
  const galleryRegex = new RegExp(`"id": "conteneur-${dir}"([^}]*?)"gallery": \\[([^\\]]*)\\]`, 's');
  productsContent = productsContent.replace(galleryRegex, (match, p1, p2) => {
    return `"id": "conteneur-${dir}"${p1}"gallery": [\n      ` + gallery.map(g => `"${g}"`).join(',\n      ') + `\n    ]`;
  });
}

fs.writeFileSync(productsFilePath, productsContent);
console.log('Done');
