const fs = require('fs');

const file = 'src/lib/products.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /"id":\s*"caravane-([^"]+)",\s*"title":\s*"[^"]+",([\s\S]*?)"gallery":\s*\[([\s\S]*?)\],\s*"description":\s*"[^"]+",\s*"features":\s*\[([\s\S]*?)\]/g;

let count = 0;
content = content.replace(regex, (match, subdir, middle, galleryStr) => {
    count++;
    const defaultTitle = 'Caravane Modèle ' + subdir.toUpperCase().replace('IMG', '');
    const defaultDesc = 'Superbe caravane avec un design moderne et toutes les commodités nécessaires pour vos voyages.';
    const defaultFeatures = '[\n        "Design moderne",\n        "Cuisine équipée",\n        "Espace optimisé",\n        "Facile à tracter"\n    ]';

    return `"id": "caravane-${subdir}",\n    "title": "${defaultTitle}",${middle}"gallery": [${galleryStr}],\n    "description": "${defaultDesc}",\n    "features": ${defaultFeatures}`;
});

fs.writeFileSync(file, content);
console.log('Reverted ' + count + ' products.');
