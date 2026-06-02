const fs = require('fs');

const frFile = 'src/dictionaries/fr.json';
const enFile = 'src/dictionaries/en.json';
const productsFile = 'src/lib/products.ts';

// 1. Update dicts
let fr = JSON.parse(fs.readFileSync(frFile, 'utf8'));
let en = JSON.parse(fs.readFileSync(enFile, 'utf8'));

const newKeys = {
  "motorization": "Motorisation",
  "placesToVisit": "Nombre de lieux à visiter",
  "sleepingSpaces": "Nombre d'espaces de couchage",
  "totalLength": "Longueur totale (cm)",
  "externalWidth": "Largeur extérieure (cm)",
  "externalHeight": "Hauteur extérieure (cm)",
  "frontBedDimensions": "Dimensions du lit rabattable avant (cm)",
  "rearBedDimensions": "Dimensions du lit arrière (cm)"
};

const newKeysEn = {
  "motorization": "Motorization",
  "placesToVisit": "Places to visit",
  "sleepingSpaces": "Sleeping spaces",
  "totalLength": "Total length (cm)",
  "externalWidth": "External width (cm)",
  "externalHeight": "External height (cm)",
  "frontBedDimensions": "Front fold-down bed dimensions (cm)",
  "rearBedDimensions": "Rear bed dimensions (cm)"
};

Object.assign(fr.product_detail, newKeys);
Object.assign(en.product_detail, newKeysEn);

fs.writeFileSync(frFile, JSON.stringify(fr, null, 2));
fs.writeFileSync(enFile, JSON.stringify(en, null, 2));

// 2. Update products.ts
let content = fs.readFileSync(productsFile, 'utf8');

content = content.replace('capacity?: string;', `capacity?: string;
    motorization?: string;
    placesToVisit?: string;
    sleepingSpaces?: string;
    totalLength?: string;
    externalWidth?: string;
    externalHeight?: string;
    frontBedDimensions?: string;
    rearBedDimensions?: string;`);

const oldSpecs = `"specs": {
        "dimensions": "Standard",
        "weight": "Standard",
        "capacity": "2-4 Personnes"
    }`;

const newSpecs = `"specs": {
        "motorization": "Citroën 165 ch",
        "placesToVisit": "5",
        "sleepingSpaces": "5",
        "totalLength": "741",
        "externalWidth": "233",
        "externalHeight": "290",
        "frontBedDimensions": "200 x 140",
        "rearBedDimensions": "190 x 150"
    }`;

content = content.replaceAll(oldSpecs, newSpecs);

const nomadOld = `"specs": { "area": "24 m²", "energy": "Éco", "warranty": "10 Ans", "capacity": "2 Personnes" }`;
const nomadNew = `"specs": {
      "motorization": "Citroën 165 ch",
      "placesToVisit": "5",
      "sleepingSpaces": "5",
      "totalLength": "741",
      "externalWidth": "233",
      "externalHeight": "290",
      "frontBedDimensions": "200 x 140",
      "rearBedDimensions": "190 x 150"
    }`;
content = content.replace(nomadOld, nomadNew);

fs.writeFileSync(productsFile, content);
console.log('Success');
