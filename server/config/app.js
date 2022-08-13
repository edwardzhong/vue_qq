/**
 * app config
 */
const clientPort = 3000;

const config = {
    isDev: process.env.NODE_ENV == 'development',
    port: 8080,
    socketPort: 3001,
    clientPort,
    secret: 'JEFFJWT',
    exp: 60 * 60,
    cors: {
        origin: `http://localhost:${clientPort}`, // * 仍然不能访问header,要写明具体域名才行
        credentials: true, //将凭证暴露出来, 前端才能获取cookie
        allowMethods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        exposeHeaders: ["Authorization"], // 将header字段expose出去，前端才能获取该header字段
        allowHeaders: ["Content-Type", "Authorization", "Accept"] // 允许添加到header的字段
    }
};


module.exports = config

