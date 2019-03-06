## Angular路由缓存

路由缓存，input输入状态， 下拉框选中状态

```
import {RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  public handlers: { [key: string]: DetachedRouteHandle } = {};

  // 表示对路由允许复用,，控制路由的复用
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    默认对所有路由复用 可通过给路由配置项增加data: { keep: true }来进行选择性使用，代码如下
    如果是懒加载路由需要在生命组件的位置进行配置
    if (!route.data.keep) {
      return false;
    }
    return true;
  }

  // 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象， path等同RouterModule.forRoot
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers[route.routeConfig.path] = {
      snapshot: route,
      handle: handle
    };
  }

  // 若path在缓存中有的都认为允许还原路由
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
  }

  // 从缓存中获取快照，若无则返回null
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig) return null;
    if (route.routeConfig.loadChildren) return null; 在loadChildren路径上通过修改自定义RouteReuseStrategy中的检索函数时从不检索分离的路由。
    return this.handlers[route.routeConfig.path].handle;
  }

  进入路由触发，判断是否同一路由
  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === current.routeConfig;
  }
}

```
将以上代码引入到app.module.ts文件的providers: [{ provide: RouteReuseStrategy, useClass: AppRoutingCache }];

### RouteReuseStrategy
路由复用策略，提供的方法：
- shouldDetach 是否允许复用路由
- store 当路由离开时会触发，存储路由
- shouldAttach  是否允许还原路由
- retireve 获取存储路由
- shouldReuseRoute 进入路由触发，是否同一路由时复用路由

把路由设置为允许复用（shouldDetach），然后将路由快照存在store当中，当shouldReuseRoute成立时即触发，再次遇到该路由后表示需要复用路由，先判断shouldAttach是否允许还原，最后从retrieve拿到路由快照并构建组件。