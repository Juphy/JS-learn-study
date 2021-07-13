### Angular CLI
Angular脚手架，用于快速生成项目或者组件的框架以提高效率，可以方便生成component service directive
- ng generate： 新建component service pipe calss等
- ng new: 新建Angular app
- ng update: 升级Angular自身和依赖
- ng version: 显示angular cli全局版本，以及本地的angular cli angular code等版本
- ng add: 新增第三方库。基于npm安装node_modules，更改配置文件

### Angular的依赖注入
依赖注入是Angular实现的一种应用程序设计模式， 是Angular的核心概念之一。
依赖就是具有一系列功能的服务(service)， 应用程序中的各种组件和指令（derictives）可能需要服务的功能。 Angular提供了一种平滑的机制，通过它我们可以将这些依赖项注入我们的组件和指令中。因此，我们只是在构建依赖关系，这些依赖关系可以在应用程序的所有组件之间注入。
providers
依赖注入的好处：
- 不需要实例化
- 一次注入（app module通过providers注入），所有组件都可以使用，而且用的是同一个service实例，也就是说service里的数据是共享的，可以用于组件间的数据传递

### Angular的编译
- JIT：应用程序在运行时在浏览器内部进行编译
- AOT：应用程序在构建期间进行编译

### Angular双向绑定
Angular的双向绑定，通过脏数据检查（Dirty checking）来实现。
- 脏值检测的基本原理是存储旧数值，并在进行检测时，把当前时刻的新值和旧值比对。若相等则没有变化，反之则检测到变化，需要更新视图。
- angular2中有了Zone.js。对于setTimeout，addEventListener、promise等都在ngZone中执行（换句话说，就是被zone.js封装重写了），angular并在ngZone中setup了相应的钩子，通知angular2做相应的脏检查处理，然后更新DOM。

### Angular双向绑定效率问题
对于页面中需要绑定DOM元素极其多的情况（成百上千），必然会遇到效率问题。（具体还取决于PC、浏览器性能）。
- 对于只用于展示的数据，使用单向绑定，而不是双向绑定；
- Angular的数据流是自顶而下，从父组件到子组件单向流动。单向数据流向保证了高效、可预测的变化检测。因而组件化也是提高性能的一种手段。
- 表达式（以及表达式所调用的函数）中少写太过复杂的逻辑
- 不要连接太长的 pipe
- 变化检测策略onPush（Angular中有两种变化检测策略，default是Angular默认的变化检测策略，只要有值发生变化，就全部检查）。onPush策略，就是只有当输入数据的引用发生变化或者有事件触发时，组件才进行变化检测
-  NgFor应该伴随trackBy方程使用。否则，每次脏值检测过程中，NgFor会把列表里每一项都执行更新DOM操作

### Angular数据绑定的三种方式
- 直接绑定{{}}
- 绑定方法调用结果，性能差，每次脏值检查过程，函数都会被调用
- pipe方式，与绑定function类似，每次脏值检测都会被调用，不过Angular对pipe做了优化

### Module
模块（module）是对组件component，服务service，管道pipe进行分组的地方。模块通过导出或隐藏这些元素来决定其他模块是否可以使用该组件、指令等。每个模块都使用@NgNodule装饰器定义。

根模块Root Module导入BrowserModule，而功能模块导入CommonModule。

Module延迟加载：修改路由配置通过loadChildren import(..nodule).then()

### 指令
Directive用于添加行为到已有元素或者组件。

### Promise和Observable
对于Observable对象，可以使用toPromise()转化成Promise。
- Promise无论是否调用，都会立即执行。Observable只是被创建，当调用subscribe的时候才执行。
- Promise只返回一个值，Observable可以返回多个值。
- Observable可以使用pipe管道支持map,filter,reduce等操作
- Observable可以取消

### Angular提高性能
- AOT编译
- 应用程序已经最小化 uglify和tree shaking
- 去掉不必要的import语句
- 确保应用中已经移除了不使用的第三方库
- 项目较大时，考略延迟加载

### Component
Shadow DOM是HTML规范的一部分，允许开发人员封装自己的HTML标记，CSS样式和JavaScript。
`encapsulation: ViewEncapsulation.ShadowDom`
- ViewEncapsulation.Emulated - 通过 Angular 提供的样式包装机制来封装组件，使得组件的样式不受外部影响。这是 Angular 的默认设置。
- ViewEncapsulation.Native - 使用原生的 Shadow DOM 特性。但需要考虑浏览器是否支持。
- ViewEncapsulation.None - 无 Shadow DOM，并且也无样式包装

### Service
服务（Service）充当着数据访问，逻辑处理的功能。把组件和服务区分开，以提高模块性和复用性。

### 单例服务
把 @Injectable() 的 providedIn 属性声明为 root, 即为单例服务，可以用于临时存放全局变量。

