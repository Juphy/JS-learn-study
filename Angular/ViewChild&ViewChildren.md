## ViewChild
属性装饰器，用于配置一个视图查询。变更检测器会在视图的DOM中查找能匹配上该选择器的第一个元素或指令，如果视图的DOM发生了变化，出现了匹配该选择器的新的子节点，该属性就会被更新。

> 在调用NgAfterViewInit回调函数之前

参数：
- selector：用于查询的指令类型或名字
- read：从查询到的元素中读取另一个令牌
- static：是否在运行更改检测之前解析查询结果（例如：仅返回静态结果）。如果不提供此选项，编译器将返回其默认行为，即使用查询结果来确定查询解析的时间。如果任何查询结果位于嵌套视图（例如*ngIf）,则将在运行更改检测之后解析该查询。否则，将在运行更改检测之前解决此问题。

所支持的选择器包括：
- 任何带有@Component 或 @Directive装饰器的类
- 字符串形式的模板引用变量（比如可以使用@('tmp')来查询`<`my-component` #tmp`>``</`my-component`>`）
- 组件树中任何当前组件的子组件所定义的提供商（比如@ViewChild(SomeService) someService: SomeService）
- 任何通过字符串令牌定义的提供商（比如@ViewChild('someToken') someTokenVal: any）
- TemplateRef(比如可以用@ViewChild(templateRef) template; 来查询`<`ng-template`></`ng-template`>`)

```
import { Component, Directive, Input, ViewChild } from "@angular/core";

@Directive({ selector: 'pane' })
export class Pane {
    
}
```