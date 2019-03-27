const { exportDao } = require('./common');

module.exports = exportDao({
    query: null,
    getUserMsg: 'select * from message where send_id in(?,?) and receive_id in(?,?) limit 30',
    insertMsg: 'insert into message set ?',
    insertToUser :'insert into user_message set ?',
    getReads: 'select send_id as id, count(*) as count from user_message where is_read = 0 and user_id = ? group by send_id',
    clearRead: 'update user_message set is_read = 1 where user_id = ? and send_id = ?'
});