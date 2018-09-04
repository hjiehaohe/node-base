const redis = require('../lib/redis')();

class Redis {
    constructor(keyword) {
        this.KEYWORD = keyword;
    }

    getDB() {
        return redis;
    }

}

module.exports = Redis;