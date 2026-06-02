const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace hardcoded very dark background
        content = content.replace(/#060a13/g, '#050d1f');
        // Replace hardcoded dark card background
        content = content.replace(/#09101f/g, '#08152e');
        
        // Replace hardcoded rgb values for glows/shadows
        // old primary: rgb(207, 161, 91)
        // new primary: rgb(26, 58, 143)
        content = content.replace(/rgba\(207,\s*161,\s*91/g, 'rgba(26, 58, 143');
        content = content.replace(/rgba\(207,161,91/g, 'rgba(26,58,143');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
