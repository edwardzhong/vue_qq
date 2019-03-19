const exportFunctions = require('./exportDao');

module.exports = exportFunctions({
    getFriends: 'select a.friend_id,b.* from user_friend a join user b on a.friend_id = b.id where a.user_id = ?',
    addFriend: 'insert into user_friend set ?',
    remove:'delete from user_friend where ?',
    apply: 'insert into friend_apply set ?',
    reply: 'update friend_apply set ?'
});