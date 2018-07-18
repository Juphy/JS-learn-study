const typedArray1 = new Int8Array(8);
typedArray1[0] = 32;
const typedArray2 = new Int8Array(typedArray1);
typedArray2[1] = 42;
console.log(typedArray1);
console.log(typedArray2);
const ary1 = new Array(8);
ary1[0] = 32;
const ary2 = new Array(...ary1);
ary2[1] = 42;
console.log(ary1);
console.log(ary2);

var buffer = new ArrayBuffer(8);
var view = new Int32Array(buffer);
console.log(buffer);
console.log(view);
// 长度
var unit8 = new Uint8Array(2);
unit8[0] = 42;
console.log(unit8[0]);
console.log(unit8.length);
console.log(unit8.BYTES_PER_ELEMENT);
console.log(unit8);
// 数组
var arr = new Uint8Array([21, 31]);
console.log(arr[1]);
// 另一个TypedArray
var x = new Uint8Array([21, 31]);
var y = new Uint8Array(x);
console.log(y[0]);
// 另一个ArrayBuffer
var buffer = new ArrayBuffer(8);
var z = new Uint8Array(buffer, 1, 4);
console.log(z);