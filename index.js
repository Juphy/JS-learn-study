// 反转链表
let reverse = (arr) => {
    let pre, cur = arr;
    while (cur) {
        let next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}

let reserve1 = (arr) => {
    if (arr === null && arr.next === null) {
        return arr;
    }
    let newArr = reverse1(arr.next);
    arr.next.next = arr;
    arr.next = null;
    return newArr
}

let mergeArr = (arr1, arr2) => {
    let m = arr1.length - 1,
        n = arr2.length - 1,
        len = m + n + 1;
    while (n > -1) {
        console.log(len, m, n);
        if (m < 0) {
            arr1[len--] = arr2[n--];
            continue;
        }
        arr1[len--] = arr1[m] > arr2[n] ? arr1[m--] : arr2[n--];
    }
    return arr1;
}

console.log(mergeArr([1, 3, 5, 7, 9], [2, 4, 6, 8]));

async function sleep(timer) {
    return new Promise(resolve => {
        setTimeout(resolve, timer);
    })
};
(async function () {
    console.log(new Date());
    await sleep(1000);
    console.log(new Date());
})();

// 指定时间之后执行
async function asyncDone(cb, delay, ...rest) {
    await sleep(delay);
    cb.apply(this, rest);
}

function a() {
    console.log(arguments); // {0:1, 1:2, 2:3}
};
asyncDone(a, 1000, 1, 2, 3, 4);

class Sleep {
    constructor(delay) {
        this.delay = delay;
    }

    then(resolve, reject) {
        let start = Date.now();
        setTimeout(() => {
            resolve(Date.now() - start);
        }, this.delay);
    }
}
(async function () {
    let sleep = await new Sleep(1000);
    console.log(sleep);
})();

async function one() {
    for (let i = 1; i < 5; i++) {
        console.log('x', i);
        await sleep(1000)
    }
}
one();

// 多次重复尝试发送请求
async function test(url, num) {
    for (let i = 0; i < num; i++) {
        try {
            await fetch(url);
            break;
        } catch (error) {

        }
    }
}
test();


// var [foo, bar] = await Promise.all([getFoo(), getBar()]);
// //==>
// var fooPromise = getFoo();
// var barPromise = getBar();
// var foo = await fooPromise;
// var bar = await barPromise;




// function debounce(cb, delay, flag) {
//     let timer;
//     return function () {
//         if (flag && !timer) {
//             cb.apply(this, arguments);
//         }
//         if (timer) clearTimeout(timer);
//         timer = setTimeout(() => {
//             cb.apply(this, arguments);
//         }, delay)
//     }
// }

// function throttle(cb, delay, flag) {
//     let timer, callNow = flag;
//     return function () {
//         if (callNow) {
//             cb.apply(this, arguments);
//             callNow = false;
//         }
//         if (!timer) {
//             timer = setTimeout(() => {
//                 cb.apply(this, arguments);
//                 timer = null;
//             }, delay)
//         }
//     }
// }

// let inherit = (function () {
//     let F = function () { };
//     return function (target, origin) {
//         F.prototype = origin.prototype;
//         target.prototype = new F();
//         target.constructor = target;
//         target.prototype.uber = origin.prototype;
//     }
// })();

// // 类型检测
// let Type = {};
// 'Array Date RegExp Object Error'.split(' ').forEach(key => Type['[object ' + key + ']'] = key.toLowerCase());
// function type(obj) {
//     if (obj === null) return String(obj);
//     return typeof obj === 'object' ? Type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
// }

// // bind
// Function.prototype.bind = function (context) {
//     var _this = this;
//     var args = Array.prototype.slice.call(arguments, 1);
//     return function () {
//         _this.apply(context, args);
//     }
// }

let debounce = function (cb, delay, flag) {
    let timer;
    return function () {
        if (flag && !timer) {
            cb.apply(this, arguments);
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb.apply(this, arguments)
        }, delay);
    }
}

let throttle = function (cb, delay, flag) {
    let timer, callNow = flag;
    return function () {
        if (callNow) {
            cb.apply(this, arguments);
            callNow = false;
        }
        if (!timer) {
            timer = setTimeout(() => {
                cb.apply(this, arguments);
                callNow = null;
            }, delay)
        }
    }
}

let inherit = (function () {
    let F = function () {};
    return function (target, origin) {
        F.prototype = origin.prototype;
        target.prototype = new F();
        target.constructor = target;
        target.prototype.uber = origin.prototype;
    }
})()

function build(Fn, ...rest) {
    let result = new Object();
    result.__proto__ = Fn.Prototype;
    let result2 = Fn.apply(result, rest);
    if (result2 !== null && (typeof result2 === 'object' || typeof result2 === 'function')) {
        return result2;
    }
    return result;
}

// 类型检测
let types = {};
"Array Date RegExp Object Error Map Set Number String Boolean Undefined Null Array Arguments".split(' ').forEach(e => types["[object " + e + "]"] = e.toLowerCase());
let type = function (obj) {
    if (obj === null) return String(obj);
    return typeof obj === "object" ? types[Object.prototype.toString.call(obj)] : typeof obj;
}

// 简单的深拷贝
let deepCopy = function (obj) {
    if (obj instanceof Array) {
        let arr = [];
        for (let i = 0; i < obj.length; i++) {
            arr[i] = deepCopy(arr[i])
        }
        return arr;
    } else if (obj instanceof Object) {
        let arr = {};
        for (let key in obj) {
            arr[key] = obj[key]
        }
        return arr;
    } else {
        return obj
    }
}

Function.prototype.bind = function (context) {
    let that = this,
        args = Array.prototype.slice.call(arguments, 1);
    return function () {
        that.apply(context, args);
    }
}

function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

console.log(bubbleSort([34, 56, 1, 45, 9]))

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let mid = arr.splice(Math.floor(arr.length / 2), 1)[0];
    let left = [],
        right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < mid) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(mid, quickSort(right))
}
console.log(quickSort([34, 56, 1, 45, 9]))

function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
    return arr;
}
console.log(selectSort([34, 56, 1, 45, 9]))

function stackSort(arr) {
    var tmp = [];
    while (arr.length) {
        let peak = arr.pop();
        while (tmp && tmp.slice(-1) > peak) {
            arr.push(tmp.pop())
        }
        tmp.push(peak);
    }
    return tmp;
}

// 插入排序
function insertSort(arr) {
    let preIndex, current;
    for (let i = 1; i < arr.length; i++) {
        preIndex = i - 1;
        current = arr[i];
        while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}
console.log(insertSort([34, 56, 1, 45, 9]))