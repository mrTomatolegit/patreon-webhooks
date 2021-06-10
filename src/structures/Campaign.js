'use strict';
const Base = require('./Base');
const Util = require('../util/Util');

const parseHandlers = {
    createdAt: [Util.dateify, Util.isoify],
    publishedAt: [Util.dateify, Util.isoify]
};

class Campaign extends Base {
    constructor(hub, data) {
        super(hub, data, parseHandlers);
    }

    get creator() {
        return this.hub.parse(this._relationships.creator);
    }

    get goals() {
        return this._relationships.goals.map(x => this.hub.parse(x));
    }

    get rewards() {
        return this._relationships.rewards.map(x => this.hub.parse(x));
    }
}

module.exports = Campaign;
