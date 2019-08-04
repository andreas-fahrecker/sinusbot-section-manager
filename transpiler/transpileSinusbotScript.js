const fs = require('fs');
const path = require('path');

/**
 * @returns {string}
 */
String.prototype.removeES6Module = function () {
    return this
        .replace(/import\s+(\w+|{(\s*\w+\s*,?)+})\s+from\s+(['"])\S+(['"]);?\s*\n/g, '')
        .replace(/export\s+default\s+/g, '');
};
/**
 * @returns {string}
 */
String.prototype.minify = function () {
    return this
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ');
};
/**
 * @returns {string}
 */
String.prototype.findPathOfFunction = function () {
    return this
        .match(/(['"]).+(['"])/g)[0]
        .replace(/(['"])/g, '');
};

const sourceContent = fs.readFileSync('src/main.js', 'utf-8');
let transpiledContent = sourceContent.removeES6Module();
const importClassFunctions = sourceContent.match(/importClass\((['"])\S+(['"])\);?/g);
const importObjectFunctions = sourceContent.match(/importObject\((['"])\S+(['"])\);?/g);

if (importClassFunctions !== null && Array.isArray(importClassFunctions)) {
    for (let i = 0; i < importClassFunctions.length; i++) {
        const classToImportPath = importClassFunctions[i].findPathOfFunction();
        const classContent = fs.readFileSync(classToImportPath, 'utf-8')
            .removeES6Module()
            .minify();
        transpiledContent = transpiledContent.replace(importClassFunctions[i], classContent);
    }
}

if (importObjectFunctions !== null && Array.isArray(importObjectFunctions)) {
    for (let i = 0; i < importObjectFunctions.length; i++) {
        const objectToImportPath = importObjectFunctions[i].findPathOfFunction();
        const objectContent = fs.readFileSync(objectToImportPath, 'utf-8')
            .removeES6Module()
            .minify()
            .replace(/^/g, 'const ' + path.basename(objectToImportPath, path.extname(objectToImportPath)) + ' = ');
        transpiledContent = transpiledContent.replace(importObjectFunctions[i], objectContent);
    }
}

fs.writeFileSync('sinusbot-section-manager.js', transpiledContent, {encoding: 'utf-8'});