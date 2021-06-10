'use strict';
module.exports = {
    // HUB
    Hub: require('./hub/Hub.js'),

    // STRUCTURES
    Address: require('./structures/Address.js'),
    Base: require('./structures/Base.js'),
    Campaign: require('./structures/Campaign.js'),
    Member: require('./structures/Member.js'),
    PatreonAPIError: require('./structures/PatreonAPIError.js'),
    Reward: require('./structures/Reward.js'),
    User: require('./structures/User.js'),

    // UTIL
    Util: require('./util/Util.js')
};
