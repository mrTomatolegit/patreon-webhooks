'use strict';
const Util = require('../util/Util');
const Base = require('./Base');

const parseHandlers = {
    createdAt: [Util.dateify, Util.isoify],
    updatedAt: [Util.dateify, Util.isoify]
};

class Address extends Base {
    constructor(hub, data) {
        super(hub, data, parseHandlers);
    }
}

module.exports = Address;
