const bcrypt = require('bcryptjs');
const randomize = require('randomatic');
const moment = require('moment');
const jwt = require('../lib/jwt');
const TOKEN_TIME = '1d';
const TOKEN_ALGORITHM = 'HS256';
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const PHONE = 1;
// const EMAIL = 0;
const COMPANY = 'seed';

class UserService {

    /**
     * 根据原始密码生成salt和加密后的密码
     */
    async generatePassHashAndSalt(password) {
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(password, salt)
        return {
            salt: salt,
            password: hash
        }
    }

    /**
     * 检查密码是否匹配
     * @param  {string} passwordBefore [input password]
     * @param  {string} passwordAfter  [password in db]
     * @return boolean in promise    [match?true:false]
     */
    authenticate(passwordBefore, passwordAfter) {
        return bcrypt.compare(passwordBefore, passwordAfter);
    }

    async generateToken(id) {
        let payload = {
            "sub": id,
            "aud": 'seed',
            "iss": 'seed'
        }
        let options = {
            expiresIn: TOKEN_TIME,
            algorithm: TOKEN_ALGORITHM
        }
        let result = {}
        result.token = await jwt.signAsync(payload, options);
        result.refresh_token = randomize('Aa0', 16);
        result.refresh_token_expired_second = moment.duration(1, 'M').asSeconds();
        return result;
    }

    async generateConfirmation(queue, userCode, confirmTool) {
        let digit = randomize('0', 6);
        let account = confirmTool.account;
        let createTime = moment().format(TIME_FORMAT);
        let durationSecond = moment.duration(1, 'd').asSeconds();
        await userCode.setCode({ digit: digit, create_time: createTime }, account, durationSecond);
        let payload;
        let messagesList = [];

        //the format of kafka-queue messages shoud be a string or a collection of string.
        if (confirmTool.way === PHONE) {
            messagesList.push(JSON.stringify(this.generatePhoneMessage(confirmTool.phone, digit)))
            payload = [{
                topic: 'phone',
                messages: messagesList,
                partition: 0
            }]
        } else {
            messagesList.push(JSON.stringify(this.generateEmailMessage(confirmTool.email, digit)))
            payload = [{
                topic: 'email',
                messages: messagesList,
                partition: 0
            }]
        }

        await queue.send(payload);

    }

    generatePhoneMessage(phoneNum, digit) {
        let text = `[${COMPANY}] Your confirm digit number is ${digit}.`
        return { phone: phoneNum, text: text };
    }

    generateEmailMessage(email, digit) {
        //TODO: create a link for user to click;
        let text = `Your confirm digit is ${digit} .
        -- From ${COMPANY}`;
        return {
            email: email,
            title: `${COMPANY} confirm email`,
            text: text
        }
    }

}

module.exports = UserService;