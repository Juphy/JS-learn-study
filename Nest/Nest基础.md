### 介绍

Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，使用 TypeScript 构建 （保留与纯 JavaScript 的兼容性），并结合了 OOP（面向对象编程），FP（功能编程）和 FRP（功能反应编程）的元素。

### 建立和运行

```
npm i -g @nestjs/cli
nest new project
```

project 文件中的 src 目录中包含几个核心文件：

```
src
    |—— app.controller.ts
    |—— app.module.ts
    |—— main.ts
```

> main.ts 包含一个异步函数，负责引导我们的应用程序。

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

要创建一个 Nest 应用实例，使用 NestFactory。create()方法返回一个实现 INestApplication 接口的对象，并提供一组可用的方法。

```
npm run start
```

此命令在 src 目录中的 main.ts 文件中定义的端口上启动 HTTP 服务器。

### 平台

Nest 旨在成为一个与平台无关的框架。 通过平台，可以创建可重用的逻辑部件，开发人员可以利用这些部件来跨越多种不同类型的应用程序。Nest 可以在创建适配器后使用任何 Node HTTP 框架。 有两个支持开箱即用的 HTTP 平台：express 和 fastify。

- Express: Express 是一个众所周知的 node.js 简约 Web 框架。 这是一个经过实战考验，适用于生产的库，拥有大量社区资源。 默认情况下使用 @nestjs/platform-express 包。 许多用户都可以使用 Express ，并且无需采取任何操作即可启用它。

- Fastify: Fastify 是一个高性能，低开销的框架，专注于提供最高的效率和速度。

无论使用哪种平台，它会暴露自己的 API，分别是 NestExpressApplication 和 NestFastifyApplication，将类型传递给 NestFactory.create()函数时，App 对象将具有专用于该特定平台的函数。

```
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

### 控制器

负责处理传入的`请求`，并返回对客户端的`响应`。

![控制器](assets/images/Controllers.png)

控制器的目的是接收应用的特定请求。`路由`机制控制哪个控制器接收那些请求。通常，每个控制器有多个路由，不同路由可以执行不同的操作。
为了创建一个基本的控制器，必须使用装饰器。 装饰器将类与基本元数据相关联，并使`Nest`能够创建路由映射（将请求绑定到相应的控制器）。

#### 路由

cats.controller.ts

```
// 使用CLI创建控制器
nest g controller cats
```

```
import { Controller, Get } from "@nestjs/common";

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

使用控制器所需的`@Controller()`装饰器，可选前缀设置为`cats`，在`@Controller()`装饰器中使用路径前缀可以使我们轻松地对一组相关的路由进行分组，并最大程度地减少重复代码。

`findAll()`方法之前的` @Get()``HTTP `请求方法装饰器告诉`Nest`为`HTTP`请求的特定端点创建处理程序。端点对应于`HTTP`请求方法和路由。什么是路由？处理程序的路由是通过连接为控制器声明的（可选）前缀和请求装饰器中指定的任何路由来确定的。由于我们已经为每个`route`(`cats`)声明了一个前缀，并且没有在装饰器中添加任何路由信息，因此 Nest 会将`GET /cats`请求映射到此处理程序。例如，`customer`与装饰器组合的路由前缀`@Get('profile')`会为请求生成路由映射`GET /customer/profile`

当对此端点发出`GET`请求时，`Nest`会将请求路由到我们的用户定义`findAll()`方法。请注意，我们在此处选择的函数名称完全是任意的。我们显然必须声明一个绑定路由的函数，但 Nest 不会对所选的函数名称附加任何意义。

- 标准：使用这个内置方法，当请求处理程序返回一个`JavaScript`对象或数组时，它将自动序列化为`JSON`。但是，当它返回一个`JavaScript`基本类型（例如`string、number、boolean`）时，Nest 将只发送值，而不尝试序列化它。这使响应处理变得简单：只需要返回值，其余的有`Nest`负责。

此外，响应的状态码默认情况下始终为 200，但使用 201 的 POST 请求除外。我们可以通过在处理程序级别添加 @HttpCode(...) 装饰器来轻松更改此行为 （状态代码）。

- 类库特有的：在函数签名通过 @Res() 注入类库特定的 响应对象（例如，Express），使用此函数，您具有使用该对象的响应处理函数。例如，使用 Express，您可以使用类似代码构建响应 response.status(200).send()。

**禁止同时使用这两种方法。 Nest 检测处理程序是否正在使用 @Res()或 @Next()，如果两个方法都用了的话, 那么在这里的标准方式就是自动禁用此路由, 你将不会得到你想要的结果。**

#### Request

许多端点需要访问客户端的请求细节。实际上，`Nest`正使用类库特有（默认是`express`）的请求对象。因此，可以强制`Nest`使用`@Req()`装饰器将请求对象注入处理程序。

```
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

**为了在 express 中使用 Typescript，需要安装@Types/express。**

Request 对象表示 HTTP 请求，并具有 Request 查询字符串，参数，HTTP 标头 和 正文的属性（在这里阅读更多），但在大多数情况下, 不必手动获取它们。 我们可以使用专用的装饰器，比如开箱即用的 @Body() 或 @Query() 。 下面是装饰器和 普通表达对象的比较。

@Request() req
@Response() @Res()\* res
@Next() next
@Session() req.session
@Param(key?: string) req.params / req.params[key]
@Body(key?: string) req.body / req.body[key]
@Query(key?: string) req.query / req.query[key]
@Headers(name?: string) req.headers / req.headers[name]
@Ip() req.ip

为了与底层 HTTP 平台(如 Express 和 Fastify)之间的类型兼容，Nest 提供了 @Res()和 @Response() 装饰器。@Res()只是 @Response()的别名。两者都直接公开底层响应对象接口。在使用它们时，您还应该导入底层库的类型(例如：@types/express)以充分利用它们。注意，在方法处理程序中注入 @Res()或 @Response() 时，将 Nest 置于该处理程序的特定于库的模式中，并负责管理响应。这样做时，必须通过调用响应对象(例如，res.json(…)或 res.send(…))发出某种响应，否则 HTTP 服务器将挂起。

#### 资源

```
// cats.controller.ts

import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

`Nest`以相同的方式提供其余的端点装饰器`@Put()`、`@Delete`、`@Patch`、`@Options()`、`@Head()`和`@All()`。

#### 路由通配符

路由同样支持模式匹配，例如星号被用作通配符，将匹配任何字符组合。

```
@Get('ab*cd')
findAll(){
  return 'This route uses a wildcard';
}
```

以上路由地址匹配`abcd`、`ab_cd`、`abecd`等。字符`?`、`+`、`*`、`()`等是它们的正则表达式对应项的子集。连字符`-`和`.`按字符串路径解析。

#### 状态码

默认情况下，响应的状态码总是 200，除了 post 请求外，此时它是 201，我们可以通过在处理程序层添加`@HttpCode(...)`装饰器来更轻松更改此行为。
**HttpCode 需要从`@nestjs/common`包导入。**

#### Headers

指定自定义响应头，可以使用`@Header()`修饰器或类库特有的响应对象，使用并 res.header()直接调用

```
@Post()
@Header('Cache-Control', 'none')
create(){
  return 'This action adds a new cat';
}
```

_Header 需要从``@nestjs/common 包导入_

#### 重定向

要将响应重定向到特定的`URL`，可以使用`@Redirect()`装饰器或特定于库的响应对象（并直接调用`res.redirect()`）。

`@Redirect()`带有必需的`url`参数和可选的`statusCode`参数。如果省略，则`statusCode`默认为302.
```
@Get()
@Redirect('https://nestjs.com', 301)
```
如果想要动态确定HTTP状态代码或重定向URL，通过从路由处理程序方法返回一个形状为一下形势的对象：
```
{
  "url": string,
  "statusCode": number
}
返回的值将覆盖传递给`@Redirect()`装饰器的所有参数。
```
```
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

#### 路由参数
当您需要接受动态数据作为请求的一部分时（例如，使用GET /cats/1来获取 id为 1的 cat），带有静态路径的路由将无法工作。为了定义带参数的路由，我们可以在路由中添加路由参数标记，以捕获请求 URL 中该位置的动态值。@Get() 下面的装饰器示例中的路由参数标记演示了此用法。可以使用 @Param() 装饰器访问以这种方式声明的路由参数，该装饰器应添加到函数签名中。
```
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```
@Param()用于修饰方法参数（上面示例中的参数），并使路由参数可用作该修饰的方法参数在方法体内的属性。 如上面的代码所示，我们可以通过引用 params.id来访问 id参数。 您还可以将特定的参数标记传递给装饰器，然后在方法主体中按名称直接引用路由参数。

#### 子域路由
`@Controller`装饰器可以接受一个`host`选项，以要求传入请求的`HTTP`主机匹配某个特定值。
```
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string{
    return 'Admin page';
  }
}
```
**因为`Fastify`缺乏对嵌套路由器的支持，当使用子域路由时，应该使用（默认）Express适配器。**
与路由类似`path`，该`hosts`选项可以使用令牌来捕获主机名中该位置的动态值。`@Controller()`下面的装饰器示例中的主机参数令牌演示了此用法。使用`@HostParam()`装饰器访问以这种方式声明的主机参数，该装饰器应添加到方法签名中。
```
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
```
#### 作用域
`Node.js`不遵循请求/响应多线程无状态模型，每个请求都由主线程处理。因此，使用单例实例对我们的应用程序来说是完全安全的。

#### async / await

#### 请求负载
`POST`路由处理程序不接受任何客户端参数，添加`@Body()`参数，如果使用`TypeScript`，需要确定`DTO`(数据传输对象)模式。`DTO`是一个对象，它定义了如何通过网络发送数据。可以通过使用 TypeScript接口或简单的类来完成。令人惊讶的是，我们在这里推荐使用类。为什么?类是JavaScript ES6标准的一部分，因此它们在编译后的 JavaScript中保留为实际实体。另一方面，由于 TypeScript接口在转换过程中被删除，所以 Nest不能在运行时引用它们。

