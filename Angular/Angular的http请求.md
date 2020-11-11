## GET
> 设置查询参数

```
https://www.juphy.cn/todos?_page=1&_limit=10
```


> 创建HttpParams对象

1.
```
import { HttpClient, HttpParams } from '@angular/common/http';

const params = new HttpParams().set('_page', 1).set('_limit', 10);

this.http.get('https://www.juphy.cn/todos', {params});
```
通过链式语法调用 set() 方法，构建 HttpParams 对象。这是因为HttpParams对象是不可变的，通过set() 方法可以防止该对象被修改。每当调用 set() 方法，将会返回包含新值的 HttpParams 对象。

2. 使用formString

```
const params = new HttpParams({formString: '_page=1&_limit=10'});
```

3. 使用formObject

```
const params = new HttpParams({ fromObject: { _page: "1", _limit: "10" } });
```

4. 使用request API

```
this.http.request('GET', 'https://www.juphy.cn/todos', {params});
```

## 获取完整响应
默认情况下，httpClient服务返回的是响应体，如果需要获取响应头的相关信息，可以设置options的对象的observe属性值为response来获取完整的响应对象。
```
this.http.get('https://www.juphy.cn/todos',{
    observe: 'response'
}).subscribe(res => {
    console.dir('Response:'+res.status);
})
```
## 设置响应类型
options设置responseType属性的值，'text','arraybuffer','blob'。

## 设置Http Headers

```
const params = new HttpParams({ fromObject: { _page: "1", _limit: "10" } });
const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=UTF-8');
this.http.get('url', {headers, params});
```
## 多个http请求
### 并行发送
```
const parallel$ = forkJoin(
    this.http.get('url1'),
    this.http.get('url2')
);
parallel$.subscribe(res =>{
    res是一个数组包含多个请求返回的结果。
})
```
### 顺序发送
```
const sequence$ = this.http.get('url1')
    .pipe(
        switchMap(res =>{
            // 此res是url1返回的结果
            return this.http.get('url2');
        })
    );
    sequence$.subscribe(res=>{
        res// 此res是url2返回的结果
    })
```
### 控制返回结果
```
const sequence$ = this.http.get('url1')
    .pipe(
        switchMap(res =>{
            // 此res是url1返回的结果
            return this.http.get('url2');
        }, (res1, res2) => [res1, res2]) // 此处控制返回结果
    );
    sequence$.subscribe(res=>{
        res; // [res1, res2]
    })
```
## 请求异常处理
```
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

this.http.get('url').pipe(
    catchError(error => {
        console.error('Error catched', error);
        return of({description: 'Error Value Emitted'})
    })
).subscribe(res => console.log(res));
```

## Http拦截器
### 定义拦截器
拦截器提供了一种用于拦截、修改请求和响应的机制，类似于express中间件。

```
import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
// 定义一个类并实现HttpInterceptor接口
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector){}

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse
  ): Observable<any>{
    console.log(event);
    switch(event.status){
        case 200:
        break;
        case 401:
        break;
        case 403:
        break;
        case 404:
        break;
        case 500:
        break;
        default:
            if(event instanceof HttpErrorResponse){
                console.warn(
                    '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
                    event
                );
            }
        break;
    }
    return of(event);
  }
  intercept(
    req: HttpRequest<any>, // HttpRequest，即请求对象
    next: HttpHandler // HttpHandler，该对象有一个handle()方法，该方法返回一个Observable对象。
  ): Observable<HttpEvent<any>> {
     let url= req.url; // 设置url形式，统一加上服务端前缀
     const newReq = req.clone(
        url: url,
        headers: req.headers.set("X-CustomAuthHeader", "iloveangular")
     );
     return next.handle(newReq).pipe(
        mergeMap((event: any) => {
            // 允许统一对请求错误进行处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
            if(event instanceof HttpReponse && event.status === 200) return this.handleData(event);
            // 若一切正常，则后续操作
            return of(event);
        }),
        catchError((err: HttpErrorResponse) => this.handleData(err))
        );
    }
}
```

### CachingInterceptor
拦截器实现简单的缓存控制。
```
定义一个Cache接口：
import { HttpRequest, HttpResponse } from '@angular/common/http';

export interface Cache {
  get(req: HttpRequest<any>): HttpResponse<any> | null;
  put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}
```
- get(req: HttpRequest): HttpResponse | null —— 用于获取 req 请求对象对应的响应对象；
- put(req: HttpRequest, res: HttpResponse): void; —— 用于保存 req 对象对应的响应对象。

在实际的场景中，一般会设置一个最大的缓存时间，即缓存的有效期，在有效期内，如果缓存存在，则会直接返回已缓存的响应对象。
```
import { HttpResponse } from "@angular/common/http";

export const MAX_CACHE_AGE = 30000; // 单位为毫秒

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}
```
- url: string —— 被缓存的请求 URL 地址
- response: HttpResponse —— 被缓存的响应对象
- entryTime: number —— 响应对象被缓存的时间，用于判断缓存是否过期

实现CacheService
```
import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Cache } from "./cache";
import { CacheEntry, MAX_CACHE_AGE } from "./cache.entry";

@Injectable({
  providedIn: "root"
})
export class CacheService implements Cache {
  cacheMap = new Map<string, CacheEntry>();

  constructor() {}

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    // 判断当前请求是否已被缓存，若未缓存则返回null
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) return null;
    // 若缓存存在，则判断缓存是否过期，若已过期则返回null。否则返回请求对应的响应对象
    const isExpired = Date.now() - entry.entryTime > MAX_CACHE_AGE;
    console.log(`req.urlWithParams is Expired: ${isExpired} `);
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    // 创建CacheEntry对象
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response: res,
      entryTime: Date.now()
    };
    this.logger.log(`Save entry.url response into cache`);
    // 以请求url作为键，CacheEntry对象为值，保存到cacheMap中。并执行
    // 清理操作，即清理已过期的缓存。
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

  private deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if (Date.now() - entry.entryTime > MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }
}
```
实现CachingInterceptor
```
import { CacheService } from '../cache.service';
const CACHABLE_URL = 'url';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: CacheService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // 判断当前请求是否可缓存
        if (!this.isRequestCachable(req)) {
           return next.handle(req);
        }
        // 获取请求对应的缓存对象，若存在则直接返回该请求对象对应的缓存对象
        const cachedResponse = this.cache.get(req);
        if (cachedResponse !== null) {
           return of(cachedResponse);
        }
        // 发送请求至API站点，请求成功后保存至缓存中
        return next.handle(req).pipe(
           tap(event => {
              if (event instanceof HttpResponse) {
                this.cache.put(req, event);
              }
           })
        );
    }

    // 判断当前请求是否可缓存
    private isRequestCachable(req: HttpRequest<any>) {
        return (req.method === 'GET') && (req.url.indexOf(CACHABLE_URL) > -1);
    }
}
```


### 应用拦截器
app.module.ts
```
import DefaultInterceptor
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Http进度事件
```
this.http.get('url', {
    observe: 'events',
    reportProgress: true
}).subscribe((event: HttpEvent<any>) => {
    switch(event.type){
          case HttpEventType.Sent:
            console.log("Request sent!");
            break;
          case HttpEventType.ResponseHeader:
            console.log("Response header received!");
            break;
          case HttpEventType.DownloadProgress:
            const kbLoaded = Math.round(event.loaded / 1024);
            console.log(`Download in progress! ${kbLoaded}Kb loaded`);
            break;
          case HttpEventType.Response:
            console.log("Done!", event.body);
    }
})
```
控制台输出：
```
Request sent!
Response header received!
Download in progress! 6Kb loaded
Download in progress! 24Kb loaded
Done!
```

## Angular JSONP
若要使用JSONP实现跨域资源，需要引入HttpClientModule和HttpClientJsonpModule
```
//  app.module.ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, HttpClientJsonpModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
在导入HttpClientModule和HttpClientJsonpModule模块之后就可以使用jsonp
```
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
。。。
  constructor(public http: HttpClient) {}

  search(term: string) {
    let searchUrl = `${
      this.baseUrl
    }?term=${term}&media=music&limit=20`;
    return this.http.jsonp<any>(searchUrl, "callback").subscribe(console.dir);
  }
}
```
调用this.http.jsonp之后，Angular会自动在请求的URL地址后面添加`callback=ng_jsonp_callback_0`的查询参数。

- this.http.jsonp(url, 'callback')
```
jsonp<T>(url: string, callbackParam: string): Observable<T> {
    return this.request<any>('JSONP', url, {
      params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
      observe: 'body',
      responseType: 'json',
    });
}
```
- this.request("JSONP", url, {...})
```
request(first: string|HttpRequest<any>, url?: string, options: {
    body?: any,
    headers?: HttpHeaders|{[header: string]: string | string[]},
    observe?: HttpObserve,
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  } = {}): Observable<any> {
      ....
}
```
- HttpClientJsonpModule，该模块只声明了3个providers：
    ```
    @NgModule({
    providers: [
        JsonpClientBackend,
        {provide: JsonpCallbackContext, useFactory: jsonpCallbackContext},
        {provide: HTTP_INTERCEPTORS, useClass: JsonpInterceptor, multi: true},
        ],
    })
    export class HttpClientJsonpModule {}
    ```
    - JsonpClientBackend：JSONP 服务内部实现；
    - JsonpCallbackContext：回调上下文对象；
        ```
        export function jsonpCallbackContext(): Object {
           if (typeof window === 'object') {
                return window;
            }
            return {};
        }
        ```
    - JsonpInterceptor：JSONP 拦截器。
        ```
        @Injectable()
        export class JsonpInterceptor {
        constructor(private jsonp: JsonpClientBackend) {}

        intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            if (req.method === 'JSONP') {
            return this.jsonp.handle(req as HttpRequest<never>);
            }
            // Fall through for normal HTTP requests.
            return next.handle(req);
        }
        }
        ```
### JSONP实现的具体流程
- 生成唯一的callback名称，构造请求的URL地址，比如`https://itunes.apple.com/search?term=Photo&media=music&limit=20&callback=ng_jsonp_callback_0`
- 动态创建script标签并为该元素绑定load和error
- 把新建的script标签添加到页面上

```
handle(req: HttpRequest<never>): Observable<HttpEvent<any>> {
    // 确保请求方法是'JSONP'和期望的响应类型是JSON
    if (req.method !== 'JSONP') {
      throw new Error(JSONP_ERR_WRONG_METHOD);
    } else if (req.responseType !== 'json') {
      throw new Error(JSONP_ERR_WRONG_RESPONSE_TYPE);
    }
	return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {...}
}
```

创建script并设置回调函数
```
return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
     // let nextRequestId: number = 0;
     // private nextCallback(): string { return `ng_jsonp_callback_${nextRequestId++}`; }
      const callback = this.nextCallback();	// 生成唯一的callback名称
     // callback=JSONP_CALLBACK 转换为 callback=ng_jsonp_callback_0
      const url = req.urlWithParams.replace(/=JSONP_CALLBACK(&|$)/, `=${callback}$1`);

      // 创建script元素并设定请求的URL地址
      const node = this.document.createElement('script');
      node.src = url;

      // The response object, if one has been received, or null otherwise.
      let body: any|null = null;

      // Whether the response callback has been called.
      let finished: boolean = false;

      // Whether the request has been cancelled (and thus any other callbacks)
      // should be ignored.
      let cancelled: boolean = false;

      // 设置响应的回调函数，浏览器环境则是window对象
      this.callbackMap[callback] = (data?: any) => {
        // Data has been received from the JSONP script. Firstly, delete this callback.
        delete this.callbackMap[callback];

        // Next, make sure the request wasn't cancelled in the meantime.
        if (cancelled) {
          return;
        }

        // Set state to indicate data was received.
        body = data;
        finished = true;
      };
}
```
onLoad回调函数（处理load和error回调函数）
```
const onLoad = (event: Event) => {
        // Do nothing if the request has been cancelled.
        if (cancelled) {
          return;
        }

        // Cleanup the page.
        cleanup();

        // 请求失败构造响应对象
        if (!finished) {
          // It hasn't, something went wrong with the request. Return an error via
          // the Observable error path. All JSONP errors have status 0.
          observer.error(new HttpErrorResponse({
            url,
            status: 0,
            statusText: 'JSONP Error',
            error: new Error(JSONP_ERR_NO_CALLBACK),
          }));
          return;
        }

        // 请求成功构造响应对象
        observer.next(new HttpResponse({
          body,
          status: 200,
          statusText: 'OK', 
          url,
        }));

        // Complete the stream, the response is over.
        observer.complete();
};
```

onError回调函数
```
const onError: any = (error: Error) => {
        // If the request was already cancelled, no need to emit anything.
        if (cancelled) {
          return;
        }
        cleanup();

        // Wrap the error in a HttpErrorResponse.
        observer.error(new HttpErrorResponse({
          error,
          status: 0,
          statusText: 'JSONP Error', url,
        }));
};
```
在onLoad和onError回调函数中，都调用cleanup()函数执行清理操作，
```
const cleanup = () => {
   // Remove the <script> tag if it's still on the page.
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }

      delete this.callbackMap[callback];
};
```
定义完成功与异常处理函数，然后就是为新建的script元素绑定对应的事件，然后动态的添加script元素
```
node.addEventListener('load', onLoad);
node.addEventListener('error', onError);
this.document.body.appendChild(node);

// The request has now been successfully sent.
observer.next({type: HttpEventType.Sent});
```
取消订阅
```
return () => {
  cancelled = true;
  // Remove the event listeners so they won't run if the events later fire.
  node.removeEventListener('load', onLoad);
  node.removeEventListener('error', onError);
  // And finally, clean up the page.
  cleanup();
};
```

**只能在app.module.ts中引入HttpClientModule，不能再其他模块引入，否则，http请求的拦截器将失效。**