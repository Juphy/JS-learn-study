// let data = [
//     {value: 4},
//     {value: 2},
//     {value: undefined},
//     {value: undefined},
//     {value: 1},
//     {value: undefined},
//     {value: undefined},
//     {value: 7},
//     {value: undefined},
//     {value: 4}
// ];
// data1 = data.sort((x, y) => x.value - y.value).map(x => x.value);
// console.log(data1);
// data2 = data.map(x => x.value).sort((x, y) => x - y);
// console.log(data2);
// let nums = [-12, 23, 34, 56, 25, 35, 46];
// for (let i = 0; i < nums.length; i++) {
//     for (let j = i + 1; j < nums.length; j++) {
//         if (nums[i] > nums[j]) {
//             [nums[i], nums[j]] = [nums[j], nums[i]];
//         }
//     }
// }
// console.log(nums);


let fn = (f) => {
    a = '1';
    b = '2';
    f(a, b);
};

var _a, _b;
console.log(_a, _b);

async function foo() {
    return await fn((x, y) => {
        _a = x;
        _b = y;
    });
}

foo().then(r => {
    console.log(_a, _b);
});

console.log(3, 4);
