### 深拷贝

> JSON.parse(JSON.string(obj))：

- undefined、任意函数以及symbol值，new Date()， 正则等在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成null（出现在数组中时）
- 不可枚举的属性会被忽略
- 如果一个被序列化的对象拥有toJSON方法，那么该方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用toJSON方法后的返回值会被序列化
- 不能解决循环引用问题
> Object.assign({}, target) 第一层市深拷贝，第二层是浅拷贝
> Jquery 的 extend
> 递归实现拷贝

```
let deepCopy= function(obj){
    if(obj instanceof Date || obj instanceof RegExp) return obj;
    let newObj = obj instanceof Array?[]:{};
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = typeof obj[kye]==='object'?:deepCopy(obj[key]) : obj[key]
        }
    }
    return newObj;
}
```

> 拓展运算符{...obj} 效果与Object.assign()类似。
