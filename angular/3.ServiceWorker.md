## Service Worker
增强传统的 Web 发布模式，并使应用程序能够提供可与本机代码媲美的高可靠、高性能的用户体验。为 Angular 应用添加 Service Worker 是把应用转换成渐进式应用（PWA）的步骤之一。简单来说，Service Worker 就是一段运行在 Web 浏览器中，并为应用管理缓存的脚本。

Service Worker 的功能就像一个网络代理。它们会拦截所有由应用发出的 HTTP 请求，并选择如何给出响应。 比如，它们可以查询局部缓存，如果有缓存的响应数据，就用它做出响应。 这种代理行为不会局限于通过程序调用 API（比如fetch）发起的请求，还包括 HTML 中对资源的引用，甚至对 index.html 的首次请求。 基于 Service Worker 的缓存是完全可编程的，并且不依赖于服务端指定的那些控制缓存策略的头。

Angular 的 Service Worker 的行为遵循下列设计目标：
- 像安装原生应用一样缓存应用。该应用作为整体被缓存，它的所有文件作为整体进行更新。
- 正在运行的应用使用所有文件的同一版本继续运行。不要突然开始接收来自新版本的、可能不兼容的缓存文件。
- 当用户刷新本应用时，他们会看到最新的被完全缓存的版本。新的页标签中会加载最新的缓存代码。
- 在更改发布之后，相对较快的在后台进行更新。在一次完整的更新完成之前，仍然使用应用的上一个版本。
- 只要有可能，Service Worker 就会尽量节省带宽。它只会下载那些发生了变化的资源。

要支持这些行为，Angular 的 Service Worker 会从服务器上下载一个 manifest 文件。 这个 manifest 文件描述要缓存的资源，并包含每个文件内容的哈希值。 当发布了应用的一个新版本时，manifest 的内容就会改变，通知 Service Worker 应该下载并缓存应用的一个新版本了。 这个 manifest 是从 CLI 生成的一个名叫 ngsw-config.json 的文件中生成的。

## Angular中添加Service Worker
```
ng add @angular/pwa
```
以上命令会自动完成以下步骤：
- 添加@angular/service-worker到项目中
- 在CLI中启用Service Worker的构建支持（angular.json）

![image](https://ws1.sinaimg.cn/large/8b2b1aafly1g0ima24x4ej20cp0kiweu.jpg)
- 在应用模块中导入注册Service Worker(app.module.ts)

![image](https://ws2.sinaimg.cn/large/8b2b1aafly1g0imd8mbr7j20n10iit9r.jpg)

- 修改index.html文件：
    - 包含mainfest.json文件的链接（mainfest.json详细）
    ![image](https://ws3.sinaimg.cn/large/8b2b1aafly1g0impkp5ywj20j40b7mxa.jpg)
    - 为theme-color添加meta标签

![image](https://wx2.sinaimg.cn/large/8b2b1aafly1g0imoskdmmj20kd04xaa3.jpg)

- 创建图标文件，以支持安装渐进式应用（PWA）（此步可忽略）

![image](https://wx2.sinaimg.cn/large/8b2b1aafly1g0imt440mpj20ln06taa6.jpg)

![image](https://wx4.sinaimg.cn/large/8b2b1aafly1g0imtadhioj20le06pglz.jpg)

- 创建一个ngsw-config.json的Service Worker配置文件，它会用来指定缓存的行为以及其他设定    

### Service Worker配置
配置文件src/ngsw-config.json指定Angular Service Worker应该缓存那些文件和数据的URL，以及如何更新缓存的文件和数据。Angular CLI会在ng build --prod期间处理配置文件。如果想要手动处理，可以使用ngsw-config工具。

该配置文件使用JSON格式，所有文件路径都必须以/开头，也就是部署目录，在CLI项目中通常是dist。

以下模式是使用受限的glob格式：
- ** 匹配0到多段路径
- `*` 匹配0个或更多个除/之外的字符
- ? 匹配除 / 之外的一个字符
- ! 前缀表示该模式是反的，也就是说只包含与该模式不匹配的文件

- appData
允许传递用来描述这个特定应用版本的任何数据。SwUpdate服务会在更新通知中包含这些数据，许多应用提供UI弹窗时要显示的附加信息，以便通知用户有可用的更新。

- index
指定用来充当索引页的文件以满足导航请求，通常是/index.html

- assetGroups
资产（Assets）是与应用一起更新的应用版本的一部分，它们可以包含从页面的同源加载的资源以及从CDN和其它外部URL加载的第三方资源。由于在构建时可能没法提前知道所有这些外部URL，因此也可以指定URL的模式。

该字段包含一个资产组的数组，每个资产组中会定义一组资产资源和它们的缓存策略。
```
{
    "assetsGroup":[{
        ...
    },{
        ...
    }]
}
```
每个资产组都会指定一组资源和一个管理它们的策略，此策略用来决定何时获取资源以及当检测到变更时该做什么。zhexie资产组会遵循下面的Typescript接口：
```
interface AssetGroup{
    name: string;
    installMode?: 'prefetch' | 'lazy';
    updateMode?: 'prefetch' | 'lazy';
    resources: {
        files?: string[];
        versionedFiles?: string[];
        urls?: string[];
    }
}
```
- name：必填。标识该配置文件版本中这个特定的资产组
- installMode：资源的缓存方式，默认prefetch，有如下取值：
    - prefetch告诉Angular Service Worker在缓存当前版本的应用时要获取每一个列出的资源，这是个带宽密集型的模式，但可以确保这些资源在请求时可用，即使浏览器正处于离线状态
    - lazy不会预先缓存任何资源，相反，Angular Service Worker只会缓存它收到请求的资源，这是一种按需缓存模式，永远不会请求的资源也永远不会被缓存。这对于不同分辨率提供的图片之类的资源很有用，那样Service Worker就只会为特定的屏幕和设备方向缓存正确的资源。
- updateMode： 对于已经存在于缓存中的资源，updateMode会决定在发现了新版本应用后的缓存行为。自上一版本以来更改过的所有组中资源都会根据updateMode进行更新。其默认值为installMode的值。
    - prefetch会告诉Service Worker立即下载并缓存更新过的资源
    - lazy告诉Service Worker不要缓存这些资源，而是先把它们看作未被请求的，等它们再次被请求时才进行更新。lazy这个updateMode只有在installMode也同样是lazy时才有效。