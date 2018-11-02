module.exports = async (ctx, next) => {
    let params = {}, method = ctx.request.method;
    switch (method) {
        case 'GET':
            params = ctx.query;
            break;
        case 'POST':
            params = ctx.request.body;
            break;
    }
    ctx.request['params'] = params;
    await next();

}
