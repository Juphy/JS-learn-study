```
var parent = Object.create(Object.prototype, {
    a: {
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true            
    }
});

var child = Object.create(parent, {
    b: {
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true
    },
    c: {
        value: 3,
        writable: true,
        enumerable: false,
        configurable: true
    }
});
```
### for in

for in 是 es3 中就存在，最早用来遍历对象方法。

```
for(let key in child){
  console.log(key);
}
// b
// c
```
`for in`会输出自身以及原型链上可枚举的属性。
如果仅想输出自身的属性可以借助hasOwnProperty，可以过滤掉原型链上的属性。
```
for(let key in child){
  if(child.hasOwnProperty(key)){
    console.log(key);
  }
}
// b
```

### Object.keys
`Object.keys`是es5中新增的方法，用来获取对象自身可枚举的属性键
```
console.log(Object.keys(child));
// ['b']
```

> `Object.keys`的效果和`for in+hasOwnProperty`的效果是一样的

### Object.getOwnPropertyName
`Object.getOwnPropertyNames`也是es5中新增的方法，用来获取对象自身的全部属性名。
```
console.log(Object.getOwnPropertyNames(child));
// > ["b", "c"]
```

> 在es3中，我们不能定义属性的枚举性，所以也不需要那么多方法，有了keys和getOwnPropertyNames后基本就用不到for in了。