function async1() {
    return new Promise((resolve, reject) => {
        console.log(11);
        resolve(10);
    })
}

async function async2() {
    await async1().then(e => console.log(8));
    console.log(7);
    await async1();
    console.log(2);
}

async function async3() {
    console.log(9)
    await async1().then((r) => console.log(r));
    console.log(6);
}

async2();
async3();

new Promise(resolve => {
    resolve();
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
});

// new Promise(function (resolve, reject) {
//     console.log('Promise');
//     resolve();
//     new Promise(function (resolve, reject) {
//         console.log('Promise>>>');
//         resolve();
//     }).then(function () {
//         console.log('resolved.>>>');
//     })
// }).then(function () {
//     console.log('resolved.');
// })

// new Promise(function (resolve, reject) {
//     console.log('Promise');
//     resolve();
//     new Promise(function (resolve, reject) {
//         console.log('Promise>>>');
//         resolve();
//     }).then(function () {
//         console.log('resolved.>>> 0');
//     }).then(function () {
//         console.log('resolved.>>> 1');
//     }).then(function () {
//         console.log('resolved.>>> 2');
//     }).then(function () {
//         console.log('resolved.>>> 3');
//     })
// }).then(function () {
//     console.log('resolved. 0');
// }).then(function () {
//     console.log('resolved. 1');
// }).then(function () {
//     console.log('resolved. 2');
// }).then(function () {
//     console.log('resolved. 3');
// })