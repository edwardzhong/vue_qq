const { transaction } = require('../daos/common')
const groupDao = require('../daos/group')

exports.addGroup = async function (ctx) {
    const { name } = ctx.request.body;
    const token = await ctx.verify();
    const ret = await groupDao.addGroup({ name: name, create_id: token.uid });
    if (!ret.affectedRows) {
        return ctx.body = {
            code: 2,
            message: '新增失败'
        };
    }
    await groupDao.addToUser([token.uid, ret.insertId]);
    ctx.body = {
        code: 0,
        message: '新增成功',
        data: ret.insertId
    };
}

exports.delGroup = async function (ctx) {
    const { id } = ctx.request.body;
    const ret = await transaction([
        ['delete from `group` where id = ?', [id]],
        ['delete from `user_group` where `group_id` = ?', [id]]
    ]);
    if (!ret[0].affectedRows || !ret[1].affectedRows) {
        return ctx.body = {
            code: 2,
            message: '删除组失败'
        };
    }
    ctx.body = {
        code: 0,
        message: '删除组成功'
    };
}

exports.updateGroup = async function (ctx) {
    const form = ctx.request.body;
    const id = form.id;
    delete form.id;
    const token = await ctx.verify();
    const ret = await groupDao.updateGroup([form, id, token.uid]);
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
}