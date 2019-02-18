## JavaScript
原文[JavaScript: spare arrays vs. dense arrays](http://2ality.com/2012/06/dense-arrays.html)

一般来说，JavaScript中的数组都是稀疏的，也就是说数组之间可以有空隙，因为数组其实就是一个键值的映射。

### 稀疏数组
```
var a=new Array(3) // [empty x 3]
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
