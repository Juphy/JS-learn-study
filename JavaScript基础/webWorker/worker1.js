// onmessage = function (ev) {
//     // 主线程共享的数据，就是1KB的共享内存
//     const sharedBuffer = ev.data;

//     // 在共享内存上建立视图，方便读写
//     const sharedArray = new Int32Array(sharedBuffer);
// }

let ia;
onmessage = function (ev) {
    ia = ev.data;
    console.log(ia.length);
    console.log(ia[37]);
}