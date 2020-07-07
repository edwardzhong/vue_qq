const mysql = require('mysql');
const { stringFormat } = require('../common/util');
const userDao = require('../daos/user');
const { getFriends } = require('../daos/friend');
const { getApply } = require('../daos/apply');
const { getGroup, getGroupUsers, getGroupMsg } = require('../daos/group');
const { getReads, clearRead, getUserMsg } = require('../daos/message');

// exports.index = async function (ctx) {
//     ctx.render('index.html');
// };

const formatTime = (i) => {
  const d = new Date(i.create_date * 1000),
    n = new Date(),
    day = n.getDate() - d.getDate(),
    date = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
  if (day == 0) {
    i.date = `${date}`;
  } else if (day == 1) {
    i.date = `昨天 ${date}`;
  } else {
    i.date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${date}`;
  }
  return i;
};

const mergeReads = (list, reads) => {
  return list.map((l) => {
    const obj = reads.find((r) => r.id == l.id);
    l.reads = obj ? obj.count : 0;
    return l;
  });
};

exports.getInfo = async function(ctx) {
  const token = await ctx.verify();
  const [users, friends, groups, applys, reads] = await Promise.all([
    userDao.getUser({ id: token.uid }),
    getFriends([token.uid]),
    getGroup([token.uid]),
    getApply([token.uid]),
    getReads([token.uid]),
  ]);

  const msgs = applys.map(formatTime);
  ctx.body = {
    code: 0,
    message: '好友列表',
    data: { user: users[0], friends: mergeReads(friends, reads), groups, msgs },
  };
};

exports.updateInfo = async function(ctx) {
  const form = ctx.request.body;
  const token = await ctx.verify();
  const ret = await userDao.update([form, token.uid]);
  if (!ret.affectedRows) {
    return (ctx.body = {
      code: 2,
      message: '更新失败',
    });
  }
  ctx.body = {
    code: 0,
    message: '更新成功',
  };
};

exports.getMsg = async function(ctx) {
  const { id, reads } = ctx.query;
  const { uid } = await ctx.verify();
  const list = await getUserMsg([id, uid, uid, id]);
  const msgs = list.map(formatTime).map((l) => {
    l.msg = l.content;
    l.self = l.send_id == uid;
    return l;
  });
  if (Number(reads)) {
    clearRead([uid, id]);
  }
  ctx.body = {
    code: 0,
    message: '消息列表',
    data: msgs,
  };
};

exports.getGroupInfo = async function(ctx) {
  const { id } = ctx.query;
  const { uid } = await ctx.verify();
  const [users, list] = await Promise.all([getGroupUsers([id]), getGroupMsg([id])]);
  const msgs = list.map(formatTime).map((l) => {
    l.msg = l.content;
    l.self = l.send_id == uid;
    return l;
  });
  ctx.body = {
    code: 0,
    message: '获取组信息成功',
    data: { users, msgs },
  };
};

exports.delFriend = async function(ctx) {
  const { friend_id } = ctx.request.body;
  const token = await ctx.verify();
  const sql = stringFormat( "delete from user_friend where user_id in ('$1','$2') and friend_id in ('$1','$2')", token.uid, friend_id, );
  const ret = await userDao.sql(sql);
  if (!ret.affectedRows) {
    return (ctx.body = {
      code: 2,
      message: '删除好友失败',
    });
  }
  ctx.body = {
    code: 0,
    message: '删除好友成功',
  };
};

exports.search = async function(ctx) {
  const { kw } = ctx.query;
  const k1 = mysql.escape(kw + '%'),
    k2 = mysql.escape('%' + kw + '%');
  const sql = stringFormat( 'select * from user where name like $1 or name like $2 or nick like $1 or nick like $2 or cast(num as char) like $1', k1, k2, );
  const gSql = stringFormat( 'select a.*,b.nick as create_name from `group` a left join `user` b on a.create_id = b.id where a.name like $1 or b.name like $2', k1, k2, );
  const [users, groups] = await Promise.all([userDao.sql(sql), userDao.sql(gSql)]);
  ctx.body = {
    code: 0,
    message: '搜索成功',
    data: { users, groups },
  };
};
