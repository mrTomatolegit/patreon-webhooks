const fs = require('fs');

const files = fs.readdirSync('./').filter(f => f.startsWith('members') && f.endsWith('.js'));

files.forEach(file => {
    require(`./${file}`);
});
