const { login, register, logout } = require('./controller/sign');
const { uploadFile } = require('./controller/file')
const { getInfo, apply, accept, reject, search, updateInfo, delFriend,getMsg } = require('./controller/user');

module.exports = function (router) {
    router
        .post('/login', login)
        .get('/logout', logout)
        .post('/register', register)
        .post('/upload', uploadFile)
        .get('/getinfo', getInfo)
        .post('/updateinfo', updateInfo)
        .post('/apply', apply)
        .post('/accept', accept)
        .post('/reject', reject)
        .get('/search', search)
        .post('/delfriend', delFriend)
        .get('/getmsg', getMsg)
};
