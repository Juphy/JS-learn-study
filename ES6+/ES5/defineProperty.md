### Object,defineProperty(obj, prop, descriptor)

- obj: 必需。目标对象
- prop: 必需。定义或修改属性的名字
- descriptor: 必需。目标属性所拥有的的特性

```
var obj = {
    test: 'hello'
}
Object.defineProperty(obj, 'test', {
    configurable: true | false,            `
    enumerable: true | false,  是否可以被枚举。默认false
    value: 任意类型的值,  是否可以删除目标属性或是否可以再次修改属性的特性。默认 false
    // 目标属性是否可以使用delete删除
    // 目标属性是否可以再次设置特性
    writable: true | false   属性值是否可以被重写。默认false
})
```

### 存取器

`当使用了getter或setter党发，不允许使用writable和value这俩个属性。`

- getter/setter 当设置或获取对象的某个属性的值的时候，可以提供 getter/setter

```
var obj = {};
var initValue = 'hello';
Object.defineProperty(obj, 'newKey', {
    get: function(){
        // 当取值的时候触发的函数
        return initValue;
    },
    set: function(value){
        // 当设置值的时候触发的函数，设置的新值通过参数value
        initValue = value;
    }
})
```

get 或 set 不是必须成对出现，任写其一就可以。如果不设置方法，则 get 和 set 的默认值为 undefined。
