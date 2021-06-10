const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');

const json = fs.readFileSync('./member_data.json');
const hexDigest = crypto
    .createHmac('md5', '0219370182hd9821hd09823d039d2j032df92j')
    .update(json)
    .digest('hex');

fetch('http://localhost', {
    method: 'POST',
    body: json.toString().substr(50, json.length - 50),
    headers: {
        'x-patreon-event': 'members:create',
        'x-patreon-signature': hexDigest,
        'content-type': 'application/json'
    }
}).then(res => {
    console.log(__filename);
    console.log(res.status);
});
