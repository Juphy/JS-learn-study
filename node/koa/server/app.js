let Koa = require('koa');
let app = new Koa();
let middleware = require('./middlewares');
let bodyParser = require('koa-bodyparser');
let compress = require('koa-compress');
const logger = require('koa-logger');
const json = require('koa-json');
const session = require('koa-session');
// 默认中间件
app.use(bodyParser());
app.use(compress({threshold: 2048}));
app.use(logger());
app.use(json({pretty: false, params: 'pretty'}));

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
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
