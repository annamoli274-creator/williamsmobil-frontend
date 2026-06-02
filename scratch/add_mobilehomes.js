const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.ts');
let productsContent = fs.readFileSync(productsFilePath, 'utf8');

const mobileHomeDir = path.join(process.cwd(), 'public', 'images', 'mobilehome');
const subdirs = fs.readdirSync(mobileHomeDir).filter(d => fs.statSync(path.join(mobileHomeDir, d)).isDirectory());

const mobileHomeData = {
  imga: {
    title: "Mobil-home Prestige - Villa d'Azur",
    price: "48 900 €",
    description: "Découvrez l'élégance ultime avec ce mobil-home spacieux doté d'une finition en bois noble, d'une grande terrasse intégrée et de baies vitrées inondant le salon de lumière naturelle. Conçu pour allier grand confort et modernité.",
    features: ["Châssis double essieu", "Isolation 4 saisons", "Cuisine américaine", "Double vitrage phonique"],
    specs: {
      area: "42 m²",
      energy: "A++",
      warranty: "10 Ans",
      capacity: "4-6 Personnes",
      status: "Neuf",
      colors: "Gris Anthracite & Bois"
    }
  },
  imgb: {
    title: "Mobil-home Lodge - Horizon Sauvage",
    price: "39 500 €",
    description: "Conçu pour s'intégrer harmonieusement dans les environnements forestiers ou côtiers. Ses larges ouvertures et son style scandinave offrent un refuge chaleureux et luxueux pour toute la famille.",
    features: ["Bardage bois naturel", "Poêle à granulés possible", "Meubles intégrés en chêne", "Éclairage LED basse consommation"],
    specs: {
      area: "36 m²",
      energy: "A+",
      warranty: "8 Ans",
      capacity: "4 Personnes",
      status: "Neuf",
      colors: "Chêne Clair & Blanc"
    }
  },
  imgc: {
    title: "Mobil-home Suite - Royal Comfort",
    price: "54 000 €",
    description: "L'excellence hôtelière chez vous. Ce modèle se distingue par sa suite parentale monumentale, sa salle de bain design avec douche italienne et ses finitions très haut de gamme pour des moments inoubliables.",
    features: ["Suite parentale XXL", "Douche à l'italienne", "Climatisation réversible", "Cuisine avec plan de travail en quartz"],
    specs: {
      area: "45 m²",
      energy: "A+++",
      warranty: "12 Ans",
      capacity: "2-4 Personnes",
      status: "Neuf",
      colors: "Marbre Blanc & Noir"
    }
  },
  imgd: {
    title: "Mobil-home Family - Espace & Partage",
    price: "46 500 €",
    description: "Le mobil-home familial idéal par excellence. Avec ses 3 chambres indépendantes et son salon central convivial, il offre à chaque membre de la famille son propre espace de confort et d'intimité.",
    features: ["3 chambres spacieuses", "Salon central panoramique", "Nombreux rangements astucieux", "Volets roulants dans les chambres"],
    specs: {
      area: "44 m²",
      energy: "A+",
      warranty: "10 Ans",
      capacity: "6-8 Personnes",
      status: "Neuf",
      colors: "Bleu Nuit & Blanc beige"
    }
  },
  imge: {
    title: "Mobil-home Tiny - Cocon Nordique",
    price: "32 900 €",
    description: "Un modèle ultra-compact mais ingénieux, optimisé pour offrir tout le confort d'un grand chez-soi dans un espace maîtrisé. Parfait pour les terrains intimistes ou les petits budgets exigeants.",
    features: ["Espace optimisé au millimètre", "Chauffage au sol ultra-fin", "Mobilier escamotable intelligent", "Grande verrière de toit"],
    specs: {
      area: "28 m²",
      energy: "A++",
      warranty: "10 Ans",
      capacity: "2 Personnes",
      status: "Neuf",
      colors: "Blanc Pur & Pin Nordique"
    }
  },
  imgf: {
    title: "Mobil-home Loft - Vue Panoramique",
    price: "58 900 €",
    description: "Vivez en communion avec la nature grâce à sa façade entièrement vitrée. Le salon cathédrale sous plafond rampant offre une sensation d'espace et de liberté incomparable et unique.",
    features: ["Façade vitrée panoramique", "Plafond cathédrale", "Cuisine équipée premium", "Terrasse surélevée optionnelle"],
    specs: {
      area: "48 m²",
      energy: "A+++",
      warranty: "15 Ans",
      capacity: "4 Personnes",
      status: "Neuf",
      colors: "Gris Quartz & Bois Exotique"
    }
  },
  imgg: {
    title: "Mobil-home Chalet - Tradition Bois",
    price: "42 000 €",
    description: "L'authenticité du chalet de montagne alliée au design contemporain d'un mobil-home moderne. Son isolation thermique renforcée vous garantit un confort douillet en toute saison, même en hiver.",
    features: ["Isolation renforcée laine de roche", "Style chalet de montagne", "Cuisine rustique chic", "Radiateurs connectés"],
    specs: {
      area: "38 m²",
      energy: "A++",
      warranty: "10 Ans",
      capacity: "4-6 Personnes",
      status: "Neuf",
      colors: "Mélèze Naturel"
    }
  },
  imgh: {
    title: "Mobil-home Urban - Studio Chic",
    price: "37 500 €",
    description: "Un design urbain et résolument moderne avec son bardage composite imitation métal et ses finitions intérieures épurées. L'habitat moderne nomade par excellence pour couple branché.",
    features: ["Bardage composite sans entretien", "Style industriel épuré", "Grand dressing intégré", "Espace bureau pour télétravail"],
    specs: {
      area: "34 m²",
      energy: "A+",
      warranty: "8 Ans",
      capacity: "2 Personnes",
      status: "Neuf",
      colors: "Gris Zinc & Métal Noir"
    }
  },
  imgi: {
    title: "Mobil-home Oasis - Esprit Nature",
    price: "49 900 €",
    description: "Conçu comme une oasis de fraîcheur et de sérénité, ce modèle intègre des matériaux biosourcés et un système de ventilation naturelle double flux pour un bien-être optimal au quotidien.",
    features: ["Matériaux écologiques biosourcés", "Ventilation double flux intégrée", "Douche avec mitigeur thermostatique", "Terrasse ombragée"],
    specs: {
      area: "40 m²",
      energy: "A++",
      warranty: "12 Ans",
      capacity: "4 Personnes",
      status: "Neuf",
      colors: "Vert Sauge & Chêne Massif"
    }
  },
  imgj: {
    title: "Mobil-home Exclusive - Villa Impériale",
    price: "64 900 €",
    description: "Le fleuron de notre gamme de mobil-homes. Une conception sur-mesure d'exception offrant un salon immense, deux salles de bains privatives et une autonomie énergétique remarquable.",
    features: ["Double salle de bains haut de gamme", "Autonomie solaire en option", "Cuisine en L avec îlot central", "Garantie constructeur étendue"],
    specs: {
      area: "52 m²",
      energy: "A+++",
      warranty: "15 Ans",
      capacity: "4-6 Personnes",
      status: "Neuf",
      colors: "Blanc Cendré & Noyer"
    }
  }
};

const newProducts = [];

for (const subdir of subdirs) {
  const data = mobileHomeData[subdir];
  if (!data) continue;

  const subdirPath = path.join(mobileHomeDir, subdir);
  const images = fs.readdirSync(subdirPath)
    .filter(f => f.match(/\.(jpe?g|png|webp|svg)$/i))
    .sort();

  if (images.length === 0) continue;

  const coverImage = `/images/mobilehome/${subdir}/${images[0]}`;
  const gallery = images.map(img => `/images/mobilehome/${subdir}/${img}`);

  newProducts.push({
    id: `mobile-home-${subdir}`,
    title: data.title,
    price: data.price,
    image: coverImage,
    gallery: gallery,
    description: data.description,
    features: data.features,
    category: "mobile-home",
    specs: data.specs
  });
}

console.log(`Generated ${newProducts.length} new products.`);

// Reconstruct products.ts
// First check if products.ts contains the closing "];" at the very end.
const trimmedContent = productsContent.trim();
if (!trimmedContent.endsWith('];')) {
  console.error("Error: products.ts does not end with '];'");
  process.exit(1);
}

// Find the last index of '];'
const lastClosingBracketIndex = trimmedContent.lastIndexOf('];');

// Let's format the new products into a beautiful TypeScript string
let productsString = '';
for (const p of newProducts) {
  productsString += ',\n  ' + JSON.stringify(p, null, 2).split('\n').join('\n  ');
}

const updatedContent = trimmedContent.substring(0, lastClosingBracketIndex) + productsString + '\n];\n';

fs.writeFileSync(productsFilePath, updatedContent, 'utf8');
console.log('Successfully updated src/lib/products.ts with new mobile home products!');
