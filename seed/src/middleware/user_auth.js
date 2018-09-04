const passport = require('passport');
const BearerStrategy = require('passport-http-bearer');
const jwt = require('../lib/jwt');

module.exports = function(user) {
    passport.use('userAuth', new BearerStrategy(
        function(token, done) {
            let userId;
            jwt.verifyAsync(token).then(function(decoded) {
                userId = decoded.sub
                return user.existById(userId)
            }).then(function(exist) {
                if (exist) {
                    done(null, { id: userId })
                } else {
                    done(null, false)
                }
            }).catch(function(err) {
                console.log(err.stack)
                done(err)
            })
        }
    ))
    return passport.authenticate('userAuth', { session: false })
};