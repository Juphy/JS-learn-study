### ElementRef

对视图中某个原生元素的包装器。ElementRef 的背后是一个可渲染的具体元素，在浏览器中，它通常是一个 DOM 元素。允许直接访问 DOM 会导致你的应用在 XSS 攻击面前更加脆弱。

```
export class ElementRef {
  public nativeElement: any;
  constructor(nativeElement: any) { this.nativeElement = nativeElement; }
}
```

如果不支持直接访问原生元素，则为 null（在 Web Worker 环境下运行此应用）。`当需要直接访问 DOM 时，请把本 API 作为最后选择。优先使用 Angular 提供的模板和数据绑定机制。或者你还可以看看 Renderer2，它提供了可安全使用的 API —— 即使环境没有提供直接访问原生元素的功能。

如果依赖直接访问 DOM 的方式，就可能在应用和渲染层之间产生紧耦合。这将导致无法分开两者，也就无法将应用发布到 Web Worker 中。`

### ElementRef 的应用

```
import { Component, ElementRef }  from "@angular/core";
@Component({
    selector: 'my-app',
    template: `
        <h1>Welcome to Angular World</h1>
        <div #greet>Hello {{ name }}</div>
    `
})
export class AppComponent{
    name: string = 'name';
    @ViewChild('greet')greetDiv: ElementRef;

    // 在构造函数中this.elementRef = elementRef是可选的，编译时会自动赋值。
    constructor(private elementRef:ElementRef, private renderer: Renderer2){}

    ngAfterViewInit(){
        this.elementRef.nativeElement 指的是<my-app></my-app>
        this.elementRef.nativeElement.querySelector('div') 查询<my-app></my-app>中的元素

        this.greetDiv.nativeElement.style.backgroundColor = "red";

        this.renderer.setStyle(this.greetDiv.nativeElement, 'backgroundColor', 'red');
    }
}
```

### NgTemplateOutLet
该指令用于基于已有的`TemplateRef`对象，插入对应的内嵌视图。在应用NgTemplateOutlet指令时，通过`[ngTemplateOutletContext]`属性来设置`EmbeddedViewRef`的上下文对象。绑定的上下文应该是一个对象，此外可通过`let`语法来声明绑定上下文对象属性名。

*若let语法未绑定任何属性名，则上下文对象中`$implicit`属性，对应的值将作为默认值。*

```
<ng-container *ngTemplateOutlet="templateRefExp;context: contextExp">

@Component({
  selector: 'ng-template-outlet-example',
  template: `
    <ng-container *ngTemplateOutlet="greet"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="eng; context: myContext"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="svk; context: myContext"></ng-container>
    <hr>
    <ng-template #greet><span>Hello</span></ng-template>
    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>
    <ng-template #svk let-person="localSk"><span>Ahoj {{person}}!</span></ng-template>
`
})
class NgTemplateOutletExample {
  myContext = {$implicit: 'World', localSk: 'Svet'};
}
```

```
// NgTemplateOutlet指令定义
@Directive({
   selector: '[ngTemplateOutlet]'
})

// NgTemplateOutlet类私有属性及构造函数
export class NgTemplateOutlet implements OnChanges{
    // 表示创建的内嵌视图
    private _viewRef: EmbeddedViewRef<any>;
    // 注入ViewContainerRef实例
    constructor(private _viewContainerRef: ViewContainerRef){}
}

// NgTemplateOutlet类输入属性
@Input() public NgTemplateOutletContext: Object; // 用于设定EmbeddedViewRef上下文
@Input() public NgTemplateOutlet: TemplateRef<any>; // 用于设定TemplateRef对象
```


### ng-template
`<ng-template>`用于定义模板，使用`*`语法糖的结构指令，最终都会转换为`<ng-template>`模板指令，模板内的内容如果不进行处理，是不会在页面中显示。

在`<ng-template>`上声明变量时，该变量会引用一个TemplateRef实例来表示该模板。
```
<ng-template #ref3></ng-template>
<button (click)="log(ref3)">Log type of #ref</button>
```
#ref3变量在`<ng-template>`上，所以它的值是一个TemplateRef。

### ng-container
`<ng-container>`是一个逻辑容器，可用于对节点进行分组，但不作为DOM树中的节点，它将被渲染为HTML中的`comment`元素，它可用于避免添加额外的元素来使用结构指令。
