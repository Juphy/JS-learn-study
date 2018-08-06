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

// 多条件排序

var items = [
    {name: "linc", age: 28, num: 12345},
    {name: "linc", age: 28, num: 1234},
    {name: "kiki", age: 20, num: 12345},
    {name: "高峰", age: 26, num: 123},
    {name: "高峰", age: 27, num: 101},
    {name: "高峰", age: 26, num: 111},
    {name: "安迪", age: 29, num: 112},
    {name: "安迪", age: 30, num: 110}
];


// ascending 升序  descending 降序
(function _default() {
    // sort函数返回小于或者等于0的不会调换顺序，如果返回值大于0主动调换顺序。
    items.sort(function (a, b) {
        return SortByProps(a, b, ['name', 'age', 'num'], {name: 'ascending', age: 'descending', num: 'ascending'});
    });
    console.log(items)
})();

function SortByProps(item1, item2, attr, obj) {
    /**
     * @type {Array}
     * attr: Array 按照数组的顺序排序
     * obj: { attr[index]: 'ascending'/ 'descending' } ascending '升序' descending '降序'
     */
    var props = [];
    if (obj) {
        props.push(obj)
    }
    var cps = []; // 存储排序属性比较结果。
    // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
    // 记录下两个排序项按照各个排序属性进行比较得到的结果
    var asc = true; // 记录升序还是降序，升序 true  降序 false
    if (props.length < 1) {
        for (var p of attr) {
            if (item1[p] > item2[p]) {
                cps.push(1);
                break; // 大于时跳出循环。
            } else if (item1[p] === item2[p]) {
                cps.push(0);
            } else {
                cps.push(-1);
                break; // 小于时跳出循环。
            }
        }
    }
    else {
        // for (var i = 0; i < props.length; i++) {
        for (var o of attr) {
            obj[o] ? asc = (obj[o] === "ascending") : asc = true;
            if (item1[o] > item2[o]) {
                cps.push(asc ? 1 : -1);
                break; // 大于时跳出循环。
            } else if (item1[o] === item2[o]) {
                cps.push(0);
            } else {
                cps.push(asc ? -1 : 1);
                break; // 小于时跳出循环。
            }
        }
        // }
    }
    return cps[cps.length - 1]
}
