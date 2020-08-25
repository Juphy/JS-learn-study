## Providers

Providers 是`Nest`的一个基本概念。许多基本的`Nest`类可能被视为 provider—service，repository，factory，helper 等等。它们都可以通过`constructor`注入依赖系统。这意味着对象可以彼此创建各种`@Injectable()`装饰器注释的类。
![控制器-providers](assets/images/providers1.png)
控制器应处理`HTTP`请求并将更复杂的任务委托给`providers`。`Providers`是纯粹的`JavaScript`类，在其声明之前带有`@Injectable()`装饰器。

#### 服务
```
nest g service cats
```
`CatsService`,负责数据存储和检索。唯一的新特点就是使用`@Injectable()`装饰器，该`@Injectable()`附加有元数据，因此`Nest`知道这个类是一个`Nest` provider。