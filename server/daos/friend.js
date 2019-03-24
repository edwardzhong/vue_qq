const exportFunctions = require('./exportDao');

module.exports = exportFunctions({
    sql: null,
    getFriends: 'select b.* from user_friend a join user b on a.friend_id = b.id where a.user_id = ?',
    addFriend: 'insert into user_friend set ?',
    remove: 'delete from user_friend where ?',
    getApply: 'select a.*,b.nick,b.avatar,b.email,b.signature,b.num from friend_apply a join user b on a.from_id = b.id where to_id = ? order by create_date desc',
    apply: 'insert into friend_apply set ?',
    reply: 'update friend_apply set ? where from_id = ? and to_id = ?'
});