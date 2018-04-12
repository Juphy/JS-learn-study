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
let nums = [-12, 23, 34, 56, 25, 35, 46];
// 选择排序
for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) {
            [nums[j], nums[i]] = [nums[i], nums[j]];
        }
    }
}
console.log(nums);

// 冒泡排序
nums = [-12, 23, 34, 56, 25, 35, 46];
for (let i = 0; i < nums.length - 1; i++) {
    for (let j = 0; j < nums.length - 1 - i; j++) {
        if (nums[j] > nums[j + 1]) {
            [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
        }
    }
}
console.log(nums);

nums = [-12, 23, 34, 56, 25, 35, 46];
// 双冒泡排序
let len = nums.length - 1;
for (let i = 0; i < len; len--) {
    for (let j = len; j > i; j--) {
        nums[j] < nums[j - 1] && ([nums[j], nums[j - 1]] = [nums[j - 1], nums[j]]);

    }
    i++;
    for (let j = i; j < len; j++) {
        nums[j] > nums[j + 1] && ([nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]);
    }
}
console.log(nums);

nums = [-12, 23, 34, 56, 25, 35, 46];
// 快速排序，归并排序
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

// 插入排序
nums = [-12, 23, 34, 56, 25, 35, 46];
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
nums = [-12, 23, 34, 56, 25, 35, 46];
// 堆排序
// 计数排序
// 基数排序