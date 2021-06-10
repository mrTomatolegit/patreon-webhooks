'use strict';
const crypto = require('crypto');

class Util {
    constructor() {}

    /**
     *
     * @param {any} x
     * @param {object} toClass
     * @returns {toClass}
     */
    static toClassIfExists(x, toClass) {
        return x ? new toClass(x) : x;
    }

    /**
     *
     * @param {string} str
     * @returns {string}
     */
    static upperFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static dateify(dateString) {
        return Util.toClassIfExists(dateString, Date);
    }

    static isoify(date) {
        return date instanceof Date ? date.toISOString() : date;
    }

    static snakeToCamel(str) {
        return str
            .split('_')
            .map((x, i) => (i !== 0 ? Util.upperFirst(x) : x))
            .join('');
    }

    static patreonEventToCamel(str) {
        return str
            .split(':')
            .map((x, i) => (i !== 0 ? Util.upperFirst(x) : x))
            .join('');
    }

    static camelToSnake(str) {
        const finds = str.match(/[A-Z]/g);
        if (finds) {
            finds.forEach(find => {
                str = str.replace(find, `_${find.toLowerCase()}`);
            });
        }
        return str;
    }

    static camelCaseObject(obj) {
        let newObj = {};
        for (let prop in obj) {
            let val = obj[prop];
            if (typeof val === 'object' && !Array.isArray(val) && val !== null)
                val = Util.camelCaseObject(val);
            newObj[Util.snakeToCamel(prop)] = val;
        }
        return newObj;
    }

    static snakeCaseObject(obj) {
        let new_obj = {};
        for (let prop in obj) {
            if (typeof val === 'object' && !Array.isArray(val) && val !== null)
                val = Util.snakeCaseObject(val);
            new_obj[Util.camelToSnake(prop)] = obj[prop];
        }
        return new_obj;
    }

    static resolvePlural(str) {
        switch (str) {
            case 'address':
                str = 'addresses';
                break;
            default:
                str = `${str}s`;
        }
        return str;
    }

    static verifyPatreonIdentity(req, secret) {
        const hmac = crypto.createHmac('md5', secret);
        const hexDigest = hmac.update(req.body).digest('hex');

        if (hexDigest === req.headers['x-patreon-signature']) return true;
        else return false;
    }
}

module.exports = Util;
