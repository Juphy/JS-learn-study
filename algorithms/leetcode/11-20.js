// 11、Container with Most water 装最多水的容器
let maxArea = function(height) {
    let res = 0;
    for (let i = 0; i < height.length; i++) {
        for (let j = i + 1; j < height.length; j++) {
            res = Math.max(res, Math.min(height[i], height[j]) * (j - i));
        }
    }
    return res;
}

let maxArea1 = function(height) {
    let res = 0,
        left = 0,
        right = height.length - 1;
    while (right > left) {
        let h = Math.min(height[left], height[right]);
        res = Math.max(res, h * (right - left));
        while (left < right && h === height[left]) left++;
        while (left < right && h === height[right]) right--;
    }
    return res;
}

// 12、Integer to Roman 整数转为罗马数字
// 限定数字范围（1-3999）
// 每一位上的数字分为四类：1-3、4、5-8、9
let intToRoman = function(num) {
    if (x < 1 || x > 3999) return '';
    let res = '',
        roman = ['M', 'D', 'C', 'L', 'X', 'V', 'I'],
        value = [1000, 500, 100, 50, 10, 5, 1];
    for (let n = 0; n < 7; n += 2) {
        let x = parseInt(num / value[n]);
        if (x < 4) {
            for (let i = 1; i <= x; i++) res += roman[n];
        } else if (x === 4) {
            res += (roman[n] + roman[n - 1]);
        } else if (x > 4 && x < 9) {
            res += roman[n - 1];
            for (let i = 6; i <= x; i++) res += roman[n];
        } else if (x === 9) {
            res += (roman[n] + roman[n - 2]);
        }
        num = num % (value[n]);
    }
    return res;
}

let intToRoman2 = function(num) {
    let res = '',
        val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        str = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    for (let i = 0; i < val.length; i++) {
        while (num >= val[i]) {
            num -= val[i];
            res += str[i];
        }
    }
    return res;
}

let intToRoman3 = function(num) {
    let res = '';
    const dict = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    for (let key in dict) {
        while (num >= dict[key]) {
            num -= dict[key];
            res += key;
        }
    }
    return res;
}

let intToRoman1 = function(num) {
    let map = new Map([
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ]);
    for (let [key, value] of map.entries()) {
        while (num >= key) {
            num -= key;
            res += value;
        }
    }
    return res;
}

// 13、Roman to Integer 罗马数字转化成整数
let romanToInt = function(s) {
    const dict = {
        M: 1000,
        D: 500,
        C: 100,
        L: 50,
        X: 10,
        V: 5,
        I: 1
    };
    let res = 0;
    for (let i = 0; i < s.length;) {
        let val1 = dict[s[i]],
            val2 = dict[s[i + 1]] || 0;
        if (val1 < val2) {
            res += (val2 - val1);
            i += 2;
        } else {
            res += val1;
            i++;
        };
    }
    return res;

    // 每次跟前面的数字相比较，如果小于前面的数字，先加上当前的数字，比如“VI”,第二个字母"I"小于第一个字母"V"，所以要加1，如果大于前面的数字，我们要加上当前的数字减去二倍前面的数字，这样可以把在上一个循环多加数减掉。比如'IX'，在i=0时，加上了第一个字母'I'的值，此时的结果为1。当i=1时，'x'大于'I'，这说明前面的1是要减去的，由于前一步没有减，还多加了一个1，所以要减去2倍的1，就是减2.
    for (let i = 0; i < s.length; i++) {
        if (i === 0 || dict[s[i]] <= dict[s[i - 1]]) res += dict[s[i]];
        else res += dict[s[i]] - 2 * dict[s[i - 1]];
    }
    return res;
}

// 14、Longest Common Prefix 最长共同前缀
let longestCommonPrefix = function(strs) {
    let res = '',
        len = Math.min(...strs.map(item => item.length));
    for (let i = 0; i < len; i++) {
        let _res = strs[0][i];
        if (strs.map(item => item[i]).every(e => e === _res)) res += _res;
        else {
            return res;
        }
    }
    return res;
}

let longestCommonPrefix1 = function(strs) {
    if (!strs.length) return "";
    let res = '';
    for (let i = 0; i < strs[0].length; i++) {
        let _res = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (i > strs[j].length - 1 || strs[j][i] !== _res) {
                return res;
            }
        }
        res += _res;
    }
    return res;
}

let longestCommonPrefix2 = function(strs) {
    if (!strs.length) return '';
    if (strs.length === 1) return strs[0];
    strs = strs.sort();
    let start = strs[0],
        end = strs[strs.length - 1],
        i = 0;
    while (i < start.length && start[i] === end[i]) {
        i++;
    }
    return start.slice(0, i);
}

let longestCommonPrefix3 = function(strs) {
    let res = strs[0] || '';
    for (let i = 0; i < res.length; i++) {
        let pre = res[i];
        for (let j = 1; j < strs.length; j++) {
            if (pre !== strs[j][i]) return res.slice(0, i);
        }
    }
    return res;
}

// 15、3Sum
let threeSum = function(nums) {
    if (nums.length < 3) return [];
    nums = nums.sort((a, b) => a - b); // 对原数组进行排序，从小到大
    if (nums[0] > 0 || nums[nums.length - 1] < 0) return [];
    let res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break; // 只比较<=0的数据
        if (nums[i] === nums[i - 1]) continue; // 如果和前一个值相同，就跳过
        let v = 0 - nums[i],
            l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let _v = nums[l] + nums[r];
            if (v === _v) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++; // 值相同光标就进行移动
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++;
                r--;
            };
            // 不同的结果，移动不同的光标
            if (v > _v) l++;
            if (v < _v) r--;
        }
    }
    return res;
}

// 16、3sum cloest
let threeSumClosest = (nums, target) => {
    let diff = Number.MAX_SAFE_INTEGER,
        cloest;
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] === nums[i - 1]) continue;
        let l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let sum = nums[i] + nums[l] + nums[r];
            let newDiff = Math.abs(sum - target);
            if (newDiff === 0) return sum;
            if (diff > newDiff) diff = newDiff, closet = sum;
            if (sum > target) r--;
            else l++;
        }
    }
    return cloest;
}


// 17、Letter Combination of a Phone Number
let letterCombinations = (digits) => {
    if (!digits) return [];
    let dict = {
        2: ['a', 'b', 'c'],
        3: ['d', 'e', 'f'],
        4: ['g', 'h', 'i'],
        5: ['j', 'k', 'l'],
        6: ['m', 'n', 'o'],
        7: ['p', 'q', 'r', 's'],
        8: ['t', 'u', 'v'],
        9: ['w', 'x', 'y', 'z']
    };
    return digits.split('').reduce((a, k) => {
        if (!a.length) return [...dict[k]];
        else {
            let ary = [];
            a.forEach(i => {
                dict[k].forEach(j => {
                    ary.push(i + j);
                })
            })
            return ary;
        }
    }, [])
}

// 递归 (有问题)
let letterCombinations1 = (digits) => {
    let dict = {
        2: ['a', 'b', 'c'],
        3: ['d', 'e', 'f'],
        4: ['g', 'h', 'i'],
        5: ['j', 'k', 'l'],
        6: ['m', 'n', 'o'],
        7: ['p', 'q', 'r', 's'],
        8: ['t', 'u', 'v'],
        9: ['w', 'x', 'y', 'z']
    };
    if (digits.length === 1) return dict[digits[0]];
    let start = dict[digits[0]];
    let subs = letterCombinations1(digits.slice(1));
    let res = [];
    start.forEach(i => {
        subs.forEach(j => {
            res.push(i + j);
        })
    })
    return res;
}

// 18、fourSum 
let fourSum = (nums, target) => {
    let res = [];
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            let l = j + 1,
                r = nums.length - 1;
            while (l < r) {
                let sum = nums[i] + nums[j] + nums[l] + nums[r];
                if (sum === target) {
                    res.push(nums[i], nums[j], nums[l], nums[r]);
                    while (l < r && nums[l] === nums[l + 1]) l++;
                    while (l < r && nums[r] === nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < targer) l++;
                else r--;
            }
        }
    }
}

let fourSum1 = (nums, target) => {
    let res = [],
        n = nums.length;
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
        if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) continue;
        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break;
            if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) continue;
            let l = j + 1;
            r = n - 1;
            while (l < r) {
                let sum = nums[i] + nums[j] + nums[l] + nums[r];
                if (sum === target) {
                    res.push([nums[i], nums[j], nums[l], nums[r]]);
                    while (l < r && nums[l] === nums[l + 1]) l++;
                    while (l < r && nums[r] === nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < target) l++;
                else r--;
            }
        }
    }
    return res;
}

// 19、remove Nth Node From End of List 移除链表倒数第N个节点
// 相当于移除第 len - n +1 节点的
let removeNthFromEnd = (head, n) => {
    let dummy = new ListNode(null);
    dummy.next = head;
    let len = 0;
    let first = head;
    while (first !== null) {
        len++;
        first = first.next;
    }
    len -= n;
    first = dummy;
    while (len > 0) {
        len--;
        first = first.next;
    }
    first.next = first.next.next;
    return dummy.next;
}

// 两个指针，前后相差n
let removeNthFromEnd1 = (head, n) => {
    let dummy = new ListNode(null);
    dummy.next = head;
    let first = dummy,
        second = dummy;
    // first先行n步    
    for (let i = 1; i <= n; i++) {
        first = first.next;
    }
    // first move to end
    while (first.next) {
        first = first.next;
        second = second.next;
    }
    second.next = second.next.next;
    return dummy.next;
}

// 20 Valid Parenthese 验证括号
//  用栈解决，先进后出，array模拟之
let isValid = (s) => {
    if (s.length % 2 !== 0) return false;
    let dict = {
        "}": "{",
        ")": "(",
        "]": "["
    };
    let stach = [];
    for (let i = 0; i < s.length; i++) {
        if (dict[s[i]]) {
            if (statch.pop() !== dict[s[i]]) {
                return false;
            }
        } else {
            stach.push(s[i]);
        }
    }
    if (statch.length) {
        return false;
    }
    return true;
}