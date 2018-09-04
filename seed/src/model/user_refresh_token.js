const Redis = require('./redis');
class UserRefreshToken extends Redis {
    constructor() {
        super('U_R_T');
    }

    setToken(token, userAccount, expireSecond) {
        return this.getDB().set(`${this.KEYWORD}:${userAccount}`, token, 'EX', expireSecond);
    }

    getToken(userAccount) {
        return this.getDB().get(`${this.KEYWORD}:${userAccount}`);
    }
}

module.exports = UserRefreshToken;