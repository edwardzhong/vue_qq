const exportFunctions = require('./exportDao');

module.exports = exportFunctions({
    sql: null,
    getFriends: 'select b.* from user_friend a join user b on a.friend_id = b.id where a.user_id = ?',
    addFriend: 'insert into user_friend set ?',
    remove: 'delete from user_friend where ?',
    getApply: 'select * from friend_apply where to_id = ?',
    apply: 'insert into friend_apply set ?',
    reply: 'update friend_apply set ? where from_id = ? and to_id = ?'
});