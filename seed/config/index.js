/*eslint no-process-env: "off"*/

const _ = require('lodash');
let appRoute;

switch (process.env.NODE_ENV) {
    case 'production':
        {
            appRoute = './env/app.json';
            break;
        }
    case 'docker':
        {
            appRoute = './env/app_docker.json';
            break;
        }
    default:
        {
            appRoute = './env/app_dev.json';
            break;
        }
}

const app = require(appRoute);

let appConfig = {
    db: {
        host: app.db.host || "localhost",
        user: app.db.user,
        password: app.db.password || '',
        port: app.db.port || 3306,
        database: app.db.database || "db_seed",
        driver: app.db.driver
    },
    mongo: {
        hosts: app.mongo.hosts,
        user: app.mongo.user || '',
        password: app.mongo.password || '',
        database: app.mongo.database || '',
        options: app.mongo.options || ''
    },
    redis: {
        host: app.redis.host,
        port: app.redis.port,
        family: app.redis.family,
        db: app.redis.db
    },
    kafka: {
        zookeeper: app.kafka.zookeeper
    },
    port: app.port || 4000,
    secret: app.secret,
    user: app.user
}
module.exports = {
    app: _.clone(appConfig)
}