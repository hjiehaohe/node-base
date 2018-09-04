const Redis = require('ioredis');
const config = require('../../config').app.redis;
let redis;

module.exports = function() {
    if (!redis) {
        redis = new Redis({
            port: config.port,
            host: config.host,
            family: config.family,
            db: config.db
        })
    }
    return redis;
};