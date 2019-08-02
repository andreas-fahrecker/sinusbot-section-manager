const fs = require('fs');

const sourceContent = fs.readFileSync('src/sinusbot-section-manager.js', 'utf-8');
let transpiledContent = sourceContent;
const importScriptFunctions = sourceContent.match(/importScript\(('|")\S+('|")\);/g);
for (let i = 0; i < importScriptFunctions.length; i++) {
    const scriptToImportPath = importScriptFunctions[i].match(/('|").+('|")/g)[0].replace(/('|")/g, '');
    const scriptContent = fs.readFileSync(scriptToImportPath, 'utf-8')
        .replace(/import\s\S+\s\S+\s('|")\S+('|");/g, '')
        .replace(/export\sdefault\s/g, '');
    transpiledContent = transpiledContent.replace(importScriptFunctions[i], scriptContent);
}
fs.writeFileSync('sinusbot-section-manager.js', transpiledContent, {encoding: 'utf-8'});