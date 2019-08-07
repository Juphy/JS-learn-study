## 基础使用
当复用一个组件时，大部分的内容是相同的，只有一部分的内容是不同的，这时可以使用`ng-content`指令来提高组件的复用性。
内容投影，即通过使用<ng-content>指令来实现内容投影的功能。

以下User的定义如下：

```
User定义内容：
export interface User {
  email: string;
  password: string;
}
```

定义一个ChildComponent组件：

```
import { Component, Output, EventEmitter } from "@angular/core";

import { User } from "./auth-form.interface";

@Component({
  selector: "app-child",
  template: `
    <div>
      <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
        <ng-content></ng-content>
        <label>
          邮箱
          <input type="email" name="email" ngModel>
        </label>
        <label>
          密码
          <input type="password" name="password" ngModel>
        </label>
        <button type="submit">
          提交
        </button>
      </form>
    </div>
  `
})
export class ChildComponent {
  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  onSubmit(value: User) {
    this.submitted.emit(value);
  }
}
```

在ParentComponent组件中，使用已经定义的ChildComponent组件：

```
import { Component } from "@angular/core";

import { User } from "./auth-form/auth-form.interface";

@Component({
  selector: "app-parent",
  template: `
    <div>
      <app-child 
        (submitted)="createUser($event)">
        <h3>注册</h3>
        <button type="submit">
            注册
        </button>  
      </app-child>
      <app-child 
        (submitted)="loginUser($event)">
        <h3>登录</h3>
        <button type="submit">
        登录
        </button>
      </app-child>
    </div>
  `
})
export class ParentComponent {
  createUser(user: User) {
    console.log("Create account", user);
  }

  loginUser(user: User) {
    console.log("Login", user);
  }
}
```
在app-parent中app-child标签内的多余的html会被投影到ChildComponent组件的'ng-content'中。

## select
select属性支持CSS选择器（element，class，attribute[name=xxx]）来匹配所需要的内容。如果ng-content上没有设置select属性，他将接收全部内容，或接收不匹配的任何其他的ng-content元素的内容。如果有多个相同element，class等都会被ng-content投影。

```
<div>
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)" novalidate>
    <ng-content select="h3"></ng-content>
    <label>
      邮箱
      <input type="email" name="email" ngModel>
    </label>
    <label>
      密码
      <input type="password" name="password" ngModel>
    </label>
    <ng-content select="app-auth-remember"></ng-content>
    <ng-content select="button"></ng-content>
  </form>
</div>


// app-auth-remember组件内容

import {Component, OnInit, Output, EventEmitter} from '@angular/core';
@Component({
  selector: 'app-auth-remember',
  template: `
    <label>
      <input type="checkbox" (change)="onChecked($event.target.checked)">
      Keep me logged in
    </label>
  `,
  styleUrls: ['./auth-remember.component.css']
})
export class AuthRememberComponent implements OnInit {
  @Output() checked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
    console.log('初始化已完成！');
  }

  onChecked(value: boolean) {
    this.checked.emit(value);
  }
}
```
app-child的组件中ng-content的select属性分别对应h3和button，也就是分别映射h3标签和button标签。如果有多个ng-content标签都没有select属性，则默认最后一个ng-content匹配所有的标签。

`warning`：如果想要正确根据select属性投射内容，限制就是这些标签必须是组件标签的直接子节点。
如果不是直接子节点，将不会被匹配到，如果要解决这个问题就必须在需要被匹配到的标签上，加上属性`ngProjectAs="xxx"`，就可以通过`select="xxx"`进行投影。

### 组件投影
组件必须在带有ng-content的组件标签内，这样`ng-content`才能匹配到组件。当然这样操作会对性能有一定的影响，因为`ng-content`不会产生内容，他只是投影现有的内容，因此这些组件一开始已经被制造，投影内容的生命周期将被绑定到他被声明的地方，而不是在显示的地方。
child-component
```
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'demo-child-component',
    template: '<h3>我是child-component组件</h3>'
})
export class ChildComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        console.log('child-component初始化完成！');
    }
}
```

parent-component

```
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'parent-component',
    template: `
        <button (click)="show = !show">
            {{ show ? 'Hide' : 'Show' }}
        </button>
        <div class="content" *ngIf="show">
            <ng-content></ng-content>
        </div>
    `
})
export class ParentComponent implements OnInit {
    show = true;

    constructor() {
    }

    ngOnInit() {
    }
}
```
然后将child-component投射到parent-component中

```
<parent-component>
    <child-component></child-component>
</parent-component>
```
在控制台只能看到一次'child-component初始化完成！'，点击按钮切换，不在打印，说明该组件只被实例化了一次——未被销毁和重新创建。当然可以在parent-component标签中对要投影的组件进行控制。

## ContentChild

获取ng-content投射组件的内容

```
@Component({
   selector: "app-child",
   template: `
     <div>
       <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
         <ng-content select="h3"></ng-content>
         <label>
           Email address
           <input type="email" name="email" ngModel>
         </label>
         <label>
           Password
           <input type="password" name="password" ngModel>
         </label>
         <ng-content select="app-auth-remember"></ng-content>
         <div *ngIf="showMessage">
           保持登录状态30天
         </div>
         <ng-content select="button"></ng-content>
       </form>
     </div>
   `
 })
 export class AuthFormComponent implements AfterContentInit {
   showMessage: boolean;

   @ContentChild(AuthRememberComponent) remember: AuthRememberComponent;

   ngAfterContentInit() {
     if (this.remember) {
        // 因为在app-auth-remember组件已经将值checked进行EventEmitter处理且进行了emit，故而这里可以动态的获取值。
       this.remember.checked.subscribe(
         (checked: boolean) => (this.showMessage = checked)
       );
     }
   }
   // ...
 }
```
通过 ContentChild(AuthRememberComponent) 来设置获取的组件类型，此外我们在生命周期钩子 ngAfterContentInit 中通过订阅 remember 的 checked 输出属性来监听 checkbox 输入框的变化。

## ContentChildren
与ContentChild类似通过Content Projection方式设置的视图中获取匹配的多个元素，返回的结果是一个QueryList集合。
在parent-component中添加多个app-auth-remember：
```
@Component({
  selector: "app-parent",
  template: `
    <div>
      <app-child
        (submitted)="createUser($event)">
        <h3>注册</h3>
        <button type="submit">
          注册
        </button>
      </app-child>
      <app-child
        (submitted)="loginUser($event)">
        <h3>登录</h3>
        <app-auth-remember (checked)="rememberUser($event)"></app-auth-remember>
        <app-auth-remember (checked)="rememberUser($event)"></app-auth-remember>
        <app-auth-remember (checked)="rememberUser($event)"></app-auth-remember>
        <button type="submit">
          登录
        </button>
      </app-child>
    </div>
  `
})
export class AppComponent {
  // ...
}
```

然后在ChildComponent中引入ContentChildren装饰器

```
import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { AuthRememberComponent } from './auth-remember.component';
import { User } from './auth-form.interface';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
        <ng-content select="h3"></ng-content>
        <label>
          邮箱
          <input type="email" name="email" ngModel>
        </label>
        <label>
          密码
          <input type="password" name="password" ngModel>
        </label>
        <ng-content select="app-auth-remember"></ng-content>
        <div *ngIf="showMessage">
          保持登录30天
        </div>
        <ng-content select="button"></ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent implements AfterContentInit {

  showMessage: boolean;

  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;

  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  ngAfterContentInit() {
    if (this.remember) {
      this.remember.forEach((item) => {
        item.checked.subscribe((checked: boolean) => this.showMessage = checked);
      });
    }
  }

  // ...
}
```
ContentChildren 装饰器返回的是一个 QueryList 集合，在 ngAfterContentInit 生命周期钩子中，我们通过 QueryList 实例提供的 forEach 方法来遍历集合中的元素。QueryList 实例除了提供 forEach() 方法之外，它还提供了数组常用的方法，比如 map()、filter()、find()、some() 和 reduce() 等方法。

