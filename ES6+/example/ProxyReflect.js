var obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
})

obj.count = 1;
// setting count!
++obj.count;
// getting count!
// setting count!

var proxy = new Proxy({}, {
    set(target, property) {
        return 35;
    }
})
proxy.time // 35
proxy.name // 35
proxy.title // 35

var handler = {
    get(target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        return `Hello, ` + name;
    },
    apply(target, thisBinding, args) {
        return args[0];
    },
    construct(target, args) {
        return { value: args[1] };
    }
};

var fproxy = new Proxy(function(x, y) {
    return x + y;
}, handler);

console.log(fproxy(1, 2)); // 1
console.log(new fproxy(1, 2)); // { value: 2 }
console.log(fproxy.prototype === Object.prototype); // true
console.log(fproxy.foo === "Hello, foo"); // true

// GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET
var person = {
    name: 'Tom'
}
var proxy = new Proxy(person, {
    get(target, property) {
        if (property in target) {
            return target[property];
        } else {
            throw new ReferenceError(`Property "${property}" does not exist.`)
        }
    }
})
console.log(proxy.name);
// console.log(proxy.age);

var proto = new Proxy({}, {
    get(target, propertyKey, receiver) {
        console.log('GET ' + propertyKey);
        return target[propertyKey];
    }
})
var obj = Object.create(proto);
obj.foo; // "GET foo"

// 使用get拦截，实现数组读取负数的索引
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    };
    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
console.log(arr[-1]);

// 函数名链式使用
var handler = {
    double(n) {
        return n * 2;
    },
    pow(n) {
        return n * n;
    },
    reverseInt(n) {
        return n.toString().split('').reverse().join('') | 0;
    }
}
var pipe = (function() {
    return function(value) {
        var funcStack = []; // 将所需函数存储
        var oproxy = new Proxy({}, {
            get(pipObject, fnName) {
                if (fnName === 'get') {
                    return funcStack.reduce(function(val, fn) {
                        return fn(val)
                    }, value);
                }
                funcStack.push(handler[fnName]);
                return oproxy;
            }
        })
        return oproxy;
    }
}());
console.log(pipe(3).double.pow.reverseInt.get);

// get拦截，实现一个生成各种DOM节点的通用函数dom
// var dom = new Proxy({}, {
//     get(target, property) {
//         return function(attrs = {}, ...children) {
//             const el = document.createElement(property);
//             for (let prop of Object.keys(attrs)) {
//                 el.setAttribute(prop, attrs[prop]);
//             }
//             for (let child of children) {
//                 if (typeof child === 'string') {
//                     child = document.createTextNode(child);
//                 }
//                 el.appendChild(child);
//             }
//             return el;
//         }
//     }
// })
// const el = dom.div({},
//     'Hello, my name is ',
//     dom.a({ href: '//example.com' }, 'Mark'),
//     '. I like:',
//     dom.ul({},
//         dom.li({}, 'The web'),
//         dom.li({}, 'Food'),
//         dom.li({}, `...actually that\'s it`)
//     )
// );
// document.body.appendChild(el);

// 总是指向原始的读操作所在的那个对象
var proxy = new Proxy({}, {
    get: function(target, property, receiver) {
        return receiver;
    }
})
console.log(proxy.getReceiver === proxy);
// proxy对象的getReceiver属性是由proxy对象提供的，所以receiver指向proxy对象。

var proxy = new Proxy({}, {
    get: function(target, property, receiver) {
        return receiver;
    }
})
var d = Object.create(proxy);
console.log(d.a === d);
// d对象本身没有a属性，所以读取d.a的时候，会去d的原型proxy对象找，这时receiver就指向d，代表原始的读操作所在的那个对象。

var target = Object.defineProperties({}, {
    foo: {
        valu: 123,
        writable: true,
        configurable: true
    }
});
var handler = {
    get(target, propKey) {
        return 'abc';
    }
};
proxy = new Proxy(target, handler);
console.log(proxy.foo);


// SET  SET  SET  SET  SET  SET  SET  SET  SET  SET  SET  SET 
// Person对象上有一个age属性，该属性应该是一个不大于200的整数
var validator = {
    set(obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        obj[prop] = value;
    }
};
var person = new Proxy({}, validator);
person.age = 100;
console.log(person.age);
// person.age = 'young';
// person.age = 300;
// 由于设置了存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误，这是数据验证的一种实现方法，利用set方法，还可以数据绑定，即每当对象发生变化时，会自动更新DOM。

// 有时，对象上的内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用
function invariant(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}
var handler = {
    get(target, key) {
        invariant(key, 'get');
        return target[key];
    },
    set(target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
    }
}
var target = {};
var proxy = new Proxy(target, handler);
//proxy._prop; // Error: Invalid attempt to get private "_prop" property
//proxy._porp = 'c'; // Error: Invalid attempt to set private "_prop" property

var handler = {
    set(obj, prop, value, receiver) {
        obj[prop] = receiver;
    }
}
var proxy = new Proxy({}, handler);
proxy.foo = 'bar';
console.log(proxy.foo === proxy);

var handler = {
    set(obj, prop, value, receiver) {
        obj[prop] = receiver;
    }
}
var proxy = new Proxy({}, handler);
var myObj = {};
Object.setPrototypeOf(myObj, proxy);
myObj.foo = "bar";
console.log(myObj.foo === myObj);
//  set方法的第四个参数receiver，指的是原始的操作行为所在的那个对象，一般情况下是proxy。
//  设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。myObj的原型对象proxy是一个Proxy实例，设置它的foo属性会触发set方法，这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。

var obj = {};
Object.defineProperty(obj, 'foo', {
    value: 'bar',
    writable: false
});
var handler = {
    set(obj, prop, value, receiver) {
        obj[prop] = 'baz';
    }
}
var proxy = new Proxy(obj, handler);
proxy.foo = "baz";
console.log(proxy.foo);
// obj.foo属性不可写，Proxy对这个属性的set设置不会生效

(function() {
    'use strict';
    let handler = {
        set(obj, prop, value, receiver) {
            obj[prop] = receiver;
            // 无论有没有下面这一行，都会报错
            return true;
        }
    }
    let proxy = new Proxy({}, handler);
    proxy.foo = 'bar';
})()
// 在严格模式下，set代理如果没有返回true，就会报错。

///// APPLY APPLY APPLY APPLY APPLY APPLY APPLY APPLY//////
var handler = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments);
    }
}

var target = function() {
    return 'I am the target';
}
var handler = {
    apply() {
        return 'I am the proxy';
    }
}
var p = new Proxy(target, handler);
p(); // "I am the Proxy"
// 变量p是Proxy的实例，当它作为函数调用时，就会被apply方法拦截返回一个字符串。

var twice = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments) * 2;
    }
}

function sum(left, right) {
    return left + right;
}
var proxy = new Proxy(sum, twice);
console.log(proxy(1, 2)); // 6
console.log(proxy.call(null, 5, 6)); // 22
console.log(proxy.apply(null, [7, 8])); // 30
// 每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截

// 直接调用Reflect.apply方法，也会被拦截。
Reflect.apply(proxy, null, [9, 10]); // 38

// HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS HAS
var handler = {
    has(target, key) {
        if (key[0] === '_') {
            return false;
        }
        return key in target;
    }
}
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
console.log('_prop' in proxy);
// 如果原对象的属性名第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。

var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
        has(target, prop) {
            return false;
        }
    })
    // console.log('a' in p); //  TypeError is thrown
    // obj对象禁止扩展，结果使用has拦截就会报错，也就是说如果某个属性不可配置（或者目标对象不可拓展），则has方法就不得“隐藏”（即返回false）目标对象的该属性。

var stu1 = { name: '张三', score: 59 },
    stu2 = { name: '李四', score: 99 };
var handler = {
    has(target, prop) {
        if (prop === 'score' && target[prop] < 60) {
            console.log(`${target.name} 不及格`);
            return false;
        }
        return prop in target;
    }
}
var proxy1 = new Proxy(stu1, handler);
var proxy2 = new Proxy(stu2, handler);
console.log('score' in proxy1); // 张三 不及格 false
console.log('score' in proxy2); // true
for (let a in proxy1) {
    console.log(proxy1[a]);
}
// 张三  59
for (let a in proxy2) {
    console.log(proxy[a]);
}
//李四 99

var p = new Proxy(function() {}, {
    construct(target, args) {
        console.log('called: ' + args.join(','));
        return { value: args[0] * 10 };
    }
})
console.log((new p(1)).value);
// "called: 1"
// 10

// deleteProperty
function invariant(key, action) {
    if (key[0] === "_") {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}
var handler = {
    deleteProperty(target, key) {
        invariant(key, 'delete');
        delete target[key];
        return true;
    }
}
var target = { _porp: 'foo' };
var proxy = new Proxy(target, handler);
// delete proxy._prop   // Error: Invalid attempt to delete private "_prop" property
// deleteProperty方法拦截了delete操作符，删除第一个字符为下划线的属性会报错

// defineProperty
var handler = {
    defineProperty(target, key, descriptor) {
        return false;
    }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = "bar"; // 不会生效

// getOwnPropertyDescriptor
var handler = {
    getOwnPropertyDescriptor(target, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
}
var target = { _foo: 'bar', baz: "tar" };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat'); // undefined
Object.getOwnPropertyDescriptor(proxy, '_foo'); // undefined
Object.getOwnPropertyDescriptor(proxy, 'baz'); // { value: 'tar', writable: true, enumerable: true, configurable: true }

// getPrototypeOf
var proto = {};
var p = new Proxy({}, {
    getPrototypeOf(target) {
        return proto;
    }
});
console.log(Object.getPrototypeOf(p) === proto); // true;
// getPrototypeOf方法拦截Object.getPrototypeOf()，返回protocol对象
// getPrototypeOf方法的返回值必须是对象或者null,否则报错。另外，如果目标对象不可扩展（non-extensible），getPrototypeOf方法必须返回目标对象的原型对象。


// isExtensible
var p = new Proxy({}, {
    isExtensible: function(target) {
        console.log('called');
        return true;
    }
})
console.log(Object.isExtensible(p)); // "called"  true

var p = new Proxy({}, {
        isExtensible: function(target) {
            return false;
        }
    })
    // Object.isExtensible(p);
    // Uncaught TypeError: "isExtensible" on proxy: trap result does not reflect extensibility of proxy target (which is 'true')


// ownKeys ownKeys ownKeys ownKeys ownKeys ownKeys ownKeys

var target = {
    a: 1,
    b: 2,
    c: 3
}
var handler = {
    ownKeys(target) {
        return ['a'];
    }
}
var proxy = new Proxy(target, handler);
console.log(Object.keys(proxy)); // ['a']
// 拦截对象target的Object.keys()操作，只返回a、b、c三个属性中的a属性

var target = {
    _bar: 'foo',
    _prop: 'bar',
    prop: 'baz'
}
var handler = {
    ownKeys(target) {
        return Reflect.ownKeys(target).filter(key => key[0] !== '_');
    }
}
let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
    console.log(target[key]);
}
// "baz"

var target = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.for('secret')]: '4'
}
Object.defineProperty(target, 'key', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 'static'
})
var handler = {
    ownKeys(target) {
        return ['a', 'd', Symbol.for('secret'), 'key'];
    }
}
var proxy = new Proxy(target, handler);
Object.keys(proxy); // ['a']
// 显式返回不存在的属性（d）、Symbol值（Symbol.for('secret')）、
// 不可遍历的属性（key）结果都被自动过滤掉

var p = new Proxy({}, {
    ownKeys(target) {
        return ['a', 'b', 'c'];
    }
})
console.log(Object.getOwnPropertyNames(p)); // ['a', 'b', 'c']

var obj = { hello: 'world' };
var proxy = new Proxy(obj, {
    ownKeys() {
        return ['a', 'b'];
    }
})
for (let key in proxy) {
    console.log(key); // 没有任何输出
}
// ownkeys指定返回a和b属性，由于obj没有这两个属性，因此for...in循环不会有任何输出

var obj = {};
var p = new Proxy(obj, {
    ownKeys(target) {
        return [123, true, undefined, null, {},
            []
        ];
    }
})
Object.getOwnPropertyNames(p); // Uncaught TypeError: 123 is not a valid property name
// OwnKeys方法返回的数组成员，只能是字符串或Symbol值，如果有其他类型的值或者返回的根本不是数组，就会报错。

var obj = {};
Object.defineProperty(obj, 'a', {
    configurable: false,
    enumerable: true,
    value: 10
})
var p = new Proxy(obj, {
    ownKeys(target) {
        return ['b'];
    }
})







var handler = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments);
    }
}

var target = function() { return `I am the target ` }
handler = {
    apply: function() {
        return `I am the proxy`;
    }
}

var p = new Proxy(target, handler);
p();

console.assert('1' == 2, '失败');