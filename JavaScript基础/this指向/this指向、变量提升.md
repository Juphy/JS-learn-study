# 在浏览器中，this永远指向谁调用的。
最简单的函数，不属于任何一个对象，就是一个函数，这种情况下，在JavaScript的非严格模式下默认属于全局对象window，而严格模式，就是undefined。

## 使用构造函数调用函数
如果函数调用前使用new关键字，则是调用了构造函数。实际上，JavaScript函数是重新创建的对象。
```
// 构造函数
function myFunction(arg1, arg2){
    this.firstName = arg1;
    this.lastName = arg2;
}

var a = new myFunction('Li', 'Cherry');
a.lastName; // Cherry
```

new的过程：
```
var a = new myFunction("Li", "Cherry");
new myFunction{
    var obj = {};
    obj.__proto__ = myFunction.prototype;
    var result = myFunction.call(obj, 'Li', 'Cherry');
    return typeof result === "obj"?result: obj;
}
```
1.创建一个空对象
2.将新创建的空对象的隐式原型指向其构造函数的显示原型
3.使用call改变this的指向
4.如果无返回值或者返回一个非对象值，则将obj返回作为新对象；如果返回值是一个新对象的话那么直接返回该对象。

### 在nodejs中与浏览器中的js指向不一致。
全局的this是一个空对象{}，并且全局的this与global对象没有任何关系。在函数中的this指向的是global，和全局中的this不是同一个对象。构造函数中的this指向的是它的实例，而不是global。

全局中的this指向的是module.exports。
```
console.log(this); // {}

this.num = 10;
console.log(module.exports); {num:10}
console.log(module.exports.num);
```