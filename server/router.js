const { login, register, logout } = require('./controller/sign');
const { uploadFile } = require('./controller/file')
const { userInfo } = require('./controller/user');

module.exports = function (router) {
    router
        .get('/userInfo', userInfo)
        .post('/login', login)
        .get('/logout', logout)
        .post('/register', register)
        .post('/upload', uploadFile)
};
