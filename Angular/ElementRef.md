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
