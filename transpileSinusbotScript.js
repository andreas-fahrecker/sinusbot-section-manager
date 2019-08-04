const fs = require('fs');
const path = require('path');

/**
 * @returns {string}
 */
String.prototype.removeES6ModuleAndMinify = function () {
    return this
        .replace(/import\s+\S+\s+\S+\s('|")\S+('|");?/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ');
};

const sourceContent = fs.readFileSync('src/sinusbot-section-manager.js', 'utf-8');
let transpiledContent = sourceContent.replace(/import\s\S+\s\S+\s('|")\S+('|");?\s*\n/g, '');
const importClassFunctions = sourceContent.match(/importClass\(('|")\S+('|")\);?/g);
const importObjectFunctions = sourceContent.match(/importObject\(('|")\S+('|")\);?/g);

if (importClassFunctions !== null && Array.isArray(importClassFunctions)) {
    for (let i = 0; i < importClassFunctions.length; i++) {
        const classToImportPath = importClassFunctions[i].match(/('|").+('|")/g)[0].replace(/('|")/g, '');
        const classContent = fs.readFileSync(classToImportPath, 'utf-8').removeES6ModuleAndMinify();
        transpiledContent = transpiledContent.replace(importClassFunctions[i], classContent);
    }
}

if (importObjectFunctions !== null && Array.isArray(importObjectFunctions)) {
    for (let i = 0; i < importObjectFunctions.length; i++) {
        const objectToImportPath = importObjectFunctions[i].match(/('|").+('|")/g)[0].replace(/('|")/g, '');
        const objectContent = fs.readFileSync(objectToImportPath, 'utf-8')
            .removeES6ModuleAndMinify()
            .replace(/^/g, 'const ' + path.basename(objectToImportPath, path.extname(objectToImportPath)) + ' = ');
        transpiledContent = transpiledContent.replace(importObjectFunctions[i], objectContent);
    }
}

fs.writeFileSync('sinusbot-section-manager.js', transpiledContent, {encoding: 'utf-8'});