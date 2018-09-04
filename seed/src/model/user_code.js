const Redis = require('./redis');
class UserCode extends Redis {
    constructor() {
        super('U_C');
    }

    setCode(content, userAccount, expireSecond) {
        let pipeline = this.getDB().pipeline();
        return pipeline.hmset(`${this.KEYWORD}:${userAccount}`, content)
            .expire(`${this.KEYWORD}:${userAccount}`, expireSecond)
            .exec();
    }

    getCode(userAccount) {
        return this.getDB.hgetall(`${this.KEYWORD}:${userAccount}`);
    }
}

module.exports = UserCode;