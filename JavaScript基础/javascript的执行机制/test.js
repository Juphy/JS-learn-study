//请写出输出内容
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0)

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

/**
 * script start
 * async1 start
 * async2
 * promise1
 * script _end
 * async1 end
 * promise2
 * setTimeout
 */

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  //async2做出如下更改：
  new Promise(function (resolve) {
    console.log('promise1');
    resolve();
  }).then(function () {
    console.log('promise2');
  });
}
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1();

new Promise(function (resolve) {
  console.log('promise3');
  resolve();
}).then(function () {
  console.log('promise4');
});

console.log('script end');

/**
 * script start
 * async1 start
 * promise1
 * promise3
 * script end
 * promise2
 * async1 end
 * promise4
 * setTimeout
 */

async function async1() {
  console.log('async1 start');
  await async2();
  //更改如下：
  setTimeout(function () {
    console.log('setTimeout1')
  }, 0)
}
async function async2() {
  //更改如下：
  setTimeout(function () {
    console.log('setTimeout2')
  }, 0)
}
console.log('script start');

setTimeout(function () {
  console.log('setTimeout3');
}, 0)
async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

/**
 * script start
 * async1 start
 * promise1
 * script end
 * promise2
 * setTimeout3
 * setTimeout2
 * setTimeout1
 */

async function a1() {
  console.log('a1 start')
  await a2()
  console.log('a1 end')
}
async function a2() {
  console.log('a2')
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise1')
})

a1()

let promise2 = new Promise((resolve) => {
  resolve('promise2.then')
  console.log('promise2')
})

promise2.then((res) => {
  console.log(res)
  Promise.resolve().then(() => {
    console.log('promise3')
  })
})
console.log('script end')

/**
 * script start
 * a1 start
 * a2
 * promise2
 * script end
 * promise1
 * a1 end
 * promise2.then
 * promise3
 * setTiemout
 */