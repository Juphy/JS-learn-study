// 深拷贝指的是在复制对象时， 该对象属性所引用的对象全部进行新建对象复制， 以保证深拷贝后的对象属性不存在任何对原对象属性的引用， 从而避免用户修改新对象属性值的同时也改变了其指向的旧对象属性。

// 传入一个参数 obj1，判断其是否对象类型，若不是则返回空对象{ }
// 若传入参数为对象类型，则返回深拷贝后的新对象，使其满足如下代码：

// var obj1 = {
//     a: 1,
//     b: { m: 2 },
//     c: [9, 0]
// };

// var obj2 = deepCopy(obj1);

// obj2.b = { m: 11 };
// obj2.c = 1;
// console.log(obj1.b.m);  //打印2，而不是11
// console.log(obj1.c);  //打印数组[9, 0]，而不是1

// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 
function deepCopy1(obj) {
    var newObj;
    // 在v8环境下obj.constructor返回[Function: Object]，与浏览器不一致。。。
    newObj = obj.constructor == Object ? Object.create(obj) : {};
    return newObj;
}

// 存在问题
// 新对象的__proto__指向了就对象，的确新对象的改变不影响旧对象，但是旧对象的改变就会影响新对象的默认值
var obj1 = {
    a: 1,
    b: { m: 2 },
    c: [9, 0]
};
console.log(obj1.constructor);
let _obj1 = deepCopy1(obj1);
// obj1.a = 2;
console.log(_obj1, _obj1.a);


function deepCopy2(obj) {
    if (obj instanceof Array) {
        let ary = [];
        for (let i = 0; i < obj.length; i++) {
            ary[i] = deepCopy2(obj[i]);
        }
        return ary;
    } else if (obj instanceof Object) {
        let newObj = {};
        for (let key in obj) {
            newObj[key] = deepCopy2(obj[key]);
        }
        return newObj
    } else {
        return obj;
    }
}

// 存在问题
// 使用instanceOf判断数据类型的原因，导致类型判断的顺序不能错，或者更改类型判断Object.prototype.toString.call()
var obj2 = {
    a: 1,
    b: { m: 2 },
    c: [9, 0]
}
let _obj2 = deepCopy2(obj2);
obj2.a = 2;
console.log(_obj2, _obj2.a);

// deepCopy对deepCopy2进行改进，将Array和Object的循环都使用in
function deepCopy3(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy3(obj[key]) : obj[key];
        }
    }
    return newObj;
}

var obj3 = {
    a: 1,
    b: { m: 2 },
    c: [9, 0]
}
let _obj3 = deepCopy3(obj3);
obj3.a = 2;
console.log(_obj3, _obj3.a);

// 深拷贝还要考虑循环引用的问题，JSON.stringify和parse在循环引用的场景下也会报错。。
var obj4 = {
    a: 1,
    b: { m: 2 },
    c: [9, 0]
};

var _obj4 = JSON.parse(JSON.stringify(obj4));
obj4.a = 2;
console.log(_obj4, _obj4.a);