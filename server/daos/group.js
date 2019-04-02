const { exportDao } = require('./common');

module.exports = exportDao({
    sql: null,
    getGroup: 'select a.*,c.nick as create_name from `group` a join `user_group` b on a.id = b.group_id left join user c on a.create_id = c.id where b.user_id = ?',
    getGroupUsers: 'select a.* from `user` a join `user_group` b on a.id = b.user_id where b.group_id = ?',
    addGroup: 'insert into `group` set ?',
    addToUser: 'insert into `user_group` values (?,?)',
    delGroup: 'delete from `group` where id = ?',
    delUser: 'delete from `user_group` where user_id = ?',
    updateGroup: 'update `group` set ? where id = ? and create_id = ?',
    getGroupMsg : 'select a.id as message_id,a.content,a.type,a.send_id,a.group_id,a.create_date,b.* from `message` a join `user` b on a.send_id = b.id where a.group_id = ?'
});