const { userInfo } = require('./controller/user');
const { login, register, logout } = require('./controller/sign');

module.exports = function (router) {
    router
        .get('/userInfo', userInfo)
        .post('/login', login)
        .get('/logout', logout)
        .post('/register', register)
};
