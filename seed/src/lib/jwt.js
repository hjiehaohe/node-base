const jwt = require('jsonwebtoken');
const SECRET = require('../../config').app.secret;
class JWT {

    static sign(payload, options, cb) {
        jwt.sign(payload, SECRET, options, cb);
    }

    static verify(token, cb) {
        let options = {};
        jwt.verify(token, SECRET, options, cb);
    }
}

module.exports = Promise.promisifyAll(JWT);