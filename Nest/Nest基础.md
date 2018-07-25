### 介绍
Nest是一个用于构建高效，可扩展的Node.js服务器端应用程序的框架。它使用渐进式JavaScript，使用TypeScript构建 （保留与纯JavaScript的兼容性），并结合了OOP（面向对象编程），FP（功能编程）和FRP（功能反应编程）的元素。

### 建立和运行
```
npm i -g @nestjs/cli
nest new project
```
project文件中的src目录中包含几个核心文件：
```
src
    |—— app.controller.ts
    |—— app.module.ts
    |—— main.ts
```
main.ts包含一个异步函数，负责引导我们的应用程序。
```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
要创建一个Nest应用实例，使用NestFactory。create()方法返回一个实现INestApplication接口的对象，并提供一组可用的方法。
```
npm run start
```
此命令在 src 目录中的 main.ts 文件中定义的端口上启动 HTTP 服务器。
 ### 控制器
 主要负责处理传入的请求，并返回对客户端的响应。

 ![控制器](http://ww1.sinaimg.cn/large/8b2b1aafly1ftm210e0m2j20qy0bodgm.jpg)

为了创建一个基本的控制器，必须使用装饰器。 装饰器将类与基本元数据相关联，这样Nest才知道如何将控制器映射到相应的路由。