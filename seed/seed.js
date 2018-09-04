/* eslint no-global-assign: "off", no-console: "off" */

Promise = require('bluebird');
const express = require('express');
const app = express();
const config = require('./config');

//Lib


//Model
const User = require('./src/model/user');
const UserCode = require('./src/model/user_code');
const UserRefreshToken = require('./src/model/user_refresh_token');
const Producer = require('./src/model/producer');

//init Model
let user = new User();
let userCode = new UserCode();
let producer = new Producer();
let userRefreshToken = new UserRefreshToken();

//Middleware
const errorHandler = require('./src/middleware/error_handler');
const jsonParser = require('body-parser').json();
const cors = require('cors')();
const userAuth = require('./src/middleware/user_auth.js');

//Service
const UserService = require('./src/service/user_service.js');

//init Service
let userService = new UserService();

//Controller
const UserController = require('./src/controller/user_controller.js');

//init Controller
let userController = new UserController(user, userCode, userRefreshToken, userService);

//Router
const userRouter = require('./src/route/user_router.js');

// CORS pre-flight
app.options('*', cors);
app.use(cors);

//use kafka queue
app.locals.queue = producer;

app.get('/', (req, res) => {
    res.send("hello, seed.")
});

//use router
app.use('/users', userRouter(jsonParser, userAuth, userController));

//default error handler
app.use(errorHandler);

app.listen(config.app.port, function() {
    console.log('working');
})