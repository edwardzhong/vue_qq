const { stringFormat } = require('../common/util')
const friendDao = require('../daos/friend')

exports.apply = async function (ctx) {
    const form = ctx.request.body;
    const token = await ctx.verify();
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
}

exports.accept = async function (ctx) {
    const { friend_id } = ctx.request.body;
    const token = await ctx.verify();
    const ret = await friendDao.reply([{ status: 1 }, friend_id, token.uid]);
    if (!ret.affectedRows) {
        return ctx.body = {
            code: 2,
            message: '添加好友失败'
        };
    }
    const addRet = await friendDao.sql(stringFormat("replace into user_friend values ('$1','$2'),('$2','$1')", token.uid, friend_id));
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
}

exports.reject = async function (ctx) {
    const { friend_id } = ctx.request.body;
    const token = await ctx.verify();
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

}