const fs = require('fs');
const path = require('path');

const OLD_NUMBER = /\+33\s*1\s*23\s*45\s*67\s*89/g;
const NEW_NUMBER = '+34 610 70 69 19';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.json') || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        content = content.replace(OLD_NUMBER, NEW_NUMBER);
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
