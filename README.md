# Patreon Webhooks

A patreon webhook handler and cache manager

# Installation

```sh
npm i patreon-webhooks
```

# Example Usage

```js
const WEBHOOK_SECRET = 'insert webhook secret here';

const { Hub } = require('patreon-webhooks');
const hub = new Hub();

const express = require('express');
const app = express();

app.use('/webhooks/patreon', hub.webhooks(WEBHOOK_SECRET));

hub.on('memberCreate', member => console.log(member.id));

app.listen(80);
```

# License

This NPM module is under the MIT License\
Please refer yourself to the [LICENSE file](./LICENSE)
