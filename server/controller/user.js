const log = require('../common/logger')
const userDao = require('../daos/user')
const friendDao = require('../daos/friend')

// exports.index = async function (ctx) {
//     ctx.render('index.html');
// };

exports.userInfo = async function (ctx) {
    const { user_id } = ctx.request.body;
    try {
        const token = await ctx.verify();
        const users = await userDao.query({ id: user_id || token.uid })
        if (!users.length) {
            return ctx.body = {
                code: 2,
                message: '不存在该用户'
            };
        }
        ctx.body = {
            code: 0,
            message: '用户信息',
            data: users[0]
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}

exports.updateInfo = async function(ctx){
    const form = ctx.request.body;
    try{
        const token = await ctx.verify();
        const ret = await userDao.update([form,token.uid]);
        if(!ret.affectedRows){
            return ctx.body = {
                code: 2,
                message: '更新失败'
            };
        }
        ctx.body = {
            code: 0,
            message: '更新成功'
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}

exports.getInfo = async function (ctx) {
    try {
        const token = await ctx.verify();
        const [users, friends, applys] = await Promise.all([userDao.query({id:token.uid}), friendDao.getFriends([token.uid]), friendDao.getApply([token.uid])]);
        ctx.body = {
            code: 0,
            message: '好友列表',
            data: { user: users[0], friends, applys }
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}

exports.accept = async function (ctx) {
    const { friend_id } = ctx.request.body;
    try {
        const token = await ctx.verify();
        const ret = await friendDao.reply([{ status: 1 }, friend_id, token.uid]);
        if (!ret.affectedRows) {
            return ctx.body = {
                code: 2,
                message: '添加好友失败'
            };
        }
        const ret2 = await friendDao.addFriend({ user_id: token.uid, friend_id });
        if (!ret2.affectedRows) {
            return ctx.body = {
                code: 3,
                message: '添加好友失败'
            };
        }
        ctx.body = {
            code: 0,
            message: '添加好友成功'
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}

exports.reject = async function (ctx) {
    const form = ctx.request.body;
    try {
        const token = await ctx.verify();
        const ret = await friendDao.reply([form, friend_id, token.uid]);
        if (!ret.affectedRows) {
            return ctx.body = {
                code: 2,
                message: '操作失败'
            };
        }
        ctx.body = {
            code: 0,
            message: '操作成功'
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}

exports.search = async function (ctx) {
    const { kw } = ctx.query;
    try {
        const users = await userDao.sql(`select * from user where name like '${kw}%' or nick like '${kw}%' or cast(num as char) like '${kw}%'`);
        ctx.body = {
            code: 0,
            message: '操作成功',
            data: users
        };
    } catch (err) {
        log.error(err);
        ctx.body = {
            code: -1,
            message: '服务器错误',
            err: err
        };
    }
}