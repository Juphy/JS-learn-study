### JavaScript 数据类型

- 栈：基本数据类型（null，undefined，boolean，Number，String）
- 堆：引用数据类型

STACK：存储简单数据，占据空间小、大小固定，属于频繁使用数据，所以放入栈中存储
HEAP：占据空间大，大小不固定。如果存储在栈中，将会影响运行的性能，引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

栈：先进后出，由编译器自动分配释放，存放函数的参数值，局部变量的值等
堆：先进先出，一般由程序员分配释放，如果程序员不释放，程序结束时可能由垃圾回收机制回收

### 原型

在 js 中我们是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性值，
这个属性值是一个对象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当我们使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说我们是不应该能够获取到这个值的，但是现在浏览器中都实现了`__proto__`属性来让我们访问这个属性，但是我们最好不要使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，我们可以通过这个方法来获取对象的原型。

- `p.__proto__`
- p.constructor.prototype
- Object.getPrototypeOf(p)

### NaN

typeOf NaN === 'number', 它和自身不相等，是唯一一个非自反的值。
`isNaN`会进行`Number`转化，任何不能被转换为数值的值都会返回 True，因此非数字值传入也会返回 True。
`Number.isNaN`会首先判断传入参数是否为数字，如果是数字在继续判断是否为`NaN`.

### 其它值转为字符串

- null, undefined, true, false => 'null', 'undefined', 'true', 'false'
- Number 直接转换，不过在极大或者极小的数字会使用指数形式
- Symbol 直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产生错误
- 普通对象，除非自定义`toString()`，否则会调用`Object.prototype.toString()`

### 其它值转为数字

- undefined -> NaN
- null -> 0
- booleann: true => 1 false => 0
- string: Number()转换，包含非数字值则转换为 NaN，空字符串为 0
- Symbol 不能转换为数字，会报错
- 对象，先转换为相应的基本类型值，如果返回的是非数字的基本类型值，在遵循以上规则强制转换为数字。为了将值转换为相应的基本类型值，抽象操作 ToPrimitive 会首先（通过内部操作 DefaultValue）检查该值是否有 valueOf() 方法。如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString() 的返回值（如果存在）来进行强制类型转换。
  如果 valueOf() 和 toString() 均不返回基本类型值，会产生 TypeError 错误。

### 如何将字符串转为数字

Number，parseInt，parseFloat, +

### valueOf toString

`{} 的 valueOf 结果为 {} ，toString 的结果为 "[object Object]"`
`[] 的 valueOf 结果为 [] ，toString 的结果为 ""`

### 设计模式

### 继承

- 原型链，缺点是在包含有引用数据类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱，创建子类型的时候不能向超类型传递参数。
- 借用构造函数的方式：通过在子类型的函数中调用超类型的构造函数来实现的。解决了不能向超类型传递参数的缺点，但是无法实现函数方法的复用，并且超类型原型定义的方法子类型也没有办法访问到
- 组合继承：将原型链和借用构造函数组合起来使用的一种方式。以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成了子类型的原型中多了很多不必要的属性。

```JS
function SuperType(name){
    this.name = name
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age){

    //继承属性
    SuperType.call(this,name);

    this.age = age;
}

//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log(this.age);
}

var instance1 = new SubType("james",9);
instance1.colors.push("black");
console.log(instance1.colors);  //"red,blue,green,black"
instance1.sayName(); // "james"
instance1.sayAge(); // 9

var instance2 = new SubType("kobe",10);
console.log(instance2.colors);  //"red,blue,green"
instance2.sayName(); // "kobe"
instance2.sayAge(); // 10
```

- 原型式继承：基于已有的对象来创建新的对象，实现的原理是，向函数中传入一个对象，然后返回一个以这个对象为原型的对象。缺点与原型链方式相同

```
function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}
```

- 寄生组合模式: 当需要让多个构造函数公用一个原型时，需要在某个构造函数中增加一个私有属性时

```JS
let inherit = (function(){
  let F = function(){};
  return function(origin, target){
    F.prototype = origin.prototype;
    target.prototype = new F();
    target.prototype.constructor = target;
    target.prototype.uber = origin.prototype;
  }
})()
```

- new

```JS
function createObj(Fn, ...rest){
  let newObj1 = null;
  newObj= Object.create(Fn.prototype);
  let newobj2 = Fn.apply(newObj, rest);
  if(newObj2!==null&&(typeof newObj2==='object' || typeof newObj2==='function')){
    return newObj2;
  }
  return newObj1;
}
```

### hasOwnProperty

用来检测一个对象是否含有特定的自身属性

### AJAX

通过 JavaScript 的异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。

```JS
let getJSON = function(url){
  return new Promise((resolve, reject)=>{
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange= function(){
      if(this.readyState===4){
        if(this.status===200){
          resolve(this.response)
        }else{
          reject(this.statusText);
        }
      }
    }
    xhr.onerror= function(){
      reject(this.statusText);
    }
    xhr.responseType="json"; // 设置
    xhr.send(null)
  })
}

(function(){
  function ajax(options){
    let defaultOptions={
      url: '',
      type: 'GET',
      dataType: JSON,
      async: true,
      success: null,
      error: null,
      data:null
    };
    for(let key in defaultOptions){
      if(options.hasOwnProperty(key)){
        defaultOptions[key] = options[key];
      }
    }
    let xhr = new XMLHttpRequest();
    xhr.open(defaultOptions.type, defaultOptions.url, defaultOptions.async);
    xhr.onreadystatechange = function(){
      if(this.readyState===4){
        if(/^2\d{2}/.test(this.status)){
          defaultOptions.success.call(this, this.response);
        }else{
          defaultOptions.error.call(this, this.statusText)
        }
      }
    }
    xhr.onerror = function(){
      defautOptions.error.call(this, this.statusText)
    }
    xhr.responseType = defaultOptions.dataType;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(defaultOptions.data);
  }
})()
```

### AJAX解决浏览器缓存问题
- xhr.setRequestHeader('If-Modified-Since', '0')
- xhr.setRequestHeader('Cache-Control', 'no-cache')
- URL后面增加随机数
