## Angular路由

> Base href

index.html中存在`<`base`>`标签,路由需要根据这个来确定应用程序的根目录。例如，当我们转到`http://example.com/page1`时，如果我们没有定义应用程序的基础路径，路由将无法知道我们的应用的托管地址是`http://example.com`还是`http://example.com/page1`。
```
<!doctype html>
<html>
  <head>
    <base href="/">
    <title>Application</title>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```
> Using the router

要使用路由，我们需要在 AppModule 模块中，导入 RouterModule
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ]
})
export class AppModule {}
```
> RouterModule.forRoot()

RouterModule.forRoot() 方法用于在主模块中定义主要的路由信息，通过调用该方法使得我们的主模块可以访问路由模块中定义的所有指令。
```
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = []; // 便于我们在需要的时候导出ROUTES到其他模块中

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
})
export class AppModule {}
```
> RouterModule.forChild()

RouterModule.forChild() 与 Router.forRoot() 方法类似，但它只能应用在特性模块中。

`根模块中使用 forRoot()，子模块中使用 forChild()。`
```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  // ...
})
export class ChildModule {}
```
> Dynamic routes

如果路由始终是静态的，那没有多大的用处。使用动态路由我们可以根据不同的路由参数，渲染不同的页面。
```
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: '/profile/:username', component: ProfileComponent }
];
```

/routeUrl/:params

:params是路由参数，而不是URL的实际部分。

在访问路由的时候routerLink或者navigate的时候就可以直接传递参数。

```
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'profile-page',
  template: `
    <div class="profile">
      <h3>{{ username }}</h3>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  username: string;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.params.subscribe((params) => this.username = params.username);
  }
}
```
> 路由配置

1、最基础的路由只需配置 path 和 component 两个属性即可，分别表示路由路径和该路径所对应的组件。

2、path 值为 '' 时，表示当匹配到路径为空时匹配该路由，结合pathMatch和redirectTo属性，我们可以用它来配置默认路由。
```
pathMatch可用来设置路由的匹配规则，有两个可选值prefix和full，默认值是：prefix。
prefix 表示只匹配前缀，当path值为home时，/home, /home/123, 都能匹配到该路由。
full 表示要进行完整的匹配，当path值为home时，只有/home能匹配到该路由，, /home/123不能匹配到该路由。 
当路由配置项中有{path: '',redirectTo: '/home'}， 但没有设置pathMatch为full时，angular会报错，因为pathMatch默认值是prefix，因为所有的路由前缀都能匹配到''。
```

3、redirectTo 不具有传递性

4、path 值为 ** 时，表示当所有路径都匹配不到时匹配该路由，这通常被用来设置 404 页面。

5、routes里面Route的顺序很重要，解析的时候是从上往下解析的，遇到匹配的Route即停止，所以通配符路由一般放在最后。

6、我们可以通过enableTracing: true，开启调试模式。

> Child routes

每个路由都支持子路由，在setttings路由中定义了两个子路由，它们将继承父路由的路径。
```
import { SettingsComponent } from './settings/settings.component';
import { ProfileSettingsComponent } from './settings/profile/profile.component';
import { PasswordSettingsComponent } from './settings/password/password.component';

export const ROUTES: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'password', component: PasswordSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
})
export class AppModule {}
```
SettingsComponent组件中需要添加router-outlet指令，因为我们要在设置页面中呈现子路由。
```
import { Component } from '@angular/core';

@Component({
  selector: 'settings-page',
  template: `
    <div class="settings">
      <settings-header></settings-header>
      <settings-sidebar></settings-sidebar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class SettingsComponent {}
```
> loadChildren

SettingsModule 模块，用来保存所有 setttings 相关的路由信息：
```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'password', component: PasswordSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
})
export class SettingsModule {}
```
在 SettingsModule 模块中我们使用 forChild() 方法，因为 SettingsModule 不是我们应用的主模块。

另一个主要的区别是我们将 SettingsModule 模块的主路径设置为空路径 ('')。因为如果我们路径设置为 /settings ，它将匹配 /settings/settings ，很明显这不是我们想要的结果。通过指定一个空的路径，它就会匹配 /settings 路径，这就是我们想要的结果。

AppModule
```
export const ROUTES: Routes = [
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
  // ...
})
export class AppModule {}
```
通过 loadChildren 属性，告诉 Angular 路由依据 loadChildren 属性配置的路径去加载 SettingsModule 模块。这就是模块懒加载功能的具体应用，当用户访问 /settings/** 路径的时候，才会加载对应的 SettingsModule 模块，这减少了应用启动时加载资源的大小。

- loadChildren 的属性值，该字符串由三部分组成：
    - 需要导入模块的相对路径
    - `#`分隔符
    - 导出模块类的名称

*当使用绝对路径时，ngModule的文件位置必须以src/app开头，以便正确解析，对于自定义的使用绝对路径的路径映射表，项目的tsconfig.json中必须配置好baseUrl和paths属性*

### CanLoad守卫：保护对特性模块的未授权加载
控制module的加载，如果无法访问任何一个组件，就不应该加载module。
```
// auth.guard.ts
canLoad(route: Route): boolean {
  let url = `/${route.path}`;

  return this.checkLogin(url);
}

// routing.module.ts
{
  path: 'admin',
  loadChildren: './admin/admin.module#AdminModule',
  canLoad: [AuthGuard]
}
```

### 预加载
介于立即加载与惰性加载之间，如果确定某一模块在之后一定会访问，那么在加载完立即加载模块之后，几乎立即开始后台加载所需的module。
Router内置了两种预加载策略：
- 完全不预加载，这是默认值，惰性加载的特性区任然会按需加载
-  预加载所有惰性加载的特性区
路由器还支持自定义预加载策略，以便完全控制要加载那些模块以及何时加载。

RouterModule.forRoot 方法的第二个参数接受一个附加配置选项对象。 preloadingStrategy 就是其中之一。
```
// 以下会让Router预加载立即加载所有惰性加载路由（带loadChildren属性的路由）
//  routing.module.ts
RouterModule.forRoot(
  appRoutes,
  {
    enableTracing: true, // <-- debugging purposes only 可以去掉
    preloadingStrategy: PreloadAllModules
  }
)
```
#### CanLoad会阻塞预加载
PreloadAllModules策略不会加载被CanLoad守卫所保护的特性区，CanLoad守卫的优先级高于预加载策略。如果你要加载一个模块并且保护它防止未授权访问，只单独依赖CanActivate守卫。

#### 自定义预加载策略
控制路由器预加载那些路由以及如何加载。
```
// routing.module.ts
{
  path: 'crisis-center',
  loadChildren: './crisis-center/crisis-center.module#CrisisCenterModule',
  data: { preload: true }
}

// SelectivePreloadingStrategyService
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);

      // log the route path to the console
      console.log('Preloaded: ' + route.path);

      return load();
    } else {
      return of(null);
    }
  }
}
```
SelectivePreloadingStrategyService 中实现了PreloadingStrategy，它只有一个方法preload，路由器会用两个参数嗲用preload方法：
- 要加载的路由
- 一个加载器（loader）函数，它能异步加载带路由的模块

preload的实现必须返回一个Observable，如果该路由应该预加载，它就会返回调用加载器函数所返回的Observable。如果该路由不应该预加载，他就返回一个null值的Observable对象。 SelectivePreloadingStrategyService 会把所选路由的 path 记录在它的公共数组 preloadedModules 中。

在component中注入该服务，并且显示他的preloadModules数组。修改AppRoutingModule，
- 把 SelectivePreloadingStrategyService 导入到 AppRoutingModule 中。
- 把 PreloadAllModules 策略替换成对 forRoot 的调用，并且传入这个 SelectivePreloadingStrategyService。
- 把 SelectivePreloadingStrategyService 策略添加到 AppRoutingModule 的 providers 数组中，以便它可以注入到应用中的任何地方。
  ```
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy:  SelectivePreloadingStrategyService })
  ],
  providers: [SelectivePreloadingStrategyService ],
  ```

```
// component.ts
import { Component, OnInit }    from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { Observable }           from 'rxjs';
import { map }                  from 'rxjs/operators';

import { SelectivePreloadingStrategyService } from '../../selective-preloading-strategy.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  sessionId: Observable<string>;
  token: Observable<string>;
  modules: string[];

  constructor(
    private route: ActivatedRoute,
    preloadStrategy: SelectivePreloadingStrategyService
  ) {
    this.modules = preloadStrategy.preloadedModules;
  }

  ngOnInit() {
    // Capture the session ID if available
    this.sessionId = this.route
      .queryParamMap
      .pipe(map(params => params.get('session_id') || 'None'));

    // Capture the fragment if available
    this.token = this.route
      .fragment
      .pipe(map(fragment => fragment || 'None'));
  }
}
```

