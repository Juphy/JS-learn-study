async function async2() {
    console.log('async2')
}

console.log('script start');

setTimeout(function () {
    console.log('setTimeout')
}, 0);

async function async1() {
    console.log('async1 start');
    await async2().then(function () {
        console.log('async2 promise');
    });
    console.log('async1 end')
}

async1();

new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2')
});

console.log('script end');

// process.nextTick(function A() {
//     console.log(1);
//     process.nextTick(function B() {
//         console.log(2);
//     });
//     process.nextTick(function D() {
//         console.log(5)
//     })
// });

setTimeout(function timeout() {
    console.log('TIMEOUT FIRED');
}, 0);

// process.nextTick(function C() {
//     console.log(3);
//     process.nextTick(function D() {
//         console.log(4);
//     });
// });

setTimeout(function () {
    console.log('定时器开始啦')
});

new Promise(function (resolve) {
    console.log('马上执行for循环啦');
    for (var i = 0; i < 10000; i++) {
        i == 99 && resolve();
    }
}).then(function () {
    console.log('执行then函数啦')
});

console.log('代码执行结束');
