'use strict';
const https = require('https');
const Util = require('../util/Util');

const patreonTypes = ['Address', 'Campaign', 'Member', 'Reward', 'User'];

class Base {
    constructor(hub, data, parseHandlers = {}) {
        if (!data || typeof data !== 'object')
            throw new TypeError('`data` must be an object, given ' + typeof data);

        Object.defineProperties(this, {
            hub: {
                enumerable: false,
                configurable: true,
                writable: false,
                value: hub
            },
            _relationships: {
                enumerable: false,
                configurable: true,
                writable: false,
                value: {}
            },
            _parseHandlers: {
                enumerable: false,
                configurable: true,
                writable: false,
                value: parseHandlers
            }
        });

        this.attributes = {};

        this.parse(data);
    }

    get link() {
        return `https://www.patreon.com/api/${Base.resolveApiEndpoint(this.type)}/${this.id}`;
    }

    parse(data) {
        this.partial = !data.attributes;

        this.id = data.id;

        this.type = data.type;

        const attributes = data.attributes;
        if (attributes) {
            const newAttr = Util.camelCaseObject(attributes);
            for (let prop in newAttr) {
                const newValue = newAttr[prop];
                if (this._parseHandlers[prop]) {
                    const returned = this._parseHandlers[prop][0](newValue, this);
                    this.attributes[prop] = returned;
                } else {
                    this.attributes[prop] = newValue;
                }
            }
        }

        const relationships = data.relationships;
        if (relationships) {
            const newAttr = Util.camelCaseObject(relationships);
            for (let prop in newAttr) {
                const data = newAttr[prop].data;
                this._relationships[prop] = data;
            }
        }

        return this;
    }

    toJSON() {
        const json = {
            id: this.id,
            type: this.type,
            attributes: {},
            relationships: {}
        };

        const newAttr = Util.snakeCaseObject(this.attributes);
        for (let prop in newAttr) {
            const camelProp = Util.snakeToCamel(prop);
            const currentValue = newAttr[prop];
            if (this._parseHandlers[camelProp]) {
                const returned = this._parseHandlers[camelProp][1](currentValue, this);
                json.attributes[prop] = returned;
            } else {
                json.attributes[prop] = currentValue;
            }
        }

        const newRels = Util.snakeCaseObject(this._relationships);
        for (let prop in newRels) {
            const value = newRels[prop];
            const x = { data: value };

            if (value && !Array.isArray(value)) {
                x.links = {
                    related: `https://www.patreon.com/api/${Base.resolveApiEndpoint(value.type)}/${
                        value.id
                    }`
                };
            }
            json.relationships[prop] = value ? x : {};
        }

        return json;
    }

    static resolveApiEndpoint(type) {
        let endpoint = '';
        switch (type) {
            case 'user':
                endpoint = 'user';
                break;
            case 'address':
                endpoint = 'addresses';
                break;
            default:
                endpoint = type + 's';
        }
        return endpoint;
    }

    static resolveClass(hub, data) {
        const type = data.type;
        const className = Util.upperFirst(type);
        if (patreonTypes.includes(className)) {
            const relevantClass = require(`./${className}.js`);
            if (relevantClass) return new relevantClass(hub, data);
        } else return new Base(hub, data);
    }

    async fetch(cache = true) {
        return new Promise((resolve, reject) => {
            https.get(this.link, res => {
                let buff = Buffer.from('');
                res.on('data', chunk => {
                    buff = Buffer.concat([buff, chunk]);
                });
                res.on('error', e => {
                    reject(e);
                });
                res.on('end', () => {
                    const fetched = JSON.parse(buff.toString('utf-8'));
                    if (cache) return resolve(this.hub.parseApiResponse(fetched));
                    else return resolve(Base.resolveClass(fetched.data));
                });
            });
        });
    }
}

module.exports = Base;
