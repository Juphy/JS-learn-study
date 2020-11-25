setTimeout(() => {
    console.log(1)
});

setTimeout(() => {
    console.log(2)
}, 10);

new Promise((resolve, reject) => {
    console.log(3);
    resolve(4);
}).then(res => {
    console.log(res);
})

new Promise((resolve, reject) => {
    console.log(5);
    resolve(6);
}).then(res => {
    console.log(res);
})