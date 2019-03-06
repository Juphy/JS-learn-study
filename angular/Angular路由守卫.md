### Angular路由守卫
在路由配置中添加守卫，来处理以下这些情景：
- 该用户可能无权导航到目标组件。
- 可能用户得先登录（认证）。
- 在显示目标组件前，你可能得先获取某些数据。
- 在离开组件前，你可能要先保存修改。
- 你可能要询问用户：你是否要放弃本次更改，而不用保存它们？

守卫返回一个值，以控制路由器的行为：
- 如果返回true，导航过程会继续
- 如果返回false。导航过程就会终止，且用户留在原地
- 如果返回urlTree，则取消当前的导航，并且开始导航到返回的这个urlTree

守卫可以用同步的方式返回一个布尔值，但在很多的情况下，守卫无法用同步的方式给出答案，守卫可能会向用户问一个问题、把更改保存到服务器，或者获取新数据，而这些都是异步操作。因此守卫返回一个Observable或者promise，提供给路由器的可观察对象还必须能结束（complete），否则导航就不会继续。

路由守卫的接口：
- 用CanActivate来处理导航到某路由的情况。
- 用CanActivateChild来处理导航到某子路由的情况。
- 用CanDeactivate来处理从当前路由离开的情况.
- 用Resolve在路由激活之前获取路由数据。
- 用CanLoad来处理异步导航到某特性模块的情况。

在分层路由的每个级别上，可以设置多个守卫，路由器会先按照从最深的子路由由下往上的顺序检查CanDeactivate()和CanActivateChild()守卫，然后按照从上到下的顺序检查CanActivate()守卫，如果特性模块是异步加载，在加载它之前还会检查CanLoad()守卫。

### CanActivate：要求认证
应用程序根据访问者来决定是否授予某个特性区的访问权，只对已认证过的用户授予访问权，还可以阻止或者限制用户访问权。

- ActivatedRouteSnapshot 即将被激活的路由
- RouterStateSnapshot 即将到达的状态

```
src/app/admin

    admin
        admin.component.css
        admin.component.html
        admin.component.ts

    admin-dashboard
        admin-dashboard.component.css
        admin-dashboard.component.html
        admin-dashboard.component.ts

    manage-crises
        manage-crises.component.css
        manage-crises.component.html
        manage-crises.component.ts

    manage-heroes
        manage-heroes.component.css
        manage-heroes.component.html
        manage-heroes.component.ts

    admin.module.ts
    admin-routing.module.ts
```
```
// auth.service.ts AuthService服务用于认证
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
isLoggedIn用来标识是否用户已经登陆过了，login方法会仿真一个对外的服务API调用，返回一个可观察对象（observable），在短暂的停顿之后，这个可观察对象就会解析成功。redirectUrl 属性将会保存在 URL 中，以便认证完之后导航到它。

// auth.guard.ts    调用AuthService
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}

// admin-routing.module.ts
...
const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'crises', component: ManageCrisesComponent },
          { path: 'heroes', component: ManageHeroesComponent },
          { path: '', component: AdminDashboardComponent }
        ],
      }
    ]
  }
];
...
可以往路由守卫中注入有用的服务，CanActivate守卫会返回一个同步的布尔值，如果用户已经登陆，就会返回true，导航继续。
如果用户还没有登陆，用RouterStateSnapshot.url保存用户来自的URL并让路由器导航到登录页，这导致路由器自动终止了这次导航，so，checkLogin()返回false并不是必须的，但这样表达更清楚。
```

### CanActivateChild：保护子路由
 CanActivateChild 守卫和 CanActivate 守卫很像。 它们的区别在于，CanActivateChild 会在任何子路由被激活之前运行。
 ```
 // auth.guard.ts

 import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}

// admin-routing.module.ts 路由管理，添加AuthGuard到无组件路由，保护它的所有子路由，而不是为每一个路由单独添加AuthGuard。
const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'crises', component: ManageCrisesComponent },
          { path: 'heroes', component: ManageHeroesComponent },
          { path: '', component: AdminDashboardComponent }
        ]
      }
    ]
  }
];
 ```
### CanDeactivate：保存为保存的更改
当用户导航到外面时，该怎样处理没保存的更改？so，需要用户自己判断，是否停在该路由进行操作还是放弃已操作的改动。这就需要应用弹出一个对话框来要求用户明确做出选择，该对话框会用异步的方式等用户做出选择。
```
// dialog.service.ts 添加一个confirm()方法，以提醒用户确认。window.confirm()是一个阻塞型操作。它会显示一个模态对话框，等待用户的交互。
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  /**
   * Ask user to confirm an action. `message` explains the action and choices.
   * Returns observable resolving to `true`=confirm or `false`=cancel
   */
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Is it OK?');

    return of(confirmation);
  };
}
DialogService返回observable，当用户最终决定了如何去做时，它会被解析——或者决定放弃更改直接导航离开（true），或者保留未完成的修改，留在之前路由（false）。

// can-deactivate.guard.ts
import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable }    from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

创建一个Guard，它将检查这个组件是否有canDeactivate()函数，该守卫并不需要知道组件确认退出激活状态的详情，只需要检查组件是否有一个canDeactivate()方法，并调用它。

// component
canDeactivate(): Observable<boolean> | boolean {
  // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
  if (!this.crisis || this.crisis.name === this.editName) {
    return true;
  }
  // Otherwise ask the user with the dialog service and return its
  // observable which resolves to true or false when the user decides
  return this.dialogService.confirm('Discard changes?');
}
```


以下是为组件创建一个特定的CanDeactivate守卫。
```
// can-deactivate.guard.ts
import { Injectable }           from '@angular/core';
import { Observable }           from 'rxjs';
import { CanDeactivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }  from '@angular/router';
import { CrisisDetailComponent } from './crisis-center/crisis-detail/crisis-detail.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CrisisDetailComponent> {

  canDeactivate(
    component: CrisisDetailComponent, // 当前的组件
    route: ActivatedRouteSnapshot,  // 当前路由快照
    state: RouterStateSnapshot,  // 当前路由状态
    nextState?: RouterStateSnapshot  // 即将进入的路由状态
  ): Observable<boolean> | boolean {
    // Get the Crisis Center ID 路由的状态
    console.log(route.paramMap.get('id'));

    // Get the current URL 当前的路由
    console.log(state.url);

    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!component.crisis || component.crisis.name === component.editName) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return component.dialogService.confirm('Discard changes?');
  }
}

// routing.module.ts 往路由配置中添加canDeactivate
const crisisCenterRoutes: Routes = [
  {
    path: 'crisis-center',
    component: CrisisCenterComponent,
    children: [
      {
        path: '',
        component: CrisisListComponent,
        children: [
          {
            path: ':id',
            component: CrisisDetailComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: '',
            component: CrisisCenterHomeComponent
          }
        ]
      }
    ]
  }
];
```

### Resolve：预先获取组件数据
真实API会有数据返回延迟的状况，导致无法即时显示，因此最好预先在服务器上获取数据，这样路由激活的那一刻数据就准备好了，还要处理路由到达此组件之前处理好错误。总之就是只有当所有必要数据都已经拿到之后，才渲染这个路由组件。

将组件的ngOnInit中拿到相关的逻辑，并把它们转移到专门的ResolveService中，导入必要的数据模型，服务service以及Router以便可以导航到别处。
```
以下时具体的一些实现：

为了更明确一点，可以实现一个带有 Crisis 类型的 Resolve 接口。

注入 CrisisService 和 Router，并实现 resolve() 方法。 该方法可以返回一个 Promise、一个 Observable 来支持异步方式，或者直接返回一个值来支持同步方式。

CrisisService.getCrisis 方法返回一个可观察对象，以防止在数据获取完之前加载本路由。 Router 守卫要求这个可观察对象必须可结束（complete），也就是说它已经发出了所有值。 你可以为 take 操作符传入一个参数 1，以确保这个可观察对象会在从 getCrisis 方法所返回的可观察对象中取到第一个值之后就会结束。

如果它没有返回有效的 Crisis，就会返回一个 Observable，以取消以前到 CrisisDetailComponent 的在途导航，并把用户导航回 CrisisListComponent。修改后的 resolver 服务是这样的：

import { Injectable }             from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
}                                 from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap, take }         from 'rxjs/operators';

import { CrisisService }  from './crisis.service';
import { Crisis } from './crisis';

@Injectable({
  providedIn: 'root',
})
export class CrisisDetailResolverService implements Resolve<Crisis> {
  constructor(private cs: CrisisService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> | Observable<never> {
    let id = route.paramMap.get('id');

    return this.cs.getCrisis(id).pipe(
      take(1),
      mergeMap(crisis => {
        if (crisis) {
          return of(crisis);
        } else { // id not found
          this.router.navigate(['/crisis-center']);
          return EMPTY;
        }
      })
    );
  }
}
// routing.module.ts    将resolver添加到路由配置中
const crisisCenterRoutes: Routes = [
  {
    path: 'crisis-center',
    component: CrisisCenterComponent,
    children: [
      {
        path: '',
        component: CrisisListComponent,
        children: [
          {
            path: ':id',
            component: CrisisDetailComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              crisis: CrisisDetailResolverService
            }
          },
          {
            path: '',
            component: CrisisCenterHomeComponent
          }
        ]
      }
    ]
  }
];

// components.ts  在组件中直接获取所需的数据
ngOnInit() {
  this.route.data
    .subscribe((data: { crisis: Crisis }) => {
      this.editName = data.crisis.name;
      this.crisis = data.crisis;
    });
}
```
*路由器的这个 Resolve 接口是可选的。CrisisDetailResolverService 没有继承自某个基类。路由器只要找到了这个方法，就会调用它。*
*要依赖路由器调用此守卫。不必关心用户用哪种方式导航离开，这是路由器的工作。你只要写出这个类，等路由器从那里取出它就可以了。*

### 查询参数
定义一些所有路由中都可用的可选参数。
```
import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId },
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }
}
```
在导航之间保留查询参数和片段，而无需再次在导航中提供，在component中的router.navigate方法中，添加一个对象作为参数，该对象提供了queryParamsHanding和preserveFragement，用于传递当前的查询参数和片段到下一个路由。
```
// component.ts

// Set our navigation extras object
// that passes on our global query params and fragment
let navigationExtras: NavigationExtras = {
  queryParamsHandling: 'preserve',
  preserveFragment: true
};

// Redirect the user
this.router.navigate([redirect], navigationExtras);
```
查询参数和片段可通过 Router 服务的 routerState 属性使用。和路由参数类似，全局查询参数和片段也是 Observable 对象。 在修改过的英雄管理组件中，你将借助 AsyncPipe 直接把 Observable 传给模板。
```
import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { Observable }         from 'rxjs';
import { map }                from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  sessionId: Observable<string>;
  token: Observable<string>;

  constructor(private route: ActivatedRoute) {}

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
