const kafka = require('kafka-node');
const config = require('../../config').app.kafka;
const Producer = kafka.Producer;
let client = new kafka.Client(config.zookeeper);
let producer = new Producer(client);

function connect() {
    return new Promise(function(resolve, reject) {
        producer.on('ready', function() {
            resolve(producer);
        })
        producer.on('error', function(err) {
            reject(err);
        })
    })
}
module.exports = connect;