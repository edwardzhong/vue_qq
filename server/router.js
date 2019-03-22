const { login, register, logout } = require('./controller/sign');
const { uploadFile } = require('./controller/file')
const { userInfo, getInfo, accept, reject, search, updateInfo } = require('./controller/user');

module.exports = function (router) {
    router
        .post('/login', login)
        .get('/logout', logout)
        .post('/register', register)
        .post('/upload', uploadFile)
        .get('/userInfo', userInfo)
        .get('/getInfo', getInfo)
        .get('/accept', accept)
        .get('/reject', reject)
        .get('/search', search)
        .post('/updateInfo', updateInfo)
};
