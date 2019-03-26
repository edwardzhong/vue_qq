const auth = require('./auth.js')
const { insertMsg, insertToUser } = require('../daos/message');
const log = require('../common/logger')

let maps = {};
let list = [];
const findUid = sid => {
    let id = '';
    for (let [k, v] of Object.entries(maps)) {
        if (v == sid) {
            id = k;
        }
    }
    return id;
};
const deleteUser = sid => {
    let i = list.findIndex(l => l.socketId == sid);
    if (i > - 1) {
        delete maps[list[i].id];
    }
    return list.splice(i, 1)[0];
};

const currTime = () => {
    const d = new Date(),
        date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
};

module.exports = io => {
    // middleware
    io.use(auth);
    //namespace (/)
    io.on('connection', socket => {
        socket.emit('open', {
            code: 0,
            handshake: socket.handshake,
            namespace: '/chat',
            message: 'welcome to main channel, please sign'
        });

        socket.on('sign', (data, fn) => {
            if (!data.id) {
                return fn({ code: 2, message: 'id not exist' });
            }
            maps[data.id] = socket.id;
            data.socketId = socket.id;
            list.push(data);

            socket.emit('userin', maps, data);
            socket.broadcast.emit('userin', maps, data);

            fn({
                code: 0,
                message: 'sign success',
                data: maps
            });
        });

        socket.on('send', async (uid, msg) => {
            const sid = maps[uid];//接收用户socket.id
            const cid = findUid(socket.id);//发送用户id

            if (sid) { // 好友在线则发送
                socket.to(sid).emit('reply', { id: cid, self: false }, { date: currTime(), msg: msg });
            }
            // 给自己也发一份
            socket.emit('reply', { id: uid, self: true }, { date: currTime(), msg: msg });
            // 保存数据库
            try {
                const ret = await insertMsg({ send_id: cid, receive_id: uid, content: msg });
                insertToUser({ user_id: uid, send_id: cid, message_id: ret.insertId, is_read: sid ? 1 : 0 });
            } catch (err) {
                log.error(err);
            }
        });
        
        socket.on('status',() => {
            socket.emit('checkStatus',maps);
        });

        socket.on('sendApply', (uid, data) => {
            socket.to(maps[uid]).emit('apply', { ...data, date: currTime() });
        })

        socket.on('disconnect', () => {
            const user = deleteUser(socket.id);
            socket.broadcast.emit('userout', maps, user);
        });
    });

    // // namespace (/chat) 
    // const chat = io.of('/chat').on('connection', socket => {
    //     socket.emit('open', {
    //         code: 0,
    //         namespace: '/',
    //         message: 'welcome to chat channel '
    //     });

    //     socket.on('message', data => {

    //     });
    // });
    // 
    // chat.use(auth);
};
