const exportFunctions = require('./exportDao');

module.exports = exportFunctions({
    query: null,
    getUserMsg: 'select a.id,a.content,a.type,a.send_id,b.user_id,c.name,c.nick,c.avatar,a.is_read,FROM_UNIXTIME(a.create_date, \'%Y/%m/%d %h:%m:%s\')create_date from message a join user_message b on a.id = b.message_id left join user c on b.user_id = c.id where a.send_id in (?) and b.user_id in (?)',
    getGroupMsg: 'select a.id,a.content,a.type,a.send_id,b.group_id,c.name,c.group_avatar, FROM_UNIXTIME(a.create_date, \'%Y/%m/%d %h:%m:%s\')create_date from message a join group_message b on a.id = b.message_id left join group c on b.group_id = c.id where a.send_id = ? and b.group_id = ?',
    insertMsg: 'insert into message set ?',
    insertToUser :'insert into user_message set ?'
});