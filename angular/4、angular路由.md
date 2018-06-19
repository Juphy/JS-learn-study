## angular路由

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
// ...
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = []; // 便于我们在需要的时候导出ROUTES到其他模块中

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
  // ...
})
export class AppModule {}
```
> RouterModule.forChild()

RouterModule.forChild() 与 Router.forRoot() 方法类似，但它只能应用在特性模块中。

*根模块中使用 forRoot()，子模块中使用 forChild()。*
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


如果存在多层路由，在访问路由的时候，需要在路由的起始位置加上'/'。

['/routerUrl', params]，使用路由传递动态的路由地址。

```
<nav>
  <a routerLink="/settings" routerLinkActive="active">Home</a>
  <a routerLink="/settings/password" routerLinkActive="active">Change password</a>
  <a routerLink="/settings/profile" routerLinkActive="active">Profile Settings</a>
</nav>
```

通过使用 routerLinkActive 指令，当 a 元素对应的路由处于激活状态时，active 类将会自动添加到 a 元素上。

```
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <h3>Users</h3>
      <div *ngFor="let user of users">
        <user-component
          [user]="user"
          (select)="handleSelect($event)">
        </user-component>
      </div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  users: Username[] = [
    { name: 'toddmotto', id: 0 },
    { name: 'travisbarker', id: 1 },
    { name: 'tomdelonge', id: 2 }
  ];

  constructor(private router: Router) {}

  handleSelect(event) {
    this.router.navigate(['/profile', event.name]);
  }
}
```

@angular/router上的navigate(['routerUrl'])，navigate(['routerUrl', params])，navigateBuUrl('routerUrl')