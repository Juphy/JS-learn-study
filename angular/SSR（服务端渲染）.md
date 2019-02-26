### Angular Universal: 服务端渲染
标准的Angular应用会运行在浏览器中，它会在DOM中渲染页面，以响应用户的操作，而Angular Universal会在服务端通过一个名叫服务端渲染（server-side rendering - SSR）的过程生成静态的应用页面。它可以生成这些页面，并在浏览器请求时直接用它们给出响应，也可以把页面预先生成为HTML文件，然后把它们作为静态文件供服务器使用。

### 为何需要服务端渲染？
- 帮助网络爬虫

搜索引擎都是依赖网络爬虫去索引应用的内容，这些网络爬虫可能不会像人类那样导航到你的具有高度交互性的Angular应用，Angular Universal可以让站点被浏览，因为每个URL返回的都是一个完全渲染好的页面。
- 提升在手机和低功耗设备上的性能

- 迅速显示出第一个页面

### Universal Web服务器
Universal Web 服务器使用 Universal 模板引擎渲染出的静态 HTML 来响应对应用页面的请求。 服务器接收并响应来自客户端（通常是浏览器）的 HTTP 请求，并回复静态文件，如脚本、CSS 和图片。 它可以直接响应数据请求，也可以作为独立数据服务器的代理进行响应。

> 任何一种Web服务器技术都可以作为Universal应用的服务器，只要它能调用Universal的renderModuleFactory()函数

制作一个Universal的应用，就要安装platform-server包，它提供了DOM的服务端实现、XMLHttpRequest以及其他不依赖浏览器的底层特性，使用platform-server模块（代替platform-browser模块）编译客户端应用，并在web服务器上运行其生成的Universal应用。

服务器会把客户端对应页面的请求传给renderModuleFactory()函数接受一个模板HTML页面（通常是index.html）、一个包含组件的Angular模块和一个用于决定该显示哪些组件的路由作为输入。该路由从客户端的请求中传给服务器，每次给出请求都会给出所请求路由的一个适当的视图。

renderModuleFactory()在模板中的`<`app>标记中渲染这个视图，并未客户端创建一个未完成的HTML页面。最后，服务器就会把渲染好的页面返回给客户端。

### 准备服务端渲染
搭建服务器环境：
- 安装依赖
- 通过修改应用代码及其配置进行准备
- 添加构建目标，并使用CLI中的@nguniversal/express-engine原理图来构建出Universal包
- 设置服务器，以运行Universal包
- 打包并在服务器上运行此应用

> 服务端请求的安全性

应用从浏览器上发出的请求和从服务器上发出的请求是不同的，universal的http请求有不同的安全需求。

当浏览器发出HTTP请求时，服务器处理时会具有一些假设，比如Cookie、XSRF头等等。例如，浏览器会自动发送当前用户的认证Cookie。Angular Universal却没有办法把这些凭证转发给独立的数据服务器。如果你的服务器处理HTTP请求，你必须添加自己的通道来提供安全性。

### 操作步骤
- 安装依赖

把@angular/platform-server安装到项目中，在项目中使用与其他@angular相同的版本，还需要ts-loader供Webpack构建时使用，还要安装@nguniversal/module-map-ngfactory-loader来处理服务端渲染环境下的惰性加载
```
$ npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader webpack-cli
```
- 准备你的应用
    - 为应用添加Universal支持
      ```
      // app.module.ts
      @NgModule({
      bootstrap: [AppComponent],
      imports: [
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on
        // the page.
        BrowserModule.withServerTransition({appId: 'my-app'}),
        ...
      ],
        })
        export class AppModule {}
        ```
    - 创建服务端根模块：在服务器上运行时，要创建一个AppServerModule的模块作为根模块。
      ```
      // 新创建的app.server.module.ts
      import {NgModule} from '@angular/core';
      import {ServerModule} from '@angular/platform-server';
      import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

      import {AppModule} from './app.module';
      import {AppComponent} from './app.component';

      @NgModule({
      imports: [
          // The AppServerModule should import your AppModule followed by the ServerModule from @angular/platform-server.
          // 新模块从AppModule中导入了所有的东西
          AppModule,
          ServerModule,
          ModuleMapLoaderModule // <-- *Important* to have lazy-loaded routes work
      ],
      // Since the bootstrapped component is not inherited from your imported AppModule, it needs to be repeated here.
      // ModuleMapLoaderModule通过Angular CLI进行服务端渲染时也能使用惰性加载路由
      bootstrap: [AppComponent],
      })
      export class AppServerModule {}
      ```
    - 创建一个main文件，以导出服务端根模块。在应用的src/目录下为你的Universal宝创建一个main文件，以导出AppServerModule实例。
      ```
      // 创建main.server.ts
      export { AppServerModule } from "./app/app.server.module";
      ```
    - 配置服务端根模块。为AppServerModule创建配置文件，把tsconfig.app.json复制到tsconfig.server.json中，并作如下修改：
      - 在"complierOptions"中，把"module"改为"commonjs"
      - 添加一个"angularComplierOptions"节，并把"entryModule"(入口模块)指向你的AppServerModule实例，格式为importPath#symbolName。入口模块是app/app.server.module#AppServerModule
        ```
        {
        "extends": "../tsconfig.json",
        "compilerOptions": {
          "outDir": "../out-tsc/app",
          "baseUrl": "./",
          // Set the module format to "commonjs":
          "module": "commonjs",
          "types": []
        },
        "exclude": [
          "test.ts",
          "**/*.spec.ts"
        ],
        // Add "angularCompilerOptions" with the AppServerModule you wrote
        // set as the "entryModule".
        "angularCompilerOptions": {
          "entryModule": "app/app.server.module#AppServerModule"
          }
        }
        ```

- 创建新的构建目标，并打包

打开项目的Angular配置文件angular.json，并在"architect"节下添加一个新的目标。
```
"architect":{
  "build": {.....},
  "server": {
    "builder": "@angular-devkit/build-angular:server",
    "options": {
      "outputPath": "dist/server",
      "main": "src/main.server.ts",
      "tsConfig": "src/tsconfig.server.json"
    }
  }
}
```
要想为应用程序构建服务包，使用ng run命令，格式为projectName#serverTarget，即 ng run projectName:build 和 ng run projectName:server

- 设置服务器环境，以运行Universal包

要想运行Universal包，需要把它发送给服务器，需把AppServerModule（用AOT编译的）传给PlatformServer的renderModuleFactory()，它会序列化应用，并把结果返回给浏览器。
```
app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleFactory, {
    // our index.html
    document: template,
    url: options.req.url,
    // config DI to make lazy-loading work differently(we need to instantly render the view)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html =>{
    callback(null, html);
  })
})
```
使用一些内置功能的@nguniversal/express-engine
```
import { ngExpressEngine } from "@nguniversal/express-engine";

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}))
```
- 打包并在服务器上运行此应用

设置webpack配置，以处理Node Express的server.ts文件，并启动应用服务器
在应用的根目录下，创建一个Webpack配置文件webpack.server.config.js，它会把server.ts及其依赖编译到dist/server.js中。
```
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {  server: './server.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for "WARNING Critical dependency: the request of a dependency is an expression"
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}
```
然后进行打包会在dist/目录下同时包含browser目录和server目录
```
dist/
    browser/
    server/
```
若想在服务器上运行该应用，请在命令行运行下列命令：
```
node dist/server.js
```

#### 创建一些脚本
```
"scripts": {
  "build:ssr": "npm run build:client-and-server-bundles && npm run webpack:server",
  "serve:ssr": "node dist/server.js",
  "build:client-and-server-bundles": "ng build --prod && ng run my-project:server:production",
  "webpack:server": "webpack --config webpack.server.config.js --progress --colors",
  ...
}
```
若想在本地系统上使用Universal运行应用的生产版本，请使用如下命令：
```
npm run build:ssr && npm run serve:ssr
```
#### 使用浏览器API
由于Universal的platform-server应用并没有运行在浏览器中，因此不得不在该服务器中缺少某些浏览器API和能力的情况下工作。
- 在服务端渲染页面不能引用浏览器独有的原生对象，比如window、document、navigator或location，如果你在服务端渲染的页面中不需要它们，就可以使用条件逻辑跳过它们。另一种方式是查找一个可注入的Angular对所需对象的抽象服务，比如location或document，他可能作为你调用的指定API的等价替身。如果Angular没有提供它，也可以写一个抽象层，当浏览器运行时，就可以把它委托给浏览器API，当它在服务器运行时，就提供一个符合要求的代用实现。
- 没有鼠标或键盘事件，因此Universal应用也不能依赖于用户点击某个按钮来显示每个组件，Universal应用必须仅仅根据客户端过来的请求决定要渲染的内容。把该应用做成可路由的。
- 由于服务端渲染页面的用户只能点击链接，所以应该尽快切换到真正的客户端应用，以提供正常的交互体验

#### 创建服务端模块
```
ng add @nguniversal/express-engine --clientProject
```
该命令会创建如下的目录结构：(标有*的文件都是新的)
```
src/
  index.html                 应用的宿主页app web page
  main.ts                    客户端应用的引导程序bootstrapper for client app
  main.server.ts             * 服务端应用的引导程序* bootstrapper for server app
  tsconfig.app.json          TypeScript 的客户端配置TypeScript client configuration
  tsconfig.server.json       * TypeScript 的服务端配置* TypeScript server configuration
  tsconfig.spec.json         TypeScript 的测试配置TypeScript spec configuration
  style.css                  应用的样式表styles for the app
  app/ ...                   应用代码application code
    app.server.module.ts     * 服务端的应用模块* server-side application module
server.ts                    * Express 的服务程序* express web server
tsconfig.json                TypeScript 的客户端配置TypeScript client configuration
package.json                 npm 配置npm configuration
webpack.server.config.js     * Webpack 的服务端配置* webpack server configuration

```
#### 在HTTP中使用绝对地址
Angular的HttpClient模块来获取应用数据时，服务都把请求发送到相对URL。在Universal应用中，HTTP的URL必须是绝对地址（比如https://my-server.com/api/heroes），只有这样，Universal的Web服务器才能处理那些请求，这意味着当运行在服务端中时，必须修改你的服务，来使用绝对URL发起请求，而在浏览器中，则使用相对URL。

解决方案：通过Angular的App_BASE_HREF令牌来提供服务器的源地址（origin），把它注入到服务中，并把这个源地址添加到所请求的URL之前。
```
// src/app/hero.service.ts
constructor(
  private http: HttpClient,
  private messageService: MessageService,
  @Optional()@Inject(APP_BASE_HREF) origin: string){
    this.heroesUrl = `${origin}${this.heroesUrl}`;
  }

这个构造函数使用了@Optional()指令来为heroesUrl添加源，在浏览器版本中，不用提供APP_BASE_HREF，因此heroUrl仍然是相对的。  
```
` 注意：如果你通过index.html文件指定了<base href="/">以满足路由器对基地址的要求，那么就可以在浏览器中忽略APP_BASE_HREF的设置。`

#### Universal模板引擎
server.ts文件中最重要的部分是ngExpressEngine()函数
```
// server.ts
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}))
```
ngExpressEngine()是对Universal的renderModuleFactory()函数的封装，它会把客户端请求转换成服务端渲染的HTML页面。只能在某个适用于你服务端技术栈的模板引擎中调用这个函数：
- 第一个参数：AppServerModule。它是Universal服务端渲染器和你的应用之间的桥梁
- 第二个参数：extraProviders是可选的。它能让你指定一些服务端运行时特有的服务提供商。只有当你的应用需要一些运行在服务器中才需要的信息时，才需要这么做。（正在运行的服务器的源地址，它通过APP_BASE_HREF令牌提供，以便应用可以计算出HTTP URL的绝对地址）

ngExpressEngine()函数返回一个会解析成渲染好的页面的promise。

#### 过滤请求的URL
web服务器必须把对应用页面的请求和其他类型的请求区别开。
这和拦截对根路径 / 的请求那么简单，浏览器可以请求应用中的任何一个路由地址，比如 /dashboard、/heroes 或 、/detail:12。事实上，如果应用只通过服务器渲染，那么应用中点击任何一个链接都会发送到服务器，就像导航时的地址会发到路由器一样。

应用的路由，它们的URL一般不带文件扩展名，主要分为三种：
- 数据请求： 请求的URL用 /api 开头
- 应用导航：请求的URL不带扩展名
- 静态资源：所有其它请求

Node Express是一系列中间件构成的管道，它会挨个对URL请求进行过滤和处理，可以调用app.get()来配置Express服务器的管道。

#### 安全的提供静态文件
单独的 app.use() 会处理所有其它 URL，比如对 JavaScript 、图片和样式表等静态资源的请求。

要保证客户端只能下载那些允许他们访问的文件，你应该把所有面向客户端的资源文件都放在 /dist 目录下，并且只允许客户端请求来自 /dist 目录下的文件。
```
// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
```
