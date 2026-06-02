const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'images', 'mobilehome');
if (!fs.existsSync(dir)) {
  console.log('mobilehome directory not found at', dir);
  process.exit(1);
}

const subdirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
console.log('Found subdirectories:', subdirs);

for (const subdir of subdirs) {
  const subdirPath = path.join(dir, subdir);
  const files = fs.readdirSync(subdirPath).filter(f => f.match(/\.(jpe?g|png|webp|svg)$/i));
  console.log(`\nSubdirectory: ${subdir} (${files.length} images)`);
  files.forEach(f => console.log(`  - ${f}`));
}
