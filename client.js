const koa = require('koa')
const app = new koa()
const static = require('koa-static')
const compress = require('koa-compress')
const router = require('koa-router')()
const favicon = require('koa-favicon')
const { clientPort } = require('./server/config/app')
const tpl = require('./server/middleware/tpl')
const path = require('path')

// gzip
app.use(compress({
    filter: function (content_type) {
        return /text|javascript/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

// set static directiory
app.use(static(path.join(__dirname, 'dist'), { index: false }));
app.use(favicon(path.join(__dirname, 'dist/favicon.ico')));

// simple template engine
app.use(tpl({
    path: path.join(__dirname, 'dist')
}));

// add routers
router
    .get('/', ctx => {
        ctx.render('index.html');
    })
    .get('/sign/*', ctx => {
        ctx.redirect('/');
    })

app.use(router.routes())
    .use(router.allowedMethods());

// deal 404
app.use(async (ctx, next) => {
    ctx.status = 404;
    ctx.body = { code: 404, message: '404! not found !' };
});

// koa already had event to deal with the error, just rigister it
app.on('error', (err, ctx) => {
    ctx.status = 500;
    ctx.statusText = 'Internal Server Error';
    if (ctx.app.env === 'development') { //throw the error to frontEnd when in the develop mode
        ctx.res.end(err.stack); //finish the response
    } else {
        ctx.body = { code: -1, message: 'Server Error' };
    }
});

if (!module.parent) {
    app.listen(clientPort);
    console.log('app server running at: http://localhost:%d', clientPort);
}