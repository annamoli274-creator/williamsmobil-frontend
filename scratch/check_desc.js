const fs = require('fs');
const content = fs.readFileSync('src/lib/products.ts', 'utf8');

// Parse the products array by evaluating or simple JSON match.
// Since it's a TS file with export, let's just match "title" and "description".
const titles = [...content.matchAll(/"title": "([^"]+)"/g)];
const descs = [...content.matchAll(/"description": "([^"]+)"/g)];

for (let i = 0; i < Math.min(titles.length, descs.length); i++) {
    console.log(titles[i][1] + ' -> ' + descs[i][1].substring(0, 50) + '...');
}
