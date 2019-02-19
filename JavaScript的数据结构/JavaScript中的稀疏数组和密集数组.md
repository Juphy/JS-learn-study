## JavaScript
原文[JavaScript: spare arrays vs. dense arrays](http://2ality.com/2012/06/dense-arrays.html)

一般来说，JavaScript中的数组都是稀疏的，也就是说数组之间可以有空隙，因为数组其实就是一个键值的映射。

### 稀疏数组
遍历稀疏数组时，如果没有元素，javascript会跳过这些缝隙。使用forEach循环的时候，不会执行callback函数。filter遍历时也会被忽略。
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
密集数组表面上与稀疏数组没有太多的区别，但是可以遍历到这些数组元素并为每个元素重新赋值。

### JavaScript中的数组
JavaScript中的Array并不是常规意义上的数组，只不过是会自动管理一些“数字”属性和length属性的对象而已，JavaScript数组中的索引是数字，也是字符串，a[1]其实就是a['1']，JavaScript中的对象就是字符串到任意值的键值对，注意键只能是字符串。

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
### 实际用途

