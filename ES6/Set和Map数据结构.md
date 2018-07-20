### Set
> 类似于数组，但是成员的只是唯一的，没有重复的值。

Set本身是一个构造函数，用来生成Set数据结构。
```
const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
```
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```

向Set加入值的时候，不会发生类型转换，Set内部会判断两个值是否相同，使用的算法是"Same-value-zero equality"，类似于绝对比较'==='，主要区别是NaN，而精确相等运算认为NaN不相等。
```
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```

### 属性和方法
#### 属性
- Set.prototype.constructor：构造函数，默认就是Set函数
- Set.prototype.size：返回Set实例的成员总数
#### 方法
Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）
- 操作方法：
    - add(value)：添加某个值，返回Set结构本身
    - delete(value)：删除某个值，返回一个布尔值，表示删除是否成功
    - has(value)：返回一个布尔值，表示该值是否为Set的成员
    - clear()：清除所有成员，没有返回值
    - Set结构转数组：Array.from(array)或者[...set]
- 遍历方法（Set的遍历顺序就是插入顺序）
    - keys(): 返回键名的遍历器
    - values(): 返回键值的遍历器
    - entries(): 返回键值对的遍历器
    - forEach(): 使用回调函数遍历每个成员
由于Set结构没有键名，只有键值，所以keys方法和values方法的行为完全一致。entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
```
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
```

Set结构的实例与数组一样，可以使用forEach和for...of方法，Set结构的键名与键值，因此key和value的值永远一样，forEach方法还可以有第二个参数，表示处理函数内部的this对象。

数组的map也可以间接用于Set，将Set转为数组，该数组使用map和filter方法，再转为Set结构。

Set借助与数组很容易实现并集（Union）、交集（Intersect）、差集（Difference）。
```
let a = new Set([1,2,3]);
let b = new Set([4,3,2]);
 // 并集
 let union = new Set([...a, ...a]);

 // 交集
 let intersect = new Set([...a].filter(i => b.has(i)));

 // 差集
 let difference = new Set([...a].filter(i => !b.has(i)))
```
