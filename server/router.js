const { uploadFile } = require('./controller/file')
const { login, register } = require('./controller/sign')
const { apply, accept, acceptGroup, reject } = require('./controller/apply')
const { getInfo, updateInfo, delFriend, getMsg, search } = require('./controller/user')
const { addGroup, delGroup, updateGroup } = require('./controller/group')

module.exports = function (router) {
    router
        .post('/login', login)
        .post('/register', register)
        .post('/upload', uploadFile)
        .get('/getinfo', getInfo)
        .post('/updateinfo', updateInfo)
        .post('/apply', apply)
        .post('/accept', accept)
        .post('/acceptgroup', acceptGroup)
        .post('/reject', reject)
        .get('/search', search)
        .post('/delfriend', delFriend)
        .get('/getmsg', getMsg)
        .post('/addgroup', addGroup)
        .post('/delgroup', delGroup)
        .post('/updategroup', updateGroup)
};
