### 默认启用差异化加载（Differential loading）

所谓差异化加载就是浏览器会根据自己的状态在现代和旧版本的 JavaScript 之间进行选择的过程。在 Angular 8 中，我们可以通过为应用程序执行现代构建（es2015+）和旧版构建（es5）来默认使用此功能。

具体来说就是，作为构建过程的一部分，Angular CLI 将会分别生成现代（ES2015+）和旧版（ES5）构建的 JavaScript 捆绑包，当用户加载应用程序时，客户端会进行差异化加载，他们将自动获得所需的捆绑包。

差异化加载可显著提升现代浏览器的加载速度和传输间隔时间（TTI），亦即意味着支持 ES2015 的浏览器将能够下载更小、更高效的捆绑包，当然这些包的加载速度和渲染速度都比以往更快。

根据 browserlist 文件，在构建期间，Angular 将为其创建单独的包 polyfills.

```
<body>
  <pp-root> </ pp-root>
  <script type ="text/javascript" src ="runtime.js"> </script>
  <script type ="text/javascript" src ="es2015-polyfills.js" nomodule> </script>
  <script type =" text/javascript" src ="polyfills.js"> </script>
  <script type ="text/javascript" src ="styles.js"> </scriptscript>
  <script type ="text/javascript" src ="vendor.js"> </script>
  <script type ="text/javascript" src ="main.js"> </script>
</ body>
```

nomodule 属性是一个布尔属性，用于阻止脚本在支持模块脚本的用户代理中执行。这允许在现代用户代理和旧用户代理中的经典脚本中选择性地执行模块脚本。

### 使用动态导入进行路由配置

在 Angular 8 中，我们可以可以使用路由延迟加载部分应用程序，这是通过在路由配置中使用 loadChildren 来实现。
在之前的版本中会编写如下的代码：

```
{ path: '/admin', loadChildren: './admin/admin.module#AdminModule' }
```

这种语法是专门为 Angular 定制的，并内置到其工具链中，但 Angular8 将逐渐往行业标准靠拢——使用了动态导入的方式（dynamic imports）。

```
{ path: `/admin`, loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule) }
```

### 对 Web Worker 的支持

开发者可通过 Web Worker 编写运行在主线程之外的代码（例如对图像和视频的操作），以此提升应用程序的运行速度和并行性。

在此之前，所有 Web 应用程序只能使用单线程。而随着 Web Worker 的出现，可以将 CPU 分配到单独的硬件线程中，使浏览器环境拥有多线程，从而提升项目开发效率。

在 Angular 8 之前，使用 Web Worker 存在这样的问题：在 worker 中运行的代码不能与应用程序的其余部分位于同一 JavaScript 脚本文件中，它必须是分开的。因此，对于曾经希望借助 Angular CLI 等工具，自动将 JavaScript 文件拆分、绑定到更少文件夹下的效果往往不佳。

Angular 8 的新特性之一就是改进了使用 Angular CLI 捆绑 WebWorker 的支持，这项改进意味着我们将走向多并发、自动化的 Web Worker 之路。

```
const worker = new Worker(`./my-worker.worker`, { type: module })
```

### SVG 作为模板

```
@Component({
    selector: 'app-icon',
    templateUrl:'./icon.component.svg',
    styleUrls: ['./icon.component.css']
})
export class AppComponent{...}
```

### lvy 渲染引擎实验

虽然早在 Angular 6 的时候就提出了 lvy。但是 lvy 仍处在实验阶段，通过 Angular 8 版本，您可以通过创建一个 enable-ivy 标志设置为 true 的应用程序来测试它，如下所示。它不是完全正常运行（选择预览），正如 Igor Minar 在 ngConf 2019 中建议的那样，视图引擎仍然推荐用于新应用。

要在现有项目中使用 Ivy 的话，需要在 tsconfig.app.json 文件中设置 angularCompilerOptions 选项的 enableIvy 属性

```
"angularComplierOptions": { "enabledIvy": true }
```

或者使用新引擎创建新程序

```
ng new my-app --enable-ivy
```

作为新的渲染引擎，lvy 旨在彻底缩短代码尺寸并增强系统灵活性。与目前的 Angular View Engine 相比，Ivy 具有以下优势：

- 通过 Angular 编译器生成的代码更具可读性，更易调试
- 更快的重建速度
- 有效减少负载大小，浏览器用于下载和解析应用程序的时间将更短
- 更好的模板类型检查，以便在项目构建初期就可捕获更多 Bug
- 优秀的向后兼容性

### Bazel 的支持

目前，还处在"选择预览"模式，Bazel 可作为选择加入，预计将包含在@angular/cli 的第 9 版中，具有以下优势：

- 更快的构建时间（对于第一次构建需要时间，但并发构建快），Angular 已经在使用它。
- 增量构建：能够仅构建和部署已更改的内容而不是整个应用程序
- 可以弹出 Bazel 文件，默认情况下他们是隐藏的

添加 Bazel 支持：

```
ng add @angular/bazel
```

使用 Bazel 创建一个新的应用程序：

```
npm install -g @angular/bazel
ng new my-app --collection=@angular/bazel
```

### Builders API

新版本允许我们使用 Builders API，也称 Architect API。
Angular 使用 builders 进行主要操作：serve，build，test，lint 和 e2e。
angular.json 文件：

```
...
"projects": {
  "app-name": {
    ...
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        ...
      },
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        ...
      },
      "test": {
        "builder": "@angular-devkit/build-angular:karma",
        ...
      },
      "lint": {
        "builder": "@angular-devkit/build-angular:tslint",
        ...
      },
      "e2e": {
        "builder": "@angular-devkit/build-angular:protractor",
        ...
      }
    }
  }
}
```

创建自定义构建器，"gulp/grunt"中的命令。基本上，构建器只是一个带有一组命令的函数，可以 createBuilder()从@angular/architect 包传递给方法。

```
import { createBuilder } from '@angular-devkit/architect';
function customBuild(options, context) {
  return new Promise((resolve, reject) => {
    // set of commands
  })
}
createBuilder(customBuild);
```
