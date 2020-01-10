Angular 应用是模块化的，它拥有自己的米快系统，称作 NgModule。

一个 NgModule 就是一个容器，用于存放一些内聚的代码块，这些代码块专注于某个应用领域、某个工作流或一组紧密相关的功能。

它可以包含一些组件、服务提供商或其它代码文件，其作用域由包含它们的 NgModule 定义。它还可以导入一些由其它模块中导出的功能，并导出一些指定的功能供其它 NgModule 使用。

每个 Angular 应用都至少有一个 NgModule 类，也就是根模块，它习惯上命名为 AppModule，并位于一个名叫 app.module.ts 的文件中。

引导这个根模块就可以启动你的应用。

当 bootstrap(引导)根模块之后，NgModule 会继续实例化元数据中的 bootstrap。

boostrap 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有根模块才应该设置这个 boostrap 属性。

### bootstrapModule

bootstrapModule 是在上一节 platformBrowserDynamic()返回的平台实例 PlatformRef 中的一个方法，用于引

```JavaScript
angular/packages/core/src/application_ref.ts

@Injectable()
export class PlatformRef{
    
}
```
