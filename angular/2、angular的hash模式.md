> 针对初始化时带有路由的项目

```
配置路由时，routing.module.ts文件中，
@NgModule({
  imports: [RouterModule.forRoot(routes , { useHash: true })],
  exports: [RouterModule]
})
```

> app.module.ts中进行配置

```
// 引入相关服务
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
// 在@NgModule中的配置如下 | 服务依赖注入
providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
```