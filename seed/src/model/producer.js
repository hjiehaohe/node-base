const kafka = require('../lib/kafka');
class Producer {
    constructor() {
        this.conn = kafka();
    }

    send(payloads) {
        return this.conn.then(function(producer) {
            producer.sendAsync = Promise.promisify(producer.send, { context: producer });
            return producer.sendAsync(payloads);
        })
    }
}

module.exports = Producer;