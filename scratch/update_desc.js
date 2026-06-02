const fs = require('fs');

const file = 'src/lib/products.ts';
let content = fs.readFileSync(file, 'utf8');

const descriptions = [
  "Idéale pour les couples, cette caravane compacte offre une finition bois naturel chaleureuse, un éclairage LED intégré et une petite kitchenette fonctionnelle pour vos escapades en pleine nature.",
  "Modèle familial par excellence, cet espace de vie mobile propose une grande banquette convertible en U, des rangements astucieux et une décoration claire et lumineuse.",
  "Une véritable suite luxueuse sur roues. Ce modèle haut de gamme se distingue par ses matériaux premium, son espace douche séparé et sa literie digne d'un grand hôtel.",
  "Design minimaliste et grandes baies vitrées panoramiques. Cette caravane est conçue pour maximiser l'entrée de lumière naturelle et vous offrir une vue imprenable sur votre environnement.",
  "L'esprit vintage revisité : un extérieur au look rétro charmant abritant un intérieur ultra-moderne, équipé des dernières technologies domotiques et d'une climatisation silencieuse.",
  "Conçue pour l'autonomie, cette version inclut des panneaux solaires intégrés, une isolation thermique renforcée et des réservoirs grande capacité. Parfaite pour le hors-piste.",
  "Spacieuse et aérée, cette caravane mise sur un design contemporain avec des finitions en aluminium brossé, un grand lit central et une salle de bain ergonomique.",
  "La solution parfaite pour les amateurs de design scandinave. Un intérieur épuré, des tons pastel, et un espace de vie modulable selon vos envies du moment.",
  "Compacte mais redoutable, cette caravane ultra-légère est facile à tracter. Elle cache un intérieur intelligemment optimisé avec des meubles escamotables et une petite terrasse.",
  "Ce modèle mise sur le confort hivernal : double plancher chauffant, isolation extrême et ambiance chalet moderne avec ses revêtements texturés façon bois brut.",
  "L'élégance à l'état pur. Avec sa cuisine équipée (four, grand réfrigérateur, plaques induction) et son salon spacieux, elle remplace aisément une véritable maison de campagne.",
  "Orientée vers l'extérieur, elle dispose d'un auvent intégré sur mesure et d'une cuisine qui s'ouvre vers l'extérieur. Le choix idéal pour les vacances estivales au soleil.",
  "Une édition limitée offrant un mariage parfait entre robustesse tout-terrain et luxe intérieur. Cuir surpiqué, boiseries sombres et système multimédia haute définition."
];

const targetDesc = `"description": "Superbe caravane avec un design moderne et toutes les commodités nécessaires pour vos voyages.",`;

let count = 0;
while (content.includes(targetDesc) && count < descriptions.length) {
    content = content.replace(targetDesc, `"description": "${descriptions[count]}",`);
    count++;
}

fs.writeFileSync(file, content);
console.log('Updated ' + count + ' descriptions.');
