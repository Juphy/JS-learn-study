## angular开启hash模式

Hash 模式是基于锚点定位的内部链接机制，在 URL 加上 # ，然后在 # 后面加上 hash 标签，根据不同的标签做定位

- 针对初始化时带有路由的项目

```
配置路由时，routing.module.ts文件中，
@NgModule({
  imports: [RouterModule.forRoot(routes , { useHash: true })],
  exports: [RouterModule]
})
```

- app.module.ts中进行配置

```
// 引入相关服务
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
// 在@NgModule中的配置如下 | 服务依赖注入
providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
```

** URL 中包含的 hash 信息是不会提交到服务端，所以若要使用 SSR (Server-Side Rendered) ，就不能使用 Hash 模式即不能使用 HashLocationStrategy 策略。**