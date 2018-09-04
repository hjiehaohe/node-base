const wrap = require('../lib/wrap');
const express = require('express');
let router = express.Router();

module.exports = function(jsonParser, userAuth, defaultController) {
    router.post('/register', jsonParser, wrap(defaultController.register))
    router.post('/login', jsonParser, wrap(defaultController.login))
        // router.get('/profile', userAuth, wrap(defaultController.getProfile))
    return router;
}