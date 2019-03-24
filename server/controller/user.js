var mysql = require('mysql');
const log = require('../common/logger')
const userDao = require('../daos/user')
const friendDao = require('../daos/friend')

// exports.index = async function (ctx) {
//     ctx.render('index.html');
// };

exports.userInfo = async function (ctx) {
    const { user_id } = ctx.request.body;
    const token = await ctx.verify();
    try {
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

exports.updateInfo = async function (ctx) {
    const form = ctx.request.body;
    const token = await ctx.verify();
    try {
        const ret = await userDao.update([form, token.uid]);
        if (!ret.affectedRows) {
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

const formatTime = i => {
    const d = new Date(i.create_date * 1000),
        n = new Date(),
        day = n.getDate() - d.getDate(),
        date = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
    if (day == 0) {
        i.date = `今天 ${date}`
    } else if (day == 1) {
        i.date = `昨天 ${date}`
    } else {
        i.date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${date}`
    }
    return i;
};

exports.getInfo = async function (ctx) {
    const token = await ctx.verify();
    try {
        const [users, friends, applys] = await Promise.all([userDao.query({ id: token.uid }), friendDao.getFriends([token.uid]), friendDao.getApply([token.uid])]);
        const msgs = applys.map(formatTime);
        ctx.body = {
            code: 0,
            message: '好友列表',
            data: { user: users[0], friends, msgs }
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

exports.apply = async function (ctx) {
    const form = ctx.request.body;
    const token = await ctx.verify();
    try {
        const ret = await friendDao.apply({ ...form, from_id: token.uid });
        if (!ret.affectedRows) {
            return ctx.body = {
                code: 2,
                message: '申请失败'
            };
        }
        ctx.body = {
            code: 0,
            message: '申请成功'
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
    const token = await ctx.verify();
    try {
        const ret = await friendDao.reply([{ status: 1 }, friend_id, token.uid]);
        if (!ret.affectedRows) {
            return ctx.body = {
                code: 2,
                message: '添加好友失败'
            };
        }
        const addRet = await friendDao.sql(`replace into user_friend values ('${token.uid}','${friend_id}'),('${friend_id}','${token.uid}')`);
        if (!addRet.affectedRows) {
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
    const { friend_id } = ctx.request.body;
    const token = await ctx.verify();
    try {
        const ret = await friendDao.reply([{ status: 2 }, friend_id, token.uid]);
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
        const k1 = mysql.escape(kw + '%'), k2 = mysql.escape('%' + kw + '%');
        const users = await userDao.sql(`select * from user where name like ${k1} or name like ${k2} or nick like ${k1} or nick like ${k2} or cast(num as char) like ${k1}`);
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