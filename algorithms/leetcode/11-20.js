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
}