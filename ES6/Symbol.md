### 概述
为对象添加新的方法或者属性（mixin模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。

Symbol，新的原始数据类型，JavaScript语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

Symbol值是通过Symbol函数生成。对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

Symbol函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

- Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，比较容易区分。
- 如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
- `注意`：
    - Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。
    ```
    // 没有参数的情况
    let s1 = Symbol();
    let s2 = Symbol();
    s1 === s2 // false

    // 有参数的情况
    let s1 = Symbol('foo');
    let s2 = Symbol('foo');
    s1 === s2 // false
    s1和s2都是Symbol函数的返回值，而且参数相同，但是他们是不相同。
    ```
    - Symbol值不能与其他类型的值进行运算，会报错。
    ```
    let sym = Symbol('My symbol');
    'your symbol is' + sym
    `your symbol is ${sym}`
    ```
    - Symbol值可以显示转换成字符串。String(symbol)  symbol.toString()
    - Symbol值可以转为布尔值，但是不能转为数值。布尔值皆为true。
### Symbol作为属性名
```
let sym = Symbol();
//
let a = {};
a[sym] = 'hello';
//
let a={
    [sym]: 'hello'
}
//
let a = {};
Object.defineProperty(a, sym, { value: 'hello!' });

a[sym] // 'hello'
```
- Symbol值作为属性名时，不能用点运算。
```
const sym = Symbol()
const a={};
a.sym = 'hello'
a[sym]  // undefined
a['sym']  // 'hello'
```
- 在对象内部，使用Symbol值定义属性时，Symbol值必须放在方括号中。如果不放在方括号中，该属性的键名就是字符串
```
let s = Symbol();
let obj = {
    [s]: function(arg){...}
}
obj[s](123);

// 采用增强的对象写法
let obj = {
    [s](arg){ ... }
}
```
`常量使用Symbol值最大的好处，就是其他任何值都不可能有相同的值。`
 ### 消除魔术字符串
 使用swicth，case时有时case后面的值并没有特殊的含义，这时就可以使用一个变量对象中属性来代替相应的值，如果对应的值并不重要，只要确保不会更其他属性的值产生冲突即可，这时候就很适合改用Symbol值。

 ### 属性名的遍历
Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。

Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```
const obj={};
let a = Symbol('a');
let b = Symbol('b');
obj[a]='hello';
obj[b]='world';
const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols // [Symbol(a), Symbol(b)]
```
### Symbol相关api
#### Reflect.ownKeys
可以返回所有类型的键名，包括常规键名和 Symbol 键名。
```
let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
};

Reflect.ownKeys(obj) //  ["enum", "nonEnum", Symbol(my_key)]
```
#### Symbol.for()
它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2;
```
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。

Symbol()写法没有登记机制，所以每次调用都会返回一个不同的值。
`
Symbol.for为Symbol值登记的名字，是全局环境的，可以在不同的iframe或service worker中取到同一个值。
`
```
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
```
#### Symbol.keyFor()
Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
```
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

### Singleton模式
Singleton 模式指的是调用一个类，任何时候返回的都是同一个实例。
```
// mod.js
const FOO_KEY = Symbol.for('foo');

function A() {
  this.foo = 'hello';
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];
// global[FOO_KEY]不会被无意间覆盖，但还是可以被改写
global[Symbol.for('foo')] = { foo: 'world' };
const a = require('./mod.js');

`如果键名使用Symbol方法生成，那么外部将无法引用这个值，当然也就无法改写。`如果多次执行这个脚本，每次得到的FOO_KEY都是不一样的。虽然 Node 会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是绝对可靠。
```
### 内置的Symbol值
- Symbol.hasInstance
对象的Symbol.hasInstance属性，指向一个内部的方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。

- Symbol.isConcatSpreadable
对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
```
let arr = ['c', 'd'];
['a', 'b'].concat(arr, 'e') // ['a', 'b', 'c', 'd', 'e']
arr[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false; // 将该值设置为false，就不能展开。
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```
数组的默认行为是可以展开，Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果。

类数组对象默认行为是不能展开的，它的Symbol.isConcatSpreadable属性可以设为设为true，才可以展开。
```
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```
- Symbol.species
对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
```
class MyArray extends Array {
}

const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);

b instanceof MyArray // true
c instanceof MyArray // true
```
子类MyArray继承了父类Array，a是MyArray的实例，b和c是a的衍生对象。

Symbol.species属性就是为了解决这个问题而提供的。现在，我们可以为MyArray设置Symbol.species属性。
```
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
```
由于定义了Symbol.species属性，创建衍生对象时就会使用这个属性返回的函数，作为构造函数。这个例子也说明，定义Symbol.species属性要采用get取值器。默认的Symbol.species属性等同于下面的写法。
```
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}

const a = new MyArray();
const b = a.map(x => x);

b instanceof MyArray // false
b instanceof Array // true
```
- Symbol.match
对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
```
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](this)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

'e'.match(new MyMatcher()) // 1
```
- Symbol.replace
对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。
```
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)

const x = {};
x[Symbol.replace] = (...s) => console.log(s);

'Hello'.replace(x, 'World') // ["Hello", "World"]
```
Symbol.replace方法会收到两个参数，第一个参数是replace方法正在作用的对象，上面例子是Hello，第二个参数是替换后的值，上面例子是World。

- Symbol.search



