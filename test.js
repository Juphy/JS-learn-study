// let sortByProps = function (item1, item2, attr, obj) {
//     // 默认升序 ascending  降序 descending
//     let cps;
//     if (!attr) {
//         attr = [];
//         for (const key in item1) {
//             attr.push(key);
//         }
//     }
//     for (const i of attr) {
//         const flag = obj && obj[i] ? obj[i] === 'ascending' : true;
//         if (item1[i] > item2[i]) {
//             cps = flag ? 1 : -1;
//             break;
//         } else if (item1[i] === item2[i]) {
//             cps = 0;
//         } else {
//             cps = flag ? -1 : 1;
//             break;
//         }
//     }
//     return cps;
// };
// let a = [
//     {a: 12, b: 13, c: 15},
//     {a: 12, b: 11, c: 16},
//     {a: 12, b: 11, c: 13},
//     {a: 13, b: 13, c: 15},
//     {a: 12, b: 10, c: 18}
// ];
// a.sort(function (a, b) {
//     return sortByProps(a, b);
// });
// console.log(a);
// let _ = require('lodash');
//
// function priceLt(x) {
//     return function (item) {
//         return item.price < x
//     }
// }
//
// let gems = [
//     {name: 'Sunstone', price: 4},
//     {name: 'Amethyst', price: 15},
//     {name: 'Prehnite', price: 20},
//     {name: 'Sugilite', price: 7},
//     {name: 'Diopside', price: 3},
//     {name: 'Feldspar', price: 13},
//     {name: 'Dioptase', price: 2},
//     {name: 'Sapphire', price: 20}
// ];
// let chosen = _(gems).filter(priceLt(10)).take(3).value();
// console.log(chosen);
console.time('*2');
for (var i = 0; i < 10000000; i++) {
    1.1 * 2
}
console.timeEnd('*2');

console.time('<');
for (var i = 0; i < 10000000; i++) {
    1.1 << 1
}
console.timeEnd('<');

console.time('/4');
for (var i = 0; i < 10000000; i++) {
    1.1 / 4
}
console.timeEnd('/4');

console.time('>>2');
for (var i = 0; i < 10000000; i++) {
    1.1 >> 2
}
console.timeEnd('>>2');
console.assert(1 > 2, 1);
console.table(['a', 'b', 'c']);