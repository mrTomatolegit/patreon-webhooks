'use strict';
const Base = require('./Base');
const Util = require('../util/Util');

const parseHandlers = {
    created: [Util.dateify, Util.isoify]
};

class User extends Base {
    constructor(hub, data) {
        super(hub, data, parseHandlers);
    }

    get campaign() {
        return this.hub.parse(this._relationships.campaign);
    }
}

module.exports = User;
