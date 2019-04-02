const jwt = require('jsonwebtoken')
const log = require('../common/logger')
const { secret } = require('../config/app')

module.exports = async (socket, next) => {
    const token = socket.handshake.query.token;
    if(!token){
        log.error(new Error('token not exist'));
        socket.emit('auth',{
            code:2,
            message:'token not exist',
            error:err
        });
        return next(new Error('token not exist'));
    }
    try {
        const credentials = token.split(' ').slice(-1)[0];
        await jwt.verify(credentials, secret);
        return next();
    } catch (err) {//验证不通过的三种类型 name: TokenExpiredError(过期) | JsonWebTokenError(token解释错误) | NotBeforeError(还未到生效期)
        log.error(err);
        socket.emit('auth',{
            code:1,
            message:'authentication error',
            error:err
        });
        return next(new Error('authentication error'));
    }
}
