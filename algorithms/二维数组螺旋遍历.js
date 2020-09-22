let spiralOrder = function (ary) {
    let list = [];
    // 当维维数组是空的或任何一个维度是0，直接返回
    if (!ary || (!ary instanceof Array) || ary.length == 0 || ary[0].length == 0) return list;
    // m 行数  n 列数
    let m = ary.length, n = ary[0].length;
    for (let i = 0; i < (Math.min(m, n) + 1) / 2; i++) {
        // 从左到右遍历  上边
        for (let j = i; j < n - i; j++) {
            list.push(ary[i][j]);
        }
        // 从上到下 右边
        for (let j = i + 1; j < m - i; j++) {
            list.push(ary[j][(n - 1) - i])
        }
        //从右到左遍历“下边”
        for (let j = i + 1; j < n - i; j++) {
            list.push(ary[(m - 1) - i][(n - 1) - j]);
        }
        //从下到上遍历“左边”
        for (let j = i + 1; j < m - 1 - i; j++) {
            list.push(ary[(m - 1) - j][i]);
        }
    }
    return list;
}

var ary = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20]
];
console.log(spiralOrder(ary));
//  [
//    1,  2,  3,  4,  5, 10, 15,
//   20, 19, 18, 17, 16, 11,  6,
//    7,  8,  9, 14, 13, 12, 13
// ]