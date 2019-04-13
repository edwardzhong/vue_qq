const auth = require('./auth.js')
const { insertMsg, insertToUser } = require('../daos/message');
const log = require('../common/logger')

let MAP = {};
let LIST = [];
let ROOMS = [];
const findUid = sid => {
    let id = '';
    for (let [k, v] of Object.entries(MAP)) {
        if (v == sid) {
            id = k;
        }
    }
    return id;
};
const deleteUser = sid => {
    let i = LIST.findIndex(l => l.socketId == sid);
    if (i > - 1) {
        delete MAP[LIST[i].id];
    }
    return LIST.splice(i, 1)[0];
};

const addRooms = arr => {
    arr.forEach(a => {
        if (!ROOMS.includes(a)) {
            ROOMS.push(a);
        }
    });
}

const currTime = () => {
    const d = new Date(), date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
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
            namespace: '/',
            message: 'welcome to main channel, please sign'
        });

        socket.on('sign', ({ user, rooms }, fn) => {
            if (!user.id) {
                return fn({ code: 2, message: 'id not exist' });
            }
            MAP[user.id] = socket.id;
            user.socketId = socket.id;
            LIST.push(user);
            addRooms(rooms);

            socket.join(rooms);//加入自己所在的组
            socket.emit('userin', MAP, user);
            socket.broadcast.emit('userin', MAP, user);

            fn({
                code: 0,
                message: 'sign success',
                data: MAP
            });
        });

        //两人聊天
        socket.on('send', async (uid, msg) => {
            const sid = MAP[uid];//接收用户socket.id
            const cid = findUid(socket.id);//发送用户id

            if (sid) { // 好友在线则发送
                socket.to(sid).emit('reply', { id: cid, self: false }, { date: currTime(), msg });
            }
            // 给自己也发一份
            socket.emit('reply', { id: uid, self: true }, { date: currTime(), msg });
            // 保存数据库
            try {
                const ret = await insertMsg({ send_id: cid, receive_id: uid, content: msg });
                insertToUser({ user_id: uid, send_id: cid, message_id: ret.insertId, is_read: sid ? 1 : 0 });
            } catch (err) {
                log.error(err);
            }
        });

        //群组聊天
        socket.on('groupSend', async ({gid,user}, msg) => {
            socket.to(gid).broadcast.emit('groupReply', { gid: gid , ...user }, { date: currTime(), msg });
            // 给自己也发一份
            socket.emit('groupReply', { gid: gid , ...user }, { date: currTime(), msg });

            //保存数据库
            try {
                const ret = await insertMsg({ type:1, send_id: user.id, group_id: gid, content: msg });
                insertToUser({ group_id: gid, send_id: user.id, message_id: ret.insertId, is_read: 1 });
            } catch (err) {
                log.error(err);
            }
        });

        socket.on('acceptFriend', (uid) => {
            const sid = MAP[uid];
            if (sid) {
                socket.to(sid).emit('refresh', MAP);
            }
            socket.emit('checkStatus', MAP);
        });

        socket.on('sendApply', (uid, data) => {
            const sid = MAP[uid];
            if(sid){
                socket.to(MAP[uid]).emit('apply', { ...data, date: currTime() });
            }
        });

        socket.on('disconnect', () => {
            const user = deleteUser(socket.id);
            socket.broadcast.emit('userout', MAP, user);
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
