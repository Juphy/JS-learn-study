## contxet对象
koa提供一个Context对象，表示一次对话的上下文（包括HTTP请求和HTTP回复），通过加工这个对象，就可以控制返回给用户的内容。

ctx.response 代表HTTP Response   ctx.request 代表HTTP Request

## HTTP Response的类型
Koa的默认返回类型是text/plain，如果想返回其他类型的内容，就可以先用ctx.request.accepts判断一下，客户端希望接受什么数据（根据HTTP Request的Accept字段），然后使用ctx.response.type指定返回类型。

ctx.response.body 设置response的内容

## middleware
处在HTTP Request和HTTP Response中间，用来实现某种中间功能。app.use()用来加载中间件。多个中间件会形成一个栈结构（middle stack），以先进后出的顺序执行。
- 1、最外层的中间件首先执行
- 2、调用next函数，把执行权交给下一个中间件
- 3、。。。
- 4、最内层的中间件最后执行。
- 5、执行结束后，把执行权交回上一层的中间件。
- 6、。。。
- 7、最外层的中间件收回执行权之后，执行next函数后面的代码。
如果中间件内部没有调用next函数，那么执行权就不会传递下去。

### 异步中间件
