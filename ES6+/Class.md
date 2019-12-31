## Class

ES6 的 class 可以看作是一个语法糖，它的绝大部分功能，ES5 都可以做到的，新的 Class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法。

```
class Point{
    // this代表的就是实例对象
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    toString(){
        return '(' + this.x + '，' + this.y + ')';
    }
}
==> 构造函数的prototype属性，在ES6的类上面继续存在，所有类的方法都定义在类的prototype属性上面
Point.prototype = {
    constructor() {}
    toString() {}
    toValue() {}
}

// 类的数据类型就是函数，类本身就是指向构造函数
typeof Point // 'function'
Point === Point.prototype.constructor // true
let point = new Point();
point.constructor === Point.prototype.constructor // true

Object.assign(Point.prototype, {
    toString(){},
    toValue(){}
})

// 类的内部所有定义的方法，都是不可枚举的，这一点与ES5的行为不一致
Object.keys(Point.prototype) // []
Object.getOwnPropertyNames(Point.prototype) // ['constructor', 'toString']

var Point = function(x, y){
    ...
}
Point.prototype.toString = function(){
    ...
}
Object.keys(Point.prototype)  // ['toString']   toString方法是可枚举的
Object.getOwnPropertyName(Point.prototype) // ['constructor', 'toString']
```

### constructor 方法

- constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。
- 默认返回实例对象（即 this），完全可以指定返回另外一个对象。
- 类必须使用 new 调用，否则会报错。这是它跟普通函数的一个主要区别，后者不用 new 也可以执行。

### 类的实例

```
class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    toString(){
        return '('+this.x+'，'+this.y+')'
    }
}
var point =  new Point(2,3);
point.toString() // (2,3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // false

var p1 = new Point(2,3);
var p2 = new Point(2,3);
p1.__proto__ === p2.__proto__; // true
```

x, y 都是实例对象 point 自身的属性，而 toString 是原型对象的属性，这些都与 ES5 的行为一致。
p1 和 p2 都是 Point 的实例，它们的原型都是 Point.prototype 所以**proto**属性是相等的。

```
 var p1 = new Point(2,3);
 var p2 = new Point(2,3);

 p1.__proto__.printName = function(){ return 'Oops'};
 p1.printName() // 'Oops'
 p2.printName() // 'Oops'
 var p3 = new Point(4, 2);
 p3.printName() // 'Oops'
 在p1的原型上添加printName方法，由于p1的原型就是p2的原型，因此p2也可以调用这个方法，此后新建的p3也可以调用这个方法，这意味着使用实例__proto__属性改写原型，必须相当谨慎，因为这会改变“类”的原始定义，影响到所有实例。
```

### getter setter

```
class MyClass {
    constructor(){
        // ...
    }
    get prop(){
        return 'getter';
    }
    set prop(value){
        console.log('setter: '+value);
    }
}
```

存值函数和取值函数是设置在属性的 Descriptor 对象上的。

```
class CustomHTMLElement {
    constructor(element){
        this.element = element;
    }

    get html(){
        return this.element.innerHtml;
    }

    set html(){
        this.element.innerHtml = value;
    }
}
var descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype, 'html'
)
'get' in descriptor // true
'set' in descriptor // true
```

### 属性表达式

类的属性名可以采用表达式变量名。

```
let methodname = 'getArea';
class Square {
    constructor(length){
        // ...
    }

    [methodname](){
        // ...
    }
}
```

### class 表达式

类也可以使用表达式的形式定义。

```
const MyClass = class Me {
    getClassName(){
        return Me.name
    }
}
let inst = new MyClass();
inst.getClassName() // Me
Me.name  // ReferenceError: Me is not defined

const MyClass = class { ... }

// 立即执行的Class
let person = new class {
    constructor(name){
        this.name = name;
    }
    sayName(){
        console.log(this.name)
    }
}('张三')；
person.sayName(); // '张三'
```

### 其它

- 默认严格模式
- 不存在变量提升
- name 属性：ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继承，包括 name 属性。
- Generator：如果某个方法之前加上（\*），就表示该方法是一个 Generator 函数

```
class Foo{
    constructor(...args){
        this.args = args;
    }

    *[Symbol.iterator](){
        for(let arg of this.args){
            yield arg;
        }
    }
}

for(let x of new Foo('hello', 'world')){
    console.log(x);
}
// hello
// world
```

- this 的指向：累的方法内部如果含有 this，它默认指向类的实例。

```
class Logger{
    printName(name = 'there'){
        this.print(`hello ${name}`);
    }
    print(text){
        console.log(text);
    }
}
const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined

// 如果将方法提取出来单独使用，this会指向盖房运行时所在的环境（由于class内部是严格模式，所以this实际指向的是undefined），从而导致找不到print方法而报错。
```

解决办法：1、构造方法中绑定 this；2、使用箭头函数；3、使用 proxy

```
class Logger{
    constructor(){
        this.printName = this.printName.bind(this);
        this._printName = (name="there") => {
            this.print(`hello ${name}`)
        }
    }
    printName(name = 'there'){
        this.print(`hello ${name}`);
    }
    print(text){
        console.log(text);
    }
}
const logger = new Logger();
const { printName, _printName } = logger;
printName();
_printName();
```

```
function selfish(target){
    const cache = new WeakMap();
    const handler = {
        get (target, key){
            const value = Reflect.get(target, key);
            if(typeof value !== 'function'){
                return value;
            }
            if(!cache.has(value)){
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    }
    const proxy = new Proxy(target, handler);
    return proxy;
}

const logger1 = selfish(new Logger());
const { printName1} = logger1;
```

### 静态方法

### super 关键字

既可以当作函数使用，也可以当作对象使用，在两种情况下，用法是完全不同的。

- `super 作为函数调用时，代表父类的构造函数，ES6 要求，子类的构造函数必须执行一次 super 函数。`

```JavaScript
class A {}
class B extends A {
    constructor(){
        super();
    }
}
```

子类 B 的构造函数之中的 super()，代表调用父类的构造函数，这是必须的，否则 JavaScript 引擎会报错。
super 虽然代表了父类的构造函数，但是返回的是子类 B 的实例，即 super 内部的 this 指的是 B 的实例，因此 super()在这里相当于 A.prototype.constructor.call(this)。

```JavaScript
class A {
    constructor(){
        console.log(new.target.name);
    }
}
class B extends A {
    constuctor(){
        super()
    }
}
new A();
new B();
```

new.target 指向当前正在执行的函数，在 super()执行时，它指向的是子类 B 的构造函数，而不是父类 A 的构造函数。也就是说，super()内部的 this 指向的是 B。

作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

- `super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。`

```JavaScript
  class A {
    p(){
        return 2;
    }
  }
  class B extends A {
      constructor(){
          super();
          console.log(super.p()); // 2
      }
  }
  let b = new B();
```

子类 B 当中的 super.p()，就是将 super 当作一个对象使用，这时，super 在普通方法之中，指向 A.prototype，所以 super.p()就相当于 A.prototype.p()。

由于 super 指向父类的原型对象，所以定义在父类实例（this）上的方法或属性，是无法通过 super 调用的。如果属性定义在父类的原型对象上，super 就可以取到。

```
class A{}
A.prototype.x = 2;

class B extends A {
    constructor(){
        super();
        console.log(super.x);
    }
}
let b = new B();
```
