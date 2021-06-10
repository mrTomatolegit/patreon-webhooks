const { Hub } = require('../src/index');

const hub = new Hub();

hub.auto('0219370182hd9821hd09823d039d2j032df92j').listen(80);

hub.on('all', (a, b) => {
    console.log(a.campaign.creator);
});
