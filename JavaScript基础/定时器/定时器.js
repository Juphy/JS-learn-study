// setImmediate(function A() {
//     console.log(1);
//     setImmediate(function B() { console.log(2); });
// });
//
// setTimeout(function timeout() {
//     console.log('TIMEOUT FIRED');
// }, 0);


setImmediate(function () {
    setImmediate(function A() {
        console.log(1);
        setImmediate(function B() { console.log(2); });
    });

    setTimeout(function timeout() {
        console.log('TIMEOUT FIRED');
    }, 0);
});
// 1
// TIMEOUT FIRED
// 2
