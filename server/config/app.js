/**
 * app config
 */
module.exports = {
    isDev: process.env.NODE_ENV == 'development',
    port: 8080,
    socketPort: 3001,
    clientPort: 3000,
    secret: 'JEFFJWT',
    exp: 60 * 60,
};

