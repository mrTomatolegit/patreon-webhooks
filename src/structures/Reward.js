'use strict';
const Util = require('../util/Util');
const Base = require('./Base');

const parseHandlers = {
    createdAt: [Util.dateify, Util.isoify],
    editedAt: [Util.dateify, Util.isoify],
    publishedAt: [Util.dateify, Util.isoify]
};

class Reward extends Base {
    constructor(hub, data) {
        super(hub, data, parseHandlers);
    }

    get campaign() {
        return this.hub.parse(this._relationships.campaign);
    }
}

module.exports = Reward;
