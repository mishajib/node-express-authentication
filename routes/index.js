const express                           = require('express');
const router                            = express.Router();
const indexController                   = require('../controllers/index.controller');
const registerController                = require('../controllers/register.controller');
const loginController                   = require('../controllers/login.controller');
const {validateRegister, validateLogin} = require('../requests/user.request');
const isAuthenticated                   = require('../middlewares/isAuthenticated.middleware');

const routes = (app) => {
    // GET - /
    router.get('/', indexController.home);
    router.get('/dashboard', isAuthenticated, indexController.dashboard);

    router.get('/register', registerController.index);
    router.post('/register', validateRegister, registerController.register);
    router.get('/login', loginController.index);
    router.post('/login', validateLogin, loginController.login);
    router.post('/logout', loginController.logout);

    app.use(router);
};

module.exports = routes;