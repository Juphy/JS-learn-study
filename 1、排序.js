const list = [1, 2, 3, 4];
let results = [];
list.forEach(i => {
    list.forEach(j => {
        list.forEach(k => {
            if (i !== j && j !== k && k !== i) {
                results.push(i * 100 + j * 10 + k);
            }
        })
    })
});
console.log(results);
let nums = [-12, 23, 34, 56, 25, 35, 46];
for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) {
            [nums[j], nums[i]] = [nums[i], nums[j]];
        }
    }
}
console.log(nums);
nums = [-12, 23, 34, 56, 25, 35, 46];
const quickSort = (ary) => {
    if (ary.length <= 1) {
        return ary
    }
    let mid_value = ary.splice(Math.floor(ary.length / 2), 1)[0];
    let left = [], right = [];
    for (let i = 0; i < ary.length; i++) {
        ary[i] > mid_value ? right.push(ary[i]) : left.push(ary[i]);
    }
    return quickSort(left).concat(mid_value, quickSort(right));
}
console.log(quickSort(nums));
const insertSort = (ary) => {
    let left = ary.splice(0, 1);
    for (let i = 0; i < ary.length; i++) {
        let cur = ary[i];
        for (let j = left.length - 1; j >= 0;) {
            if (cur < left[j]) {
                j--;
                if (j === -1) {
                    left.unshift(cur);
                }
            } else {
                left.splice(j + 1, 0, cur);
                break;
            }
        }
    }
    return left;
}
console.log(insertSort(nums));
