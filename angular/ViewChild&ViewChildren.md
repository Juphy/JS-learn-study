## ViewChild
ViewChild是属性装饰器，用来从模板视图中获取匹配的元素，视图查询在ngAfterViewInit钩子函数调用前完成，因此在ngAfterViewInit钩子函数中，就能正确获取查询的元素。
ViewChild需要一个参数来选择元素，参数可以是一个类型，一个指令或一个类型的组件，也可以是一个字符串。

childComponent
```
import {Component} from '@angular/core';
@Component({
    selector: 'app-child',
    template:``
})

export class ChildComponent{
    constructor(){

    }
    fn(){
        console.log('fn方法');
    }
}
```

parentComponent
```
import {Component} from '@angular/core';
@Component({
    selector: 'app-parent',
    template: `
        <div>
            父组件
            <button (click)="onClick()"><button>
        </div>
        <app-child #myChild></app-child>
    `
})

export class ParentComponent{
    @ViewChild(ChildComponent) child: ChildComponent;
    @ViewChild('myChild') _child;
    // child和_child是一样的
    constructor(){}
}
```

