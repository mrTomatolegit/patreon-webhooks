'use strict';
const fs = require('fs');

// CONFIG
const useStrict = true;
const tabSize = 4; // Keep this low
const dir = './';
const outputFile = 'index.js';
// END OF CONFIG

let txt = useStrict ? "'use strict';\n" : '';
txt = txt + 'module.exports = {\n';

const tab = ' '.repeat(tabSize); // The tab

// Get subdirs and remove non-directories
const folders = fs.readdirSync(dir).filter(f => fs.statSync(dir + f).isDirectory());
folders.forEach((folder, ifol) => {
    // The name of the parent folder
    const catName = folder.toUpperCase();

    const files = fs.readdirSync(dir + folder);

    // The comment to categorize the files
    txt = txt + `${ifol === 0 ? '' : '\n'}${tab}// ${catName}\n`;
    files.forEach((file, ifil) => {
        // The file name without the extension
        const fileName = file.split('.')[0];

        // Is the last file to parse?
        const isLast = ifol == folders.length - 1 && ifil == files.length - 1;

        txt = txt + `${tab}${fileName}: require('${dir}${folder}/${file}')${isLast ? '' : ','}\n`;
    });
});

// Add the closing bracket
txt = txt + '};\n';

fs.writeFileSync(outputFile, txt);
