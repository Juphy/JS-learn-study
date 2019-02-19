### Set
一种无重复值的有序列表，允许对Set包含的数据进行快速访问，从而能更有效地追踪离散值。

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

向Set加入值的时候，不会发生类型转换，Set内部会判断两个值是否相同，使用的算法是"Same-value-zero equality"，类似于绝对比较'==='，主要区别是NaN，而精确相等运算认为NaN不相等。+0与-0在Set中被判断为是相等的。
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
    - forEach(): 使用回调函数遍历每个成员，传递一个回调函数，该回调函数接受三个参数：
        - set中下个位置的值（value）
        - 与第一个参数相同的值（key）
        - set自身
由于Set结构没有键名，只有键值，所以keys方法和values方法的行为完全一致。entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等。

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
```
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
```
Set结构的实例与数组一样，可以使用forEach和for...of方法，Set结构的键名与键值，因此key和value的值永远一样，forEach方法还可以有第二个参数，表示处理函数内部的this对象。
```
let set = new Set([1, 2]);
let processor = {
    output(value) {
        console.log(value);
    },
    process(dataSet) {
        dataSet.forEach(function(value) {
            this.output(value);
        }, this);
        // 或者
        dataSet.forEach((value)=> this.output(value));
    }
};
processor.process(set)
```

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

### Weak Set
对象存储在set的一个实例中，实际上相当于存储在变量中，只要对于Set实例的引用任然存在，所存储的对象就无法被垃圾回收机制回收，从而无法释放内存，
```
let set = new Set(), key ={};
set.add(key);  // set.size = 1
// 取消原始引用
key = null; // set.size = 1
// 重新获得原始引用
key = [...set][0];
```
将key设置为null清除了对key对象的一个引用，但是另一个引用还存在于set内部，将其转为数组时依旧可以取回原先的对象，但是有时期望当其它引用消失之后，set内部的引用最好也能随之消失。例如，当 JS 代码在网页中运行并保持了与DOM 元素的联系，在该元素可能被其他脚本移除的情况下，你应当不希望自己的代码保留对
该 DOM 元素的最后一个引用（这种情况被称为内存泄漏）。

为了缓解这一问题，Weak Set该类型只允许储存对象弱引用，而不能存储基本类型的值，对象的弱引用在它自己成为该对象的唯一引用时，不会阻止垃圾回收。

#### Set与Weak Set之间的差异
- 最大的区别就是对象的弱引用
```
let set = new WeakSet(), key = {};
set.add(key);

// 移除对于键的最后一个强引用，同时从Weak Set中移除
key = null
```
Weak Set中的key引用就不能再访问了，这一点无法证实，因为需要把对于该对象的一个引用传递给has()方法（而只要存在其他引用，Weak Set内部的弱引用就不会消失）。
- 1. 对于  WeakSet  的实例，若调用  add()  方法时传入了非对象的参数，就会抛出错误，
has()  或  delete()  则会在传入了非对象的参数时返回  false  ；
- 2. Weak Set 不可迭代，因此不能被用于  for-of  循环；
- 3. Weak Set 无法暴露出任何迭代器（例如  keys()  与  values()  方法），因此没有任何编
程手段可用于判断 Weak Set 的内容；
- 4. Weak Set 没有  forEach()  方法；
- 5. Weak Set 没有  size  属性。

### Map
ES6中的Map类型是键值对的有序列表，而键和值都可以是任意类型。键的比较使用的是Object.is()
- size（size属性返回Map结构的成员总数），指明有多少个键值对
```
const map = new Map();         
map.set('foo', true);
map.set('bar', false);
map.size // 2
```
- set(key, value)设置键名和键值，然后返回当前Map对象，因此可以采用链式写法。如果key已经有值，则键值会被更新，否则就新生成该键。
- get(key)，读取key对应的键值，如果找不到key，就返回undefined
- has(key)，返回一个布尔值，表示某个键是否在当前Map对象中
- delete(key)，删除某个键，返回true，如果删除失败，返回false
- clear()，清除所有成员，没有返回值
- 遍历方法：遍历顺序就是插入的顺序
    - keys()：返回键名的遍历器
    - values()：返回键值的遍历器
    - entries()：返回所有成员的遍历器
    - forEach()：遍历Map的所有成员，回掉函数中的第一个是值，第二个是键（数组中的键是数组索引），第二个参数来指定回调函数

#### Map与其他数据转换
- Map转为数组
```
let map = new Map().set(true, 7).set({foo: 3}, ['abc']);
[...map] // [[true, 7], [{foo: 3}, ['abc']]];
```
- 数组转为Map
```
new Map([
    [true, 7],
    [{foo: 3}, ['abc']
])
=>
Map {
    true => 7,
    Object {foo: 3} => ['abc']
}
```
- Map转为对象（如果所有的Map的键都是字符串，它可以无损地转为对象；如果有非字符串的键名，那么键名会被转成字符串，在作为对象的键名）
```
function strMapToObj(strMap){
    let obj = Object.create(null);
    for(let [k,v] of strMap){
        obj[k]=v;
    }
    return obj;
}
let myMap = new Map().set('yes', true).set('no', false);
strMapToObj(myMap);
```
- 对象转Map
```
function objToMap(obj){
    let strMap = new Map();
    for(let key Object.keys(obj)){
        strMap.set(k, obj[k]);
    }
    return strMap;
}
objToMap({yes: true, no: false});
// Map {"yes" => true, "no" => false}
```
- Map转为JSON
    - Map的键名都是字符串，这时可以选择转为对象JSON，先将Map转为obj
    ```
    function strMapToJson(strMap){
        return JSON.stringify(strMapToObj(strMap));
    }
    let myMap = new Map().set('yes', true).set('no', false);
    strMapToJson(myMap);
    // '{"yes": true, "no": false}'
    ```
    - Map的键名有非字符串，这时可以选择转为数组JSON
    ```
    function mapToArrayJson(map){
        return JSON.stringify([...map]);
    }
    let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
    mapToArrayJson(myMap)
    // '[[true, 7], [{"foo": 3}, ["abc"]]]'
    ```
    - JSON转为Map（正常情况下，所有的键名都是字符串）
        - 整个JSON非数组
        ```
        function jsonToStrMap(jsonStr){
            return objToMap(JSON.parse(jsonStr));
        }
        jsonToStrMap('{"yes": true, "no": false}')
        // Map {'yes' => true, 'no' => false}
        ```
        - 整个JSON是数组，且每个数组成员又是一个有两个成员的数组
        ```
        function jsonToMap(jsonStr){
            return new Map(JSON.parse(jsonStr))
        }
        jsonToMap('[[true, 7], [{"foo": 3}, ["abc"]]]')
        ```
### Weak Map
Weak Map与Weak Set一致，都是存储对象弱引用的方式。在Weak Map中，所有的键都必须是对象（尝试使用非对象的键抛出错误），而且这些对象都是弱引用，不会干扰垃圾回收，当Weak Map中的键在Weak Map之外不存在引用时，该键值对会被移除。
Weak Map的最佳用处就是在浏览器中创建一个关联到特定DOM元素的对象，例如，某些用在网页上的JS库会维护一个自定义对象，用于引用该库所使用的每一个DOM元素，并且其映射关系会存储在内部的对象缓存中。如何判断一个DOM元素在网页中已不复存在，以便改库能够移除此元素的关联对象，若做不到，该库就会继续保持对DOM元素的一个无效引用，并造成内存泄漏。使用 Weak Map 来追踪 DOM 元素，依然允许将自定义对象关联到每个 DOM 元素，而在此对象所关联的 DOM 元素不复存在时，它就会在 Weak Map 中被自动销毁。
Weak Map的键才是弱引用，而值不是，在Weak Map的值中存储对象，就算该对象的其它引用已全都移除，也会阻止垃圾回收。
ES6的WeakMap类型是键值对的无序列表，其中键必须是非null的对象，值则允许是任意类型。WeakMap的接口与Map的非常类似，都使用set()与get()方法来分别添加与提取数据。
```
let map = new WeakMap(), element = document.querySelector(".element");
map.set(element, "Original");
let value = map.get(element);
console.log(value); // "Original"
// 移除元素
element.parentNode.removeChild(element);
element = null;
// 该 Weak Map在此处为空
```
类似于Weak Set，没有任何办法可以确认Weak Map是否为空，因为它没有size属性，在其它引用被移除后，由于对键的引用不再有残留，也就无法调用get()方法来提取对应的值。Weak Map已经切断了对于该值的访问，其所占的内存在垃圾回收器运行时便会被释放。
Weak Map只有两个附加方法用来与键值对交互，has()与delete()，与Weak Set相同，枚举Weak Map既没必要也不可能，因此clear()方法也不存在，也无法使用size属性。
#### Weak Map私有属性
```
let Person = (function(){
    let privateData = new WeakMap();
    function Person(name){
        privateData.set(this, {name: name});
    }
    Person.prototype.getName = function(){
        return privateData.get(this).name;
    };
    return Person;
}())
```
总结：
Set与Map都是有序的，遍历的顺序就是插入的顺序，Weak Set与Weak Map是无序，不可遍历也就不可以clear，也没有size属性。