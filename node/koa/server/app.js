let Koa = require('koa');
let app = new Koa();
let middleware = require('./middlewares');
let bodyParser = require('koa-bodyparser');
let compress = require('koa-compress');
const logger = require('koa-logger');
const json = require('koa-json');
// 默认中间件
app.use(bodyParser());
app.use(compress({threshold: 2048}));
app.use(logger());
app.use(json({pretty: false, params: 'pretty'}));
// 处理get和post参数
// app.use(middleware.request);

// 配置跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:4208');
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Max-Age', 3600 * 24);
    await next();
});

// 处理路由
const router = require('./routes');
app.use(router.routes());

app.listen(3000, () => {
    console.log('开始监听3000端口！');
});
