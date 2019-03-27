const { exportDao } = require('./common');

module.exports = exportDao({
    sql: null,
    getFriends: 'select b.* from user_friend a join user b on a.friend_id = b.id where a.user_id = ?',
    addFriend: 'insert into user_friend set ?',
    delFriend: 'delete from user_friend where ? or ?'
});