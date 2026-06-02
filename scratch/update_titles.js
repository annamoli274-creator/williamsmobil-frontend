const fs = require('fs');

const file = 'src/lib/products.ts';
let content = fs.readFileSync(file, 'utf8');

const caravaneUpdates = [
  {
    oldId: 'caravane-imagb',
    title: 'Caravane Horizon - Compact',
    features: ["Bois naturel", "Éclairage LED", "Kitchenette optimisée", "Idéal couple"]
  },
  {
    oldId: 'caravane-imga',
    title: 'Caravane Oasis - Family',
    features: ["Banquette en U", "Rangements XL", "Espace lumineux", "Famille nombreuse"]
  },
  {
    oldId: 'caravane-imgc',
    title: 'Caravane Stellar - Luxe',
    features: ["Matériaux premium", "Douche séparée", "Literie d'hôtel", "Finition luxe"]
  },
  {
    oldId: 'caravane-imgd',
    title: 'Caravane Lumina - Vision',
    features: ["Baies panoramiques", "Design minimaliste", "Puits de lumière", "Vue à 360°"]
  },
  {
    oldId: 'caravane-imge',
    title: 'Caravane Retro - Modern',
    features: ["Look vintage", "Domotique", "Climatisation silencieuse", "High-tech"]
  },
  {
    oldId: 'caravane-imgf',
    title: 'Caravane Terra - Off-Road',
    features: ["Panneaux solaires", "Autonomie", "Isolation renforcée", "Hors-piste"]
  },
  {
    oldId: 'caravane-imgg',
    title: 'Caravane Aérea - Space',
    features: ["Aluminium brossé", "Lit central", "Design aéré", "Salle de bain ergonomique"]
  },
  {
    oldId: 'caravane-imgh',
    title: 'Caravane Nordica - Pure',
    features: ["Design scandinave", "Tons pastel", "Espace modulable", "Épuré"]
  },
  {
    oldId: 'caravane-imgi',
    title: 'Caravane Aero - Lite',
    features: ["Ultra-légère", "Facile à tracter", "Meubles escamotables", "Petite terrasse"]
  },
  {
    oldId: 'caravane-imgj',
    title: 'Caravane Alpinia - Winter',
    features: ["Double plancher", "Chauffage", "Ambiance chalet", "Isolation extrême"]
  },
  {
    oldId: 'caravane-imgk',
    title: 'Caravane Elegance - Suite',
    features: ["Four intégré", "Plaques induction", "Salon spacieux", "Confort total"]
  },
  {
    oldId: 'caravane-imgl',
    title: 'Caravane Solaria - Summer',
    features: ["Auvent sur mesure", "Cuisine extérieure", "Aération max", "Spécial été"]
  },
  {
    oldId: 'caravane-imgm',
    title: 'Caravane Signature - Edition',
    features: ["Édition limitée", "Cuir surpiqué", "Multimédia HD", "Boiseries sombres"]
  }
];

// parse file into lines or replace by searching.
// We can parse the file into a JSON object? No, it's a TS file with export const...
// We can use regex to replace titles and features.
caravaneUpdates.forEach(update => {
  // Find the block for this id.
  const regex = new RegExp(`"id":\\s*"${update.oldId}",\\s*"title":\\s*"([^"]+)",([\\s\\S]*?)"features":\\s*\\[([^\\]]+)\\]`, 'g');
  
  content = content.replace(regex, (match, oldTitle, middle, oldFeatures) => {
    const newFeaturesStr = update.features.map(f => `"${f}"`).join(', ');
    return `"id": "${update.oldId}",\n    "title": "${update.title}",${middle}"features": [\n        ${newFeaturesStr}\n    ]`;
  });
});

fs.writeFileSync(file, content);
console.log('Success updating titles and features.');
