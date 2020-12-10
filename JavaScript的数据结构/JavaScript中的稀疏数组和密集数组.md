## JavaScript

原文[JavaScript: spare arrays vs. dense arrays](http://2ality.com/2012/06/dense-arrays.html)

一般来说，JavaScript 中的数组都是稀疏的，也就是说数组之间可以有空隙，因为数组其实就是一个键值的映射。

### 稀疏数组

遍历稀疏数组时，如果没有元素，javascript 会跳过这些缝隙。使用 forEach 循环的时候，不会执行 callback 函数。filter 遍历时也会被忽略。

```
var a=new Array(3) // [empty x 3]  [,,,]
a.length // 3
a[0] // undefined

var arr=[];
arr[0]=0;
arr[100]=100;
arr.forEach((item, index)=>{
    console.log(i+':'+index);
})
// 0 : 0
// 100 : 100
```

### 密集数组

```
var a = Array.apply(null, Array(3));
a   // [undefined, undefined, undefined]
```

密集数组表面上与稀疏数组具体区别，根本原因在于JS中没有真正意义的数组全是对象。
```
var a1 = Array.apply(null, Array(3)),
      a2 = new Array(3);

a1.length // 3
a2.length // 3

a1[0] // undefined
a2[0] // undefined

a1[0] === a2[0] // true      

0 in a1 // true
0 in a2 // false

a1.hasOwnProperty(0) // true
a2.hasOwnProperty(0) // false

Object.keys(a1) // ["0", "1", "2"]
Object.keys(a2) // []

a1.map(n => 1) // [1, 1, 1]
a2.map(n => 1) // [, , ,]
```
> 数组成员可以省略。只要逗号前面没有任何表达式，数组的length属性就会加 1，并且相应增加其后成员的位置索引。被省略的成员不会被定义。如果被省略的成员是数组最后一个成员，则不会导致数组length属性增加

### JavaScript 中的数组

JavaScript 中的 Array 并不是常规意义上的数组，只不过是会自动管理一些“数字”属性和 length 属性的对象而已，JavaScript 数组中的索引是数字，也是字符串，a[1]其实就是 a['1']，JavaScript 中的对象就是字符串到任意值的键值对，注意键只能是字符串。

### 其它

```
Array.apply(null, Array(3)).map(Function.prototype.call.bind(Number))
// [0, 1, 2]

===>
Array.apply(null, Array(3)).map(function(...rest){return Number.call(...rest)})
// [0,1,2]

===>
Array.apply(null, Array(3)).map(function(x, i){return i})
```

也就相当于：

```
Array.apply(null, Array(3)).map(Function.prototype.call.bind(Number))
===>
Array.apply(null, Array(3)).map(Function.prototype.call, Number)
```