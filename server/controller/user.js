const userDao = require('../daos/user')

// exports.index = async function (ctx) {
//     ctx.render('index.html');
// };

exports.userInfo = async function (ctx) {
    try {
        const users = await userDao.query({ id: token.uid });
        if (!users.length) {
            return ctx.body = {
                code: 1,
                message: '不存在该用户'
            };
        }
        ctx.body = {
            code: 0,
            message: '用户信息',
            data: users[0]
        };
    } catch (err) {
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
};
