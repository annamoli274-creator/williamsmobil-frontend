const fs = require('fs');
const path = require('path');
const file = 'src/lib/products.ts';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const goodArrayLines = lines.slice(492, 946); // Should contain export const products: Product[] = [ ... down to nomad-pure object without closing ];

const interfaceCode = `export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  gallery?: string[];
  description: string;
  features: string[];
  category: 'conteneur' | 'caravane' | 'mobile-home';
  specs: {
    dimensions?: string;
    weight?: string;
    payload?: string;
    material?: string;
    status?: string;
    colors?: string;
    area?: string;
    energy?: string;
    warranty?: string;
    capacity?: string;
  };
}

`;

const dir = 'public/images/caravane';
const subdirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const products = subdirs.map(subdir => {
  const imgDir = path.join(dir, subdir);
  const images = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
  return {
    id: 'caravane-' + subdir,
    title: 'Caravane Modèle ' + subdir.toUpperCase().replace('IMG', ''),
    price: 'Sur devis',
    image: '/images/caravane/' + subdir + '/' + images[0],
    gallery: images.map(img => '/images/caravane/' + subdir + '/' + img),
    description: 'Superbe caravane avec un design moderne et toutes les commodités nécessaires pour vos voyages.',
    features: ['Design moderne', 'Cuisine équipée', 'Espace optimisé', 'Facile à tracter'],
    category: 'caravane',
    specs: { dimensions: 'Standard', weight: 'Standard', capacity: '2-4 Personnes' }
  };
});

const newItemsStr = products.map(p => JSON.stringify(p, null, 4)).join(',\n  ');

const finalCode = interfaceCode + goodArrayLines.join('\n') + ',\n  ' + newItemsStr + '\n];\n';
fs.writeFileSync(file, finalCode);
console.log('Fixed');
