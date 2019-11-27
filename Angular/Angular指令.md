Angular 中有三种类型的指令：

- 组件：拥有模板的指令
- 结构型指令：添加和移除 DOM 元素改变 DOM 布局的指令
- 属性型指令：改变元素、组件或其他的外观和行为的指令(ngStyle)

## 属性型指令

属性型指令至少需要一个带有@Directive 装饰器的控制器类。改装饰器指定了一个用于标识属性的选择器。控制器类实现了指令需要的指令行为。

```
<p appHighlight>Highlight</p>

ng generate directive highlight
==>
import { Directive } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor() { }
}
```

@Directive 装饰器的配置属性中指定了该指令的 CSS 属性型选择器`[`appHighlight]
这里的方括号([])表示它的属性型选择器，Angular 会在模板中定位每个
拥有名叫 appHighlight 属性的元素，并且为这些元素加上本指令的逻辑。
HighlightDirective 是该指令的控制器类，它包含了该指令的逻辑。

```
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighLightDirective {
  @Input('appHighlight') hightColor: string = "yellow";
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.hightlight(this.hightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hightlight(null);
  }

  private hightlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

<p [appHighlight]="color">Highlight me!</p>
```

> 绑定第二个属性

```
<p [appHighlight]="color" defaultColor="violet">Highlight me too!</p>

@Input() defaultColor: string;

@hostListener('mouseenter') onMouseEnter(){
    this.hightlight(this.lightColor || this.defaultColor || 'red');
}
```

### 结构型指令

- \*ngIf：接收布尔值，让一整块 DOM 树出现或者消失。ngIf 指令并不是使用 CSS 来隐藏元素的，它会把这些元素从 DOM 中物理删除。
- \*ngFor
- ngSwitch(没带\*是一个属性型指令)...\*ngSwitchCase \*ngSwitchDefault

一个宿主元素上应用多个属性型指令，但只能应用一个*结构型*指令。

> 星号（\*）前缀

星号是一个用来简化更复杂语法的“语法糖”，从内部实现来说，Angular 把\*ngIf 属性翻译成一个`<ng-template>`元素并用来包裹宿主元素。

```
<div *ngIf="hero" class="name">{{hero.name}}</div>
==>
<ng-template [ngIf]="hero">
  <div class="name">{{hero.name}}</div>
</ng-template>
```

- \*ngIf 指令被移动到了`<ng-template>`元素上，在那里变成一个属性绑定`[ngIf]`
- `<div>`上的其余部分，包括他的 class 属性在内，移动到了内部的`<ng-template>`元素上

> \*ngFor 内幕

```
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```

> 模板输入变量

模板输入变量和模板引用变量是不同的，无论是在语义上还是语法上。
使用 let 关键字(如 let hero)在模板中声明一个模板输入变量，
这个变量的范围被限制在所重复模板的单一实例上，
事实上，也可以在其它结构型指令中使用同样的变量名。
而声明模板引用变量使用的是给变量名加#前缀的方式(#var)。
一个引用变量引用的是它所附着到的元素、组件或指令。它可以在整个模板的任意位置访问。

> NgSwitch 内幕

```
<div [ngSwitch]="hero?.emotion">
  <app-happy-hero    *ngSwitchCase="'happy'"    [hero]="hero"></app-happy-hero>
  <app-sad-hero      *ngSwitchCase="'sad'"      [hero]="hero"></app-sad-hero>
  <app-confused-hero *ngSwitchCase="'confused'" [hero]="hero"></app-confused-hero>
  <app-unknown-hero  *ngSwitchDefault           [hero]="hero"></app-unknown-hero>
</div>
===>
<div [ngSwitch]="hero?.emotion">
  <ng-template [ngSwitchCase]="'happy'">
    <app-happy-hero [hero]="hero"></app-happy-hero>
  </ng-template>
  <ng-template [ngSwitchCase]="'sad'">
    <app-sad-hero [hero]="hero"></app-sad-hero>
  </ng-template>
  <ng-template [ngSwitchCase]="'confused'">
    <app-confused-hero [hero]="hero"></app-confused-hero>
  </ng-template >
  <ng-template ngSwitchDefault>
    <app-unknown-hero [hero]="hero"></app-unknown-hero>
  </ng-template>
</div>
```

