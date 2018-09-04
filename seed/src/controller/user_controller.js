const DefaultError = require('../lib/default_error.js');
const NEED_CONFIRM = require('../../config').app.user.confirm;
let user, userCode, userRefreshToken, userService;
// const PHONE = 1;
const EMAIL = 0;

class UserController {
    constructor(User, UserCode, UserRefreshToken, UserService) {
        user = User;
        userCode = UserCode;
        userRefreshToken = UserRefreshToken;
        userService = UserService;
    }

    async register(req, res) {
        let body = req.body;
        let { account, email } = body;
        let existOrNot = await user.findOne({ account: account, email: email });
        if (existOrNot) {
            throw new DefaultError('User with same account or email exists.', 400);
        }
        let { password, salt } = await userService.generatePassHashAndSalt(body.password);
        let insertResult = await user.insertOne({
            account: account,
            nickname: body.nickname,
            password: password,
            salt: salt,
            email: email,
            disable: false,
            delete: false,
            confirm: NEED_CONFIRM ? false : true
        })
        let _id = insertResult._id;
        let tokenObj = await userService.generateToken(_id);
        if (tokenObj.refresh_token) {
            await userRefreshToken.setToken(tokenObj.refresh_token, account, tokenObj.refresh_token_expired_second);
            delete tokenObj.refresh_token_expired_second;
        }
        if (NEED_CONFIRM) {
            let queue = req.app.locals.queue;
            //TODO: remove this to config
            let confirmTool = {
                account: account,
                way: EMAIL, // EMAIL or PHONE
                email: email,
                phone: body.phone
            }

            await userService.generateConfirmation(queue, userCode, confirmTool);
        }
        let result = {
            _id: _id,
            account: account,
            nickname: body.nickname
        }
        res.send(Object.assign(result, tokenObj));
    }

    async login(req, res) {
        let body = req.body;
        let whatever = body.account_email;
        let password = body.password;
        let userObj = await user.findOne({
            $or: [
                { email: whatever },
                { account: whatever }
            ]
        })
        if (!userObj) {
            throw new DefaultError('Account and password do not match', 404);
        }
        let compareResult = await userService.authenticate(password, userObj.password)
        if (!compareResult) {
            throw new DefaultError('Account and password do not match', 404);
        }
        let tokenObj = await userService.generateToken(userObj._id);
        if (tokenObj.refresh_token) {
            await userRefreshToken.setToken(tokenObj.refresh_token, userObj.account, tokenObj.refresh_token_expired_second);
            delete tokenObj.refresh_token_expired_second;
        }
        let result = {
            nickname: userObj.nickname,
            account: userObj.account,
            // email: userObj.email,
            _id: userObj._id
        }
        res.send(Object.assign(result, tokenObj));
    }
}
module.exports = UserController;