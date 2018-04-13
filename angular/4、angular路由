### Dynamic routes

/routeUrl/:params

:params是路由参数，而不是URL的实际部分

然后在访问路由的时候routerLink或者navigate的时候就可以直接传递参数

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