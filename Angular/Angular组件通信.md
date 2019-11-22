## 输入属性（父组件->子组件）

> @Input，自定义属性

app.component.ts

```
import { Component } from '@angular/core';

@Component({
  selector: 'exe-app',
  template: `
   <exe-counter [initialCount]="initialCount"></exe-counter>
  `
})
export class AppComponent {
  initialCount: number = 5;
}
```

counter.component.ts

```
import { Component, Input } from '@angular/core';

@Component({
    selector: 'exe-counter',
    template: `
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    `
})
export class CounterComponent {
    @Input('initialCount') count: number = 0; // 为子属性count指定别名initialCount

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
}
```

> 通过 setter 监听输入属性值的变化

child.component.ts

```
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-name-child',
  template: '<h3>"{{name}}"</h3>'
})
export class NameChildComponent {
  private _name = '';

  @Input()
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>'; // trim掉名字里的空格，并把控制替换成默认字符串。
  }

  get name(): string { return this._name; }
}
```

parent.component.ts

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-name-parent',
  template: `
  <h2>Master controls {{names.length}} names</h2>
  <app-name-child *ngFor="let name of names" [name]="name"></app-name-child>
  `
})
export class NameParentComponent {
  // Displays 'Dr IQ', '<no name set>', 'Bombasto'
  names = ['Dr IQ', '   ', '  Bombasto  '];
}
```

> 通过 ngOnChanges()来监听属性值的变化

child.components.ts

```
import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-version-child',
  template: `
    <h3>Version {{major}}.{{minor}}</h3>
    <h4>Change log:</h4>
    <ul>
      <li *ngFor="let change of changeLog">{{change}}</li>
    </ul>
  `
})
export class VersionChildComponent implements OnChanges {
  @Input() major: number;
  @Input() minor: number;
  changeLog: string[] = [];

  // 监听major和minor
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
  }
}
```

parent.component.ts

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-version-parent',
  template: `
    <h2>Source code version</h2>
    <button (click)="newMinor()">New minor version</button>
    <button (click)="newMajor()">New major version</button>
    <app-version-child [major]="major" [minor]="minor"></app-version-child>
  `
})
export class VersionParentComponent {
  major = 1;
  minor = 23;

  newMinor() {
    this.minor++;
  }

  newMajor() {
    this.major++;
    this.minor = 0;
  }
}
```

## 输出属性（子组件->父组件）

> @Output()，自定义事件

_子组件暴露一个 EventEmitter 属性，当事件发生时，子组件利用该属性 emits（向上弹射）事件。父组件绑定到这个事件属性，并在事件发生时做出回应_

app.component.ts

```
import { Component } from '@angular/core';

@Component({
  selector: 'exe-app',
  template: `
   <p>{{changeMsg}}</p>
   <exe-counter [count]="initialCount"
    (change)="countChange($event)"></exe-counter>
  `
})
export class AppComponent {
  initialCount: number = 5;

  changeMsg: string;

  countChange(event: number) {
    this.changeMsg = `子组件change事件已触发，当前值是: ${event}`;
  }
}
// 自定义事件change，接收发送过来的数据。
```

counter.component.ts

```
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'exe-counter',
    template: `
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    `
})
export class CounterComponent {
    @Input() count: number = 0;

    @Output() change: EventEmitter<number> = new EventEmitter<number>();

    increment() {
        this.count++;
        this.change.emit(this.count);
    }

    decrement() {
        this.count--;
        this.change.emit(this.count);
    }
}
// 当值改变时，通过事件发射数据接收。
```

child.component.ts

```
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-voter',
  template: `
    <h4>{{name}}</h4>
    <button (click)="vote(true)"  [disabled]="didVote">Agree</button>
    <button (click)="vote(false)" [disabled]="didVote">Disagree</button>
  `
})
export class VoterComponent {
  @Input()  name: string;
  @Output() voted = new EventEmitter<boolean>();
  didVote = false;

  // 点击按钮触发true或false（布尔型有效载荷）的事件
  vote(agreed: boolean) {
    this.voted.emit(agreed);
    this.didVote = true;
  }
}
```

parent.component.ts

```
import { Component }      from '@angular/core';

@Component({
  selector: 'app-vote-taker',
  template: `
    <h2>Should mankind colonize the Universe?</h2>
    <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>
    <app-voter *ngFor="let voter of voters"
      [name]="voter"
      (voted)="onVoted($event)">
    </app-voter>
  `
})
export class VoteTakerComponent {
  agreed = 0;
  disagreed = 0;
  voters = ['Narco', 'Celeritas', 'Bombasto'];

  onVoted(agreed: boolean) {
    agreed ? this.agreed++ : this.disagreed++;
  }
}
```

## 双向绑定

> [()]，Angular 的双向绑定

_通过修改绑定属性的方式，使用双向绑定即可，此时在子组件中只需要接收数据。_

## 模板变量

> 通过子组件标签的#child,则 child 就相当于子组件 component。

parent.component.ts

```
import {Component, OnInit} from '@angular/core';
import {ChildComponent} from './child-component.ts';

@Component({
  selector: 'parent-component',
  template: `
    <child-component #child></child-component>
    <button (click)="child.name = childName">设置子组件名称</button>
  `
})

export class ParentComponent implements OnInit {

  private childName: string;

  constructor() { }

  ngOnInit() {
    this.childName = 'child-component';
  }
}
```

child.component.ts

```
import {Component} from '@angular/core';

@Component({
  selector: 'child-component',
  template: `I'm {{ name }}`
})

export class ChildComponent {
  public name: string;
}
```

> 父组件与子组件通过本地变量互动

_通过把本地变量（#timer）放到子组件的标签上，来代表子组件。这样父组件的模板就得到了子组件的引用，于是可以在父组件的模板中访问子组件的所有属性和方法。_
child.component.ts

```
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  template: '<p>{{message}}</p>'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {

  intervalId = 0;
  message = '';
  seconds = 11;

  clearTimer() { clearInterval(this.intervalId); }

  ngOnInit()    { this.start(); }
  ngOnDestroy() { this.clearTimer(); }

  start() { this.countDown(); }
  stop()  {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.message = 'Blast off!';
      } else {
        if (this.seconds < 0) { this.seconds = 10; } // reset
        this.message = `T-${this.seconds} seconds and counting`;
      }
    }, 1000);
  }
}
```

parent.components.ts

```
import { Component } from '@angular/core';
import { CountdownTimerComponent }  from './countdown-timer.component';

@Component({
  selector: 'app-countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  // 把本地变量#timer放到<countdown-timer>标签中，用来代表子组件。

  <div class="seconds">{{timer.seconds}}</div>
  <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```

## 路由传参

ActivatedRoute 专门用于由 Angular 路由器加载的每个路由组件，它包含关于该路由、路由参数以及该路由关联的其他数据的信息。

### 在查询参数中传递参数

传递参数页面

```
<a [routerLink]="['/cinema-chain/cinema']" [queryParams]="{chain: 1}">查看影院</a>
```

点击跳转时，/cinema-chain/cinema?chain=1（?chain=1 就是从路由里面传递过来的参数）。

接收参数的页面

```
 constructor(private activatedRoute: ActivatedRoute) {
    const chain = this.activatedRoute.snapshot.queryParams['chain'];
  }
```

### 在 url 路由路径中传递参数

在 path 中传递参数就需要先修改原有的路径使其可以携带参数。

```
const routes: Routes = [
  {path: 'main/:type', loadChildren: './index/index.module#IndexModule'},
  {path: 'upload', loadChildren: './components/upload/upload.module#UploadModule'},
  {path: 'operation', loadChildren: './components/operation/operation.module#OperationModule'},
  {path: 'compare/:type', loadChildren: './components/compare/compare.module#CompareModule'},
  {path: '**', component: PageNotFoundComponent},
];
整个路径被划分成两段变量
```

传递参数页面

```
<a [routerLink]="['/home',2]">主页</a>
这里的routerLink是一个数组，第一个值为路由的跳转路径，第二值为路由携带参数的值，这里传递的值为2

或者这样传递
 constructor(private router: Router) {
    this.router.navigate(['/product',1]);
    this.router.navigateByUrl('/product/1');
 }

或者这样传递
<a routerLink="/home/{{变量名}}"></a>

```

页面跳转的结果：/home/2

接收参数页面

```
 constructor(private activatedRoute: ActivatedRoute) {
    const chain = this.activatedRoute.snapshot.params['id'];
    或者 chain = this.activatedRoute.snapshot.paramMap.get('id');
  }
```

_不能同时使用参数查询方式和路由路径 Url 方式传递同一个页面的参数，否则报错。_

### 参数快照和参数订阅

参数快照：获取路由中传递的参数的值得一个方法就用到了参数快照 snapshot。

```
<a [routerLink]="['/home',2]">主页</a>

change_id(){
  this.router.navigate(['/home',1]);
}
路由路径中想home同时传递了两个参数，1和2
```

当在页面第一次加载的时候会创建一次 home，将 2 这个值传入页面，当点击按钮出发 change_id 事件的时候也会导航到 home，但是在此之前主页已经被创建，并已经被赋值，此时导航到主页，主页并不会再次被创建，所以自然不会再次获取第二次导航过来的路由所携带的参数和值，但是路径变为了/home/1。

然而页面上的值仍然是 2，获取当前路由所传递的参数值失败。这就是参数快照的弱点，为了解决这个问题引入了参数订阅：subscribe()。

```
 constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
        const id = params['id'];
    });
  }
```

采用参数订阅的方式 subscribe()获取到一个类型为 Params 的属性 params，并返回 params 里面的 Id 复制给本地变量 homeID，这样就不会出现路径在变，但是页面里面的参数值不变的情况；

## @ViewChild 装饰器

`本地变量`（#timer）方法有局限性，因为父组件-子组件的连接必须全部在父组件的模板中进行，父组件本身的代码堆子组件没有访问权。如果父组件的类需要读取子组件的属性值或调用子组件的方法，就不能使用`本地变量`方法。当父组件类需要这种访问时，可以把子组件作为 ViewChild，注入到父组件里面。

> 父组件获取子组件数据需要借助@ViewChild(),子组件直接引用。

app.component.ts

```
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'my-app',
  template: `
    <h4>Welcome to Angular World</h4>
    <exe-child></exe-child>
  `,
})
export class AppComponent {
  @ViewChild(ChildComponent, {static: false}) // V8需要添加{ static: false }参数
  childCmp: ChildComponent;

  ngAfterViewInit() {
    console.log(this.childCmp.name); // "child-component"
  }
}
```

child.component.ts

```
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'exe-child',
    template: `
      <p>Child Component</p>
    `
})
export class ChildComponent {
    name: string = '';
    constructor(private appcomponent:AppComponent) {
      this.name='child-component'
    }
}
```

```
// child
@Component({
    selector: 'app-countdown-child',
    template: '<p>{{message}}</p>'
})
export class CountdownChildComponent implements OnInit, OnDestroy {

    intervalId = 0;
    message = '';
    seconds = 11;

    clearTimer() { clearInterval(this.intervalId); }

    ngOnInit() { this.start(); }
    ngOnDestroy() { this.clearTimer(); }

    start() { this.countDown(); }
    stop() {
        this.clearTimer();
        this.message = `Holding at T-${this.seconds} seconds`;
    }

    private countDown() {
        this.clearTimer();
        this.intervalId = window.setInterval(() => {
            this.seconds -= 1;
            if (this.seconds === 0) {
                this.message = 'Blast off!';
            } else {
                
                if (this.seconds < 0) { this.seconds = 10; } // reset
                this.message = `T-${this.seconds} seconds and counting`;
            }
        }, 1000);
    }
}

// parent
@Component({
    selector: 'app-countdown-parent-vc',
    template: `
    <h3>Countdown to Liftoff (via ViewChild)</h3>
    <button (click)="start()">Start</button>
    <button (click)="stop()">Stop</button>
    <div class="seconds">{{ seconds() }}</div>
    <app-countdown-child></app-countdown-child>
  `,
    styles: [`
        .seconds {
            background-color: black;
            color: red;
            font-size: 3em;
            margin: 0.3em 0;
            text-align: center;
            width: 1.5em;
        }
    `]
})
export class CountdownParentViewChildComponent implements AfterViewInit {
    @ViewChild(CountdownChildComponent, { static: false })
    private countdownChild: CountdownChildComponent;

    seconds() { return 0; }

    ngAfterViewInit() {
        setTimeout(() => this.seconds = () => this.countdownChild.seconds, 0);
    }
    start() {
        this.countdownChild.start();
    }
    stop() {
        this.countdownChild.stop();
    }
}
```

## 基于 RxJS Subject

`rxjs版本基于6需要结合rxjs-compat使用`
message.service.ts

```
import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MessageService {
  private subject = new Subject<any>();
  message: any;

  sendMessage(message: any) {
    this.message = message;
    this.subject.next(message);
    this.subject.complete();
  }

  clearMessage() {
    this.message = null;
    this.subject.next();
  }

  getMessage(): Observable<any> {
    // return this.subject.asObservable(); // 数据一直在维持，会产生变化
    return of(this.message); // 数据值传递一次
  }
}
```

home.component.ts

```
import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
    selector: 'exe-home',
    template: `
    <div>
        <h1>Home</h1>
        <button (click)="sendMessage()">Send Message</button>
        <button (click)="clearMessage()">Clear Message</button>
    </div>`
})

export class HomeComponent {
    constructor(private messageService: MessageService) {}

    sendMessage(): void {
        this.messageService.sendMessage('Message from Home Component to App Component!');
    }

    clearMessage(): void {
        this.messageService.clearMessage();
    }
}
```

app.component.ts

```
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './message.service';

@Component({
    selector: 'my-app',
    template: `
    <div>
       <div *ngIf="message">{{message.text}}</div>
       <exe-home></exe-home>
    </div>
    `
})

export class AppComponent implements OnDestroy {
    message: any;
    subscription: Subscription;

    constructor(private messageService: MessageService) {
        this.subscription = this.messageService.getMessage().subscribe( message => {
                                      this.message = message;
                                 });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
```

_更多[RxJS 知识以及用法](https://github.com/RxJS-CN)_
