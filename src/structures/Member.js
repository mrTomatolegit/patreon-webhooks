'use strict';
const Base = require('./Base');
const Util = require('../util/Util');

const parseHandlers = {
    accessExpiresAt: [Util.dateify, Util.isoify],
    lastChargeDate: [Util.dateify, Util.isoify],
    pledgeRelationshipStart: [Util.dateify, Util.isoify]
};

class Member extends Base {
    constructor(hub, data) {
        super(hub, data, parseHandlers);
    }

    get address() {
        return this.hub.parse(this._relationships.address);
    }

    get campaign() {
        return this.hub.parse(this._relationships.campaign);
    }

    get user() {
        return this.hub.parse(this._relationships.user);
    }
}

module.exports = Member;
