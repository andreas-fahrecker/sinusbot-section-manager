const fs = require('fs');
const path = require('path');

const sourceContent = fs.readFileSync('src/sinusbot-section-manager.js', 'utf-8');
let transpiledContent = sourceContent.replace(/import\s\S+\s\S+\s('|")\S+('|");?\s*\n/g, '');
const importClassFunctions = sourceContent.match(/importClass\(('|")\S+('|")\);?/g);
const importObjectFunctions = sourceContent.match(/importObject\(('|")\S+('|")\);?/g);

if (importClassFunctions !== null && Array.isArray(importClassFunctions)) {
    for (let i = 0; i < importClassFunctions.length; i++) {
        const scriptToImportPath = importClassFunctions[i].match(/('|").+('|")/g)[0].replace(/('|")/g, '');
        const scriptContent = fs.readFileSync(scriptToImportPath, 'utf-8')
            .replace(/import\s+\S+\s+\S+\s('|")\S+('|");?/g, '')
            .replace(/export\s+default\s+/g, '')
            .replace(/\n/g, '')
            .replace(/\s{2,}/g, ' ');
        transpiledContent = transpiledContent.replace(importClassFunctions[i], scriptContent);
    }
}

if (importObjectFunctions !== null && Array.isArray(importObjectFunctions)) {
    for (let i = 0; i < importObjectFunctions.length; i++) {
        const scriptToImportPath = importObjectFunctions[i].match(/('|").+('|")/g)[0].replace(/('|")/g, '');
        const scriptContent = fs.readFileSync(scriptToImportPath, 'utf-8')
            .replace(/import\s+\S+\s+\S+\s('|")\S+('|");?/g, '')
            .replace(/export\s+default\s+/g, '')
            .replace(/\n/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/^/g, 'const ' + path.basename(scriptToImportPath, path.extname(scriptToImportPath)) + ' = ');
        transpiledContent = transpiledContent.replace(importObjectFunctions[i], scriptContent);
    }
}

fs.writeFileSync('sinusbot-section-manager.js', transpiledContent, {encoding: 'utf-8'});