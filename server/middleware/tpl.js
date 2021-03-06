const { existsSync, statSync, createReadStream } = require('fs');
const path = require('path');
const log = require('../common/logger');

/**
 * simple template engine
 */
module.exports = (opt) => {
  const config = Object.assign({ path: '/' }, opt);
  return async (ctx, next) => {
    ctx.render = (fileName) => {
      ctx.type = 'text/html; charset=utf-8';
      try {
        const dir = path.join(opt.path, fileName);
        if (existsSync(dir) && statSync(dir).isFile()) {
          // ctx.body = readFileSync(dir);
          ctx.body = createReadStream(dir);
        } else {
          const msg = 'template file not exist : ' + fileName;
          log.error(msg);
          ctx.status = 404;
          ctx.throw(404, msg);
        }
      } catch (err) {
        log.error(err);
        ctx.status = 404;
        if (ctx.app.env === 'development') {
          ctx.body = err.message;
        } else {
          ctx.throw(404, err.message);
        }
      }
    };
    await next(); //注意要加上 await
  };
};
