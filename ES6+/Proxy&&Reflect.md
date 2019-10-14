## Proxy
Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种'元编程'，即对编程语言进行编程。Proxy可以理解成在目标对象之前架设一层拦截，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和修改。
```
var obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
})
```
对空对象架设一层拦截，重定义属性的读取和设置行为，Proxy实际上重载了点运算符，即用自己的定义覆盖了语言的原始定义。

ES6原生提供Proxy构造函数，用来生成Proxy的实例。
> var proxy = new Proxy(target, handler);

Proxy对象的所有用法，都是上面这种形式，不同的只是handler参数的写法，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，即如果没有Proxy的介入，操作原来要访问的就是这个对象；handler参数也是一个对象，用来定制拦截行为。注意，要使得proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。

如果handler没有设置任何拦截，那就等同于直接通向原对象。
```
var target = { };
var handler = { };
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // 'b'
handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target。
```

Proxy实例也可以是其他对象的原型对象。
```
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
})

let obj = Object.create(proxy);
obj.time // 35

proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。
```

同一个拦截器函数，可以设置拦截多个操作。
```
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);
                     

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

### 静态方法
- get(target, proKey, receiver): 拦截对象属性的读取，比如proxy.foo和proxy`['foo']`：用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名、proxy实例本身（严格来说，是操作行为所针对的对象），最后一个参数可选。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy`['foo']` = v，返回一个布尔值：用于拦截某个属性的复制操作，可以接受四个参数，依次为目标对象、属性名、属性值和proxy实例本身，其中最后一个参数可选。
- has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值：用来拦截HasProperty操作，即判断对象是否具有某个属性时。接受两个参数，分别是目标对象、需查询的属性名。
  - 如果原对象的属性名的第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。
  - 如果原对象不可配置或者禁止扩展，这时has拦截会报错。
  - has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。
  - has拦截对for...in循环不生效。
- deleteProperty(target, propKey)：拦截delete proxy`[propKey]`的操作，返回一个布尔值：用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
  - 目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组，该数组成员只能是字符串或Symbol值，如果有其它类型的值，或者返回的根本不是数组，就会报错。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回。
  - 目标对象不存在的属性
  - 属性名为Symbol值
  - 不可遍历（enumerable）的属性 
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象或者undefined。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
  - 如果defineProperty方法返回false，添加新属性总是无效。
  - 如果目标对象不可拓展（non-extensible），则defineProperty不能增加目标对象不存在的属性，否则会报错。
  - 如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象或者null，否则报错：用来拦截获取对象原型：
  - `Object.prototype.__proto__`
  - Object.prototype.isPrototypeOf()
  - Object.getPrototypeOf()
  - Reflect.getPrototypeOf()
  - instanceof
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值，如果返回其它值会被自动转化为布尔值：返回值必须与目标对象的isExtensible属性保持一致。否则会抛出错误。
  - Object.isExtensible(proxy) === Object.isExtensible(target)
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)：拦截函数的调用、call和apply操作，可以接收三个参数，分别是目标对象、目标对象的上下文（this）和目标对象的参数数组。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)：用于拦截new命令，可以接收两个参数，目标对象，构造函数的参数对象，创建实例对象时，new命令作用的构造函数。
  - construct方法返回的必须是一个对象，否则会报错




## Reflect
Reflect对象与proxy对象一样，也是ES6为了操作对象而提供的新API，Reflect对象设计的目的：
- 将object对象的一些明显属于语言内部的方法（比如 Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在object和Reflect对象上部署，未来新的方法在部署在Reflect对象上。也就是说从Reflect对象上可以拿到语言内部的方法。
- 修改某些object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一些错误，而Reflect.defineProperty(obj, name, desc)则会返回false.
```
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```
- 让Object操作都变成函数行为。某些object操作是命令式，比如name in obj和delete obj.name，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成函数行为。
```
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```
- Reflect对象的方法与proxy对象的方法一一对应，只要是proxy对象的方法，就能在Reflect对象上找到对应的方法，这就让proxy对象可以方便调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
```
Proxy(target, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
});
上面的代码中，proxy方法拦截target对象的属性赋值行为，它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
上面代码中，每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。
```
```
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```

### 静态方法
- Reflect.apply(target, thisArg, args)：apply方法可以接受三个参数，分别是目标对象，目标对象的上下文对象（this）和目标对象的参数数组。
```

```
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
Reflect.has(target, name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
