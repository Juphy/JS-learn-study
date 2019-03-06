## 内置管道
### 大小写转换
```
<p>{{'Angular' | uppercase}}</p> // ANGULAR
<p>{{'Angular' | lowercase}}</p> // angular
```
### 数值格式化
```
pi: number = 3.14
e: number = 2.718281828
<p>{{e | number: '3.1-5'}}</p> // 002.71828
<p>{{e | number: '4.5-5'}}</p> // 0,002.71828
<p>{{e | number: '4.0'}}</p> // 0,002.718
<p>{{e | number: '4.'}}</p> // 0,002.718
```
`{minIntegerDigits}.{minFractionDigits}-{maxfractionDigits}`
- minIntegerDigits：整数部分保留最小的位数，默认值为1.
- minFractionDigits：小数部分保留最小的位数，默认值为0.
- maxFractionDigits：小数部分保留最大的位数，默认值为3.
小数点左边的数字表示最少保留的位数，如果原数值整数位不足，则用0补齐；小数点右边表示小数的最小位数和小数的最大位数，如果原值的小数位大于最大位数，要四舍五入保留到最大位数；如果原值的小数位小于最小位数，则要不足小数位补0。
### 日期格式化
|日期|标志符|缩写|全称|单标志符|双标志符|
|:--|:--|:--|:--|:--|:--|
|地区|G|G(AD)|GGGG(Anno Domini)|||
|年|y|||y(2016)|yy(16)|
|月|M|MMM(Jun)|MMMM(June)|M(6)|MM(06)|
|日|d|||d(8)|dd(08)|
|星期|E|E,EE,EEE(Fri)|EEEE(Friday)|||
|时间(AM,PM)|j|||j(8 PM)|jj(08 PM)|
|12小时制|h|||h(8)|hh(08)|
|24小时制|H|||H(20)|HH(20)|
|分|m|||m(5)|mm(05)|
|秒|s|||s(8)|ss(08)|
|时区|Z||Z(china Standard Time)|||
|时区|z|z(GMT-8:00)||||

```
date:Date = new Date('2016-06-08 20:05:08');
<p>{{date | date: "y-MM-dd EEEE"}}</p> //2016-06-08 Wednesday
```
### PercentPipe
```
a = 0.269
<p>{{a | percent}}</p> // 27%
<p>{{a | percent:'4.3-5'}}</p> // 0,026.900%
```
`{{ value_expression | percent [:digitsInfo[:locale]] }}`
如果没有digitsInfo则按照整数取（四舍五入），如果有digitsInfo，则按照规则取。

### CurrencyPipe
`expression | currency[: currencyCode[: display[: digitInfo]]]`
- currency 要显示内容（如'USD'，也可以是自定义的）
- currencyCode
    - 'code' 显示内容（如'USD'）
    - 'symbol'（默认） 显示符号（例如$）
    - 'symbol-narrow'
    - 布尔值 true用于符号 false用于code
- digitInfo 按照数值的规则

### SlicePipe（非纯管道）
```
str = 'abcdefghij';
<p>{{str | slice:0:4}}</p> // 'abcd'
<p>{{str | slice:4:0}}</p> // ''
<p>{{str | slice:-4}}</p> // 'ghij'
```

### JsonPipe（非纯管道）
将数据对象通过JSON.stringify()转换成对象字符串，并不改变原数据。

## 管道分类
### 纯管道
仅当管道输入值变化的时候，才执行转换操作，默认的类型是 pure 类型。（备注：输入值变化是指原始数据类型如：string、number、boolean、Symbol等的数值发生变化或者对对象引用（Date、Array、Function、Object）的更改）。Angular会忽略对象内部的更改，除非是引用地址的变化。

纯管道使用纯函数， 纯函数是指在处理输入并返回结果时，不会产生任何副作用的函数。 给定相同的输入，它们总是返回相同的输出。

### 非纯管道
angular组件在每次变化检测期间都会执行，如鼠标点击或移动都会执行 impure 管道。非纯管道可能会被调用很多次，因此必须小心使用非纯管道。

将管道设置为非纯管道：
```
@Pipe({
    name: 'SexReformPipe',
    pure: false
})
```

## 管道链
将多个管道用`|`连接在一起，组成管道链对数据进行处理。
```
<p>{{'abcdefgh' | slice:0:3 | uppercase}}</p>  // 'ABC'
```

## 自定义管道
- @Pipe装饰器定义Pipe的metadata信息
- 实现PipeTransform接口中定义的transform方法，接受一个输入值和一些可选参数，并返回转换后的值
- 不可以返回html

```
import { Pipe, PipeTransform } form '@angular/core'
@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent: string): number {
    let exp = parseFloat(exponent);
    return Math.pow(value, isNaN(exp) ? 1 : exp);
  }
}

@Pipe({ name: 'sexReform' })
export class SexReformPipe implements PipeTransform {
    transform(value: string):string{
        switch(value){
            case 'male': return '男';
            case 'female': return '女';
            default: return '';
        }
    }
}
```
使用自定义管道
```
<p>Super power boost: {{2 | exponentialStrength: 10}}</p>
<p>{{sexValue | sexReform}}</p>
<p class="{{sexValue | sexReform}}"></p>
```
`定义完管道之后，要手动注册自定义管道，添加到declarations数组中`。

### 非纯AsyncPipe
```
import { Component } from '@angular/core';

import { Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-hero-message',
  template: `
    <h2>Async Hero Message and AsyncPipe</h2>
    <p>Message: {{ message$ | async }}</p>
    <button (click)="resend()">Resend</button>`,
})
export class HeroAsyncMessageComponent {
  message$: Observable<string>;

  private messages = [
    'You are my hero!',
    'You are the best hero!',
    'Will you be my hero?'
  ];

  constructor() { this.resend(); }

  resend() {
    this.message$ = interval(500).pipe(
      map(i => this.messages[i]),
      take(this.messages.length)
    );
  }
}
```
AsyncPipe接受一个Promise或Observable作为输入，并且自动订阅这个输入，最终返回他们给出的值。AsyncPipe 管道是有状态的。 该管道维护着一个所输入的 Observable 的订阅，并且持续从那个 Observable 中发出新到的值。

### 非纯且带缓存的管道
一个向服务器发起http请求的非纯管道。此管道只有在所请求的URL发生变化时才会向服务器发起请求，他会缓存服务器的响应。
```
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient }          from '@angular/common/http';
@Pipe({
  name: 'fetch',
  pure: false
})
export class FetchJsonPipe  implements PipeTransform {
  private cachedData: any = null;
  private cachedUrl = '';

  constructor(private http: HttpClient) { }

  transform(url: string): any {
    if (url !== this.cachedUrl) {
      this.cachedData = null;
      this.cachedUrl = url;
      this.http.get(url).subscribe( result => this.cachedData = result );
    }

    return this.cachedData;
  }
}
```
在一个组件中使用：
```
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-list',
  template: `
    <h2>Heroes from JSON File</h2>

    <div *ngFor="let hero of ('assets/heroes.json' | fetch) ">
      {{hero.name}}
    </div>

    <p>Heroes as JSON:
      {{'assets/heroes.json' | fetch | json}}
    </p>`
})
export class HeroListComponent { }
```
其中`assets/heroes.json`的数据是：
```
[
  {"name": "Windstorm", "canFly": true},
  {"name": "Bombasto",  "canFly": false},
  {"name": "Magneto",   "canFly": false},
  {"name": "Tornado",   "canFly": true}
]
```
最终结果如下：
```
Heros from JSON File

Windstorm
Bombasto
Magneto
Tornado

Heroes as JSON: [ { "name": "Windstorm", "canFly": true }, { "name": "Bombasto", "canFly": false }, { "name": "Magneto", "canFly": false }, { "name": "Tornado", "canFly": true } ]
```

