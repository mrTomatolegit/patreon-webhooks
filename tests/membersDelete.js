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
    body: json,
    headers: {
        'x-patreon-event': 'members:delete',
        'x-patreon-signature': hexDigest,
        'content-type': 'application/json'
    }
}).then(res => {
    console.log(__filename);
    console.log(res.status);
});
