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

- Fastify: Fastify是一个高性能，低开销的框架，专注于提供最高的效率和速度。

无论使用哪种平台，它会暴露自己的API，分别是NestExpressApplication 和 NestFastifyApplication，将类型传递给NestFactory.create()函数时，App对象将具有专用于该特定平台的函数。
```
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

### 控制器

主要负责处理传入的请求，并返回对客户端的响应。

![控制器](http://ww1.sinaimg.cn/large/8b2b1aafly1ftm210e0m2j20qy0bodgm.jpg)

为了创建一个基本的控制器，必须使用装饰器。 装饰器将类与基本元数据相关联，这样 Nest 才知道如何将控制器映射到相应的路由。
