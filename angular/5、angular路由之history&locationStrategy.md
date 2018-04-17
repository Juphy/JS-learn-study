## History 对象

- 属性
    - length
    只读的，其值为一个整数，标志包括当前页面在内的会话历史中的记录数量，比如我们通常打开一个空白窗口，length 为 0，再访问一个页面，其 length 变为 1。

    - scrollRestoration
    允许 Web 应用在会话历史导航时显式地设置默认滚动复原，其值为 auto 或 manual。

    - state
    只读，返回代表会话历史堆栈顶部记录的任意可序列化类型数据值，我们可以以此来区别不同会话历史纪录
- 方法
    - back()
    返回会话历史记录中的上一个页面，等价于 window.history.go(-1) 和点击浏览器的后退按钮。

    - forward()
    进入会话历史记录中的下一个页面，等价于 window.history.go(1) 和点击浏览器的前进按钮。

    - go()
    加载会话历史记录中的某一个页面，通过该页面与当前页面在会话历史中的相对位置定位，如，-1 代表当前页面的上一个记录，1 代表当前页面的下一个页面。若不传参数或传入0，则会重新加载当前页面；若参数超出当前会话历史纪录数，则不进行操作。

    - pushState()
    在会话历史堆栈顶部插入一条记录，该方法接收三个参数，一个 state 对象，一个页面标题，一个 URL：

        - 状态对象

        > 存储新添会话历史记录的状态信息对象，每次访问该条会话时，都会触发 popstate 事件，并且事件回调函数会接收一个参数，值为该事件对象的复制副本。

        > 状态对象可以是任何可序列化的数据，浏览器将状态对象存储在用户的磁盘以便用户再次重启浏览器时能恢复数据

        > 一个状态对象序列化后的最大长度是 640K，如果传递数据过大，则会抛出异常

        - 页面标题

        > 目前该参数值会被忽略，暂不被使用，可以传入空字符串

        - 页面 URL

        > 此参数声明新添会话记录的入口 URL

        > 在调用 pushState() 方法后，浏览器不会加载 URL 指向的页面，我们可以在 popstate 事件回调中处理页面是否加载

        > 此 URL 必须与当前页面 URL 同源,，否则会抛异常；其值可以是绝对地址，也可以是相对地址，相对地址会被基于当前页面 URL 解析得到绝对地址；若其值为空，则默认是当前页面 URL

    - replaceState()
        - 更新会话历史堆栈顶部记录信息，支持的参数信息与 pushState() 一致。

        - pushState() 与 replaceState() 的区别：pushState()是在 history 栈中添加一个新的条目，replaceState() 是替换当前的记录值。此外这两个方法改变的只是浏览器关于当前页面的标题和 URL 的记录情况，并不会刷新或改变页面展示。

    - onpopstate 事件

        - window.onpopstate 是 popstate 事件在 window 对象上的事件句柄。每当处于激活状态的历史记录条目发生变化时，popstate 事件就会在对应 window 对象上触发。如果当前处于激活状态的历史记录条目是由 history.pushState() 方法创建，或者由 history.replaceState() 方法修改过的，则 popstate 事件对象的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝。

        - 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。popstate 事件只会在浏览器某些行为下触发，比如点击后退、前进按钮 (或者在 JavaScript 中调用 history.back()、history.forward()、history.go() 方法)。

        - 当网页加载时，各浏览器对 popstate 事件是否触发有不同的表现，Chrome 和 Safari 会触发 popstate 事件，而 Firefox 不会。

## Hash模式和Html5模式

### [Hash模式](./2、angular的hash模式.md)

### HTML5模式

HTML 5 模式则直接使用跟"真实"的 URL 一样，如上面的路径，在 HTML 5 模式地址如下：
```
https://segmentfault.com/u/angular4/user
```

- HTML5模式下URL有两种访问方式:
- 在浏览器地址栏直接输入 URL，这会向服务器请求加载页面。
- 在 Angular 应用程序中，访问 HTML 5 模式下的 URL 地址，这不需要重新加载页面，可以直接切换到对应的视图。

在 HTML 5 模式下，Angular 使用了 HTML 5 的 pushState() API 来动态改变浏览器的 URL 而不用重新刷新页面。

### 开启HTML5模式

导入 APP_BASE_HREF、LocationStrategy、PathLocationStrategy

```
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common'
```

配置NgModule-providers

```
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  ..,
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }
  ]
})
```

示例代码中的 APP_BASE_HREF，用于设置资源 (图片、脚本、样式) 加载的基础路径。除了在 NgModule 中配置 provider 外，我们也可以在入口文件，如 index.html 文件 <base> 标签中设置基础路径。

<base> 标签为页面上的所有链接规定默认地址或默认目标。通常情况下，浏览器会从当前文档的 URL 中提取相应的路径来补全相对 URL 中缺失的部分。使用 <base> 标签可以改变这一点。浏览器随后将不再使用当前文档的 URL，而使用指定的基本 URL 来解析所有的相对 URL。这其中包括 <a>、<img>、<link>、<form> 标签中的 URL。具体使用示例如下：

```
<base href="/">
```

## LocationStrategy

LocationStrategy 用于从浏览器 URL 中读取路由状态。Angular 中提供两种 LocationStrategy 策略：

- HashLocationStrategy

- PathLocationStrategy

以上两种策略都是继承于 LocationStrategy 抽象类，该类的具体定义如下：

```
export abstract class LocationStrategy {
  // 获取path路径
  abstract path(includeHash?: boolean): string;
  // 生成完整的外部链接
  abstract prepareExternalUrl(internal: string): string;
  // 添加会话历史状态
  abstract pushState(state: any, title: string, url: string,
      queryParams: string): void;
  // 修改会话历史状态
  abstract replaceState(state: any, title: string, url: string,
      queryParams: string): void;
  // 进入会话历史记录中的下一个页面
  abstract forward(): void;
  // 返回会话历史记录中的上一个页面
  abstract back(): void;
  // 设置popstate监听
  abstract onPopState(fn: LocationChangeListener): void;
  // 获取base地址信息
  abstract getBaseHref(): string;
}
```

### HashLocationStrategy

```
HashLocationStrategy 类继承于 LocationStrategy 抽象类，它的构造函数如下：

export class HashLocationStrategy extends LocationStrategy {
  constructor(
      private _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _baseHref?: string) {
      super();
      if (_baseHref != null) {
        this._baseHref = _baseHref;
      }
  }
}
```

该构造函数依赖 PlatformLocation 及 APP_BASE_HREF 关联的对象。APP_BASE_HREF 的作用，我们上面已经介绍过了，接下来我们来分析一下 PlatformLocation 对象。

### PlatformLocation

```
// angular2/packages/platform-browser/src/browser.ts
export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: Provider[] = [
  ...,
  {provide: PlatformLocation, useClass: BrowserPlatformLocation},
];
```

通过以上代码，我们可以知道在浏览器环境中，HashLocationStrategy 构造函数中注入的 PlatformLocation 对象是 BrowserPlatformLocation 类的实例。我们也先来看一下 BrowserPlatformLocation 类的构造函数：

```
// angular2/packages/platform-browser/src/browser/location/browser_platform_location.ts
export class BrowserPlatformLocation extends PlatformLocation {
  private _location: Location;
  private _history: History;

  constructor(@Inject(DOCUMENT) private _doc: any) {
    super();
    this._init();
  }

  _init() {
    this._location = getDOM().getLocation(); // 获取浏览器平台下Location对象
    this._history = getDOM().getHistory(); // 获取浏览器平台下的History对象
  }
}
```

在 BrowserPlatformLocation 构造函数中，我们调用 _init() 方法，在方法体中，我们调用 getDOM() 方法返回对象中的 getLocation() 和 getHistory() 方法，分别获取 Location 对象和 History 对象。那 getDOM() 方法返回的是什么对象呢？其实该方法返回的是 DomAdapter 对象。

### DomAdapter

```
let _DOM: DomAdapter = null !;

export function getDOM() {
  return _DOM;
}

export function setDOM(adapter: DomAdapter) {
  _DOM = adapter;
}

export function setRootDomAdapter(adapter: DomAdapter) {
  if (!_DOM) {
    _DOM = adapter;
  }
}
```
那什么时候会调用 setDOM() 或 setRootDomAdapter() 方法呢？通过查看 Angular 源码，我们发现在浏览器平台初始化时，会调用 setRootDomAdapter() 方法。具体如下：

```
export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: Provider[] = [
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
  ...
];
```