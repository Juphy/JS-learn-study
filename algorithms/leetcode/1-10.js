// 1、two sum 两数之和
let twosum = function(nums, target) {
    let len = nums.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}

let twosum1 = function(nums, target) {
    let m = new Map(),
        len = nums.length;
    for (let i = 0; i < len; i++) {
        m.set(nums[i], i);
    }
    for (let i = 0; i < len; i++) {
        let t = target - nums[i];
        if (m.has(t) && m.get(t) !== i) {
            return [i, m.get(t)];
        }
    }
    return [];
}

let twosum2 = function(nums, target) {
    let m = new Map(),
        len = nums.length;
    for (let i = 0; i < len; i++) {
        if (m.has(target - nums[i])) {
            return [i, m.get(target - nums[i])]
        }
        m.set(nums[i], i);
    }
    return [];
}

// 2 add two numbers 两个数字相加
function ListNode(val) {
    this.val = val;
    this.next = null;
}

let addTwoNumbers = function(l1, l2) {
    let dummy = new ListNode(null),
        cur = dummy; // 由于dummy结点本身不能变，所以用一个cur指针来指向新链表的最后一个结点
    let carry = 0;
    while (l1 || l2) {
        let val1 = l1 ? l1['val'] : 0,
            val2 = l2 ? l2['val'] : 0;
        let sum = val1 + val2 + carry;
        carry = parseInt(sum / 10);
        cur['next'] = new ListNode(sum % 10);
        cur = cur['next'];
        if (l1) l1 = l1['next'];
        if (l2) l2 = l2['next'];
    }
    if (carry) cur['next'] = new ListNode(carry);
    return dummy['next'];
}

// 3、最长无重复的字符串
// Time Limit Exceeded
let lengthOfLongestSubstring = function(s) {
    let allUnique = function(str, start, end) {
        let s = new Set();
        for (let i = start; i < end; i++) {
            if (s.has(str[i])) return false;
            s.add(str[i]);
        }
        return true;
    }

    let len = s.length,
        ans = 0;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j <= len; j++) {
            if (allUnique(s, i, j)) ans = Math.max(ans, j - i);
        }
    }
    return ans;
}

let lengthOfLongestSubstring1 = function(s) {
    let res = 0,
        left = -1,
        m = new Map();
    for (let i = 0; i < s.length; i++) {
        let j = m.get(s[i]);
        if (j > left) {
            left = j;
        }
        m.set(s[i], i);
        res = Math.max(res, i - left);
    }
    return res;
}

let lengthOfLongestSubstring2 = function(s) {
    let len = s.length,
        set = new Set(),
        res = 0,
        i = 0,
        j = 0;
    while (i < len && j < len) {
        if (!set.has(s[j])) {
            set.add(s[j++]);
            res = Math.max(res, j - i);
        } else { // 如果有某一值，会一直删除，直至没有重复
            set.delete(s[i++]);
        }
    }
    return res;
}

let lengthOfLongestSubstring3 = function(s) {
    let len = s.length,
        res = 0,
        map = new Map();
    for (let i = -1, j = 0; j < len; j++) {
        let k = map.get(s[j]);
        if (k > i) {
            i = k;
        }
        map.set(s[j], j);
        res = Math.max(res, j - i)
    }
    return res;
}

// 4、两个有序数组的中位数
let findMedianSortedArrays = function(nums1, nums2) {
    let m = nums1.length,
        n = nums2.length,
        left = parseInt((m + n + 1) / 2),
        right = parseInt((m + n + 2) / 2);
    let findKth = function(nums1, i, nums2, j, k) {
        if (i >= m) return nums2[j + k - 1];
        if (j >= n) return nums1[i + k - 1];
        if (k === 1) return Math.min(nums1[i], nums2[j]);
        let midVal1 = (i + k / 2 - 1 < m) ? nums1[parseInt(i + k / 2 - 1)] : Infinity;
        let midVal2 = (j + k / 2 - 1 < n) ? nums2[parseInt(j + k / 2 - 1)] : Infinity;
        if (midVal1 < midVal2) {
            return findKth(nums1, parseInt(i + k / 2), nums2, j, parseInt(k - k / 2));
        } else {
            return findKth(nums1, i, nums2, parseInt(j + k / 2), parseInt(k - k / 2));
        }
    }
    return (findKth(nums1, 0, nums2, 0, left) + findKth(nums1, 0, nums2, 0, right)) / 2;
}

let findMedianSortedArrays1 = function(nums1, nums2) {
    let nums = nums1.concat(nums2);
    nums.sort((a, b) => a - b);
    let len = nums.length;
    return len % 2 === 0 ? (nums[len / 2] + nums[len / 2 - 1]) / 2 : nums[len / 2 - 0.5];
}

let findMedianSortedArrays2 = function(nums1, nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays2(nums2, nums1);
    let x = nums1.length,
        y = nums2.length;
    let low = 0,
        high = x
    while (low <= high) {
        const partitionX = (high + low) >> 1
        const partitionY = ((x + y + 1) >> 1) - partitionX

        const maxX = partitionX == 0 ? Number.NEGATIVE_INFINITY : nums1[partitionX - 1]
        const maxY = partitionY == 0 ? Number.NEGATIVE_INFINITY : nums2[partitionY - 1]

        const minX = partitionX == nums1.length ? Number.POSITIVE_INFINITY : nums1[partitionX]
        const minY = partitionY == nums2.length ? Number.POSITIVE_INFINITY : nums2[partitionY]

        if (maxX <= minY && maxY <= minX) {
            const lowMax = Math.max(maxX, maxY)
            if ((x + y) % 2 == 1)
                return lowMax
            return (lowMax + Math.min(minX, minY)) / 2
        } else if (maxX < minY) {
            low = partitionX + 1
        } else
            high = partitionX - 1
    }
}

let findMedianSortedArrays3 = function(nums1, nums2) {
    let m = nums1.length,
        n = nums2.length;
    let i = 0,
        j = 0;
    while (i + j < (m + n) / 2) {
        if (nums1[i] < nums2[j]) {
            i++;
        }
        if (nums1[i] > nums2[j]) {
            j++;
        }
        if (nums1[i] === nums2[j]) {
            i++;
            j++;
        }
    }
}

findMedianSortedArrays3([1, 2, 3, 4, 5], [1, 2, 3, 4]);

// 5、最长回文子串
// 以字符为中心，向两边扩散来寻找回文串，这个算法的时间复杂度是O(n*n)。由于回文串的长度可奇可偶，因此两种形式都需要搜索。对于奇数，从遍历到的位置为中心向两边进行扩散，对于偶数，就以当前位置以及下一个位置当做偶数行回文进行遍历。
let longestPalindrome = function(s) {
    let len = s.length;
    if (len < 2) return s;
    let start = 0,
        maxLen = 0;
    let fn = (s, i, j) => {
        while (i >= 0 && j < len && s[i] === s[j]) {
            --i;
            ++j;
        }
        if (maxLen < j - i - 1) {
            start = i + 1;
            maxLen = j - i - 1;
        }
    }
    for (let i = 0; i < len - 1; i++) {
        fn(s, i, i); // 奇数
        fn(s, i, i + 1); // 偶数
    }
    return s.substr(start, maxLen);
}

// 定义起点start跟长度maxLen，遍历字符串，如果剩余字符串长度小于maxLen，就break;否则就向右遍历寻找重复项，然后向两边扩散更新start和maxLen
let longestPalindrome1 = function(s) {
    let len = s.length;
    if (len < 2) return s;
    let start = 0,
        maxLen = 0;
    for (let i = 0; i < len;) {
        if (len - i <= maxLen / 2) break;
        let left = i,
            right = i;
        while (right < len - 1 && s[left] === s[right + 1]) ++right;
        i = right + 1;
        while (left > 0 && right < len - 1 && s[left - 1] === s[right + 1]) {
            --left;
            ++right;
        }
        if (maxLen < right - left + 1) {
            start = left;
            maxLen = right - left + 1;
        }
    }
    return s.substr(start, maxLen);
}

// 借助二维数组
let longestPalindrome2 = function(s) {
    let len = s.length;
    if (len < 1) return s;
    let dp = new Array(len),
        left = 0,
        maxLen = 1;
    for (let i = 0; i < len; i++) {
        dp[i] = new Array(len);
    }
    for (let i = 0; i < len; i++) {
        dp[i][i] = 1;
        for (let j = 0; j < i; j++) {
            dp[j][i] = (s[i] === s[j] && (i - j < 2 || dp[j + 1][i - 1]));
            if (dp[j][i] && maxLen < i - j + 1) {
                maxLen = i - j + 1;
                left = j;
            }
        }
    }
    return s.substr(left, maxLen);
}

// 马拉车算法 Manacher's Algorithm 
let longestPalindrome3 = function(s) {
    let t = "$#";
    for (let i = 0; i < s.length; i++) {
        t += s[i];
        t += '#';
    }
    let p = new Array(t.length);
    let mx = 0,
        id = 0,
        resLen = 0,
        resCenter = 0;
    for (let i = 1; i < t.length; i++) {
        p[i] = mx > i ? Math.min(p[2 * id - i], mx - i) : 1;
        while (t[i + p[i]] === t[i - p[i]]) ++p[i];
        if (mx < i + p[i]) {
            mx = i + p[i];
            id = i;
        }
        if (resLen < p[i]) {
            resLen = p[i];
            resCenter = i;
        }
    }
    return s.substr((resCenter - resLen) / 2, resLen - 1);
}

// 6、ZigZag Conversion 之字型转换字符串
// 0    6        12
// 1  57    1113
// 24  810    1416
// 3    9        15

let convert = function(s, numRows) {
    if (!s || s.length < 2 || numRows < 2) return s;
    let size = 2 * numRows - 2,
        res = '';
    for (let i = 0; i < numRows; i++) { // 行
        for (let j = i; j < s.length; j += size) { // 列
            res += s[j]; // 取2*numRows列
            if (i !== 0 && i !== numRows - 1) { // 除去第一行和最后一行
                let k = j + size - 2 * i;
                if (k < s.length) {
                    res += s[k];
                }
                ``
            }
        }
    }
    return res;
}

// 7、Reverse Integer 翻转整数（给定32位符号整数）
// [-2^31, 2^31-1]
let reverse = function(x) {
    x = Math.sign(x) * parseInt(Math.abs(x).toString().split('').reverse().join(''));
    return x >= Math.pow(-2, 31) && x <= (Math.pow(2, 31) - 1) ? x : 0;
}

let reverse1 = function(x) {
    let res = 0;
    while (x !== 0) {
        if (Math.abs(res) > Infinity / 10) return 0;
        res = res * 10 + x % 10;
        x = parseInt(x / 10);
    }
    return res;
}

// 8、String into Integer 字符串转为整数
// - 只有空格字符' ' 被视为空白字符
// - 整数范围[-2^31, 2^31-1]，如果超出表示的数值范围，返回2^31-1或者2^31
// "4193 with words"==> 4193    "word and 987" ===> 0
let myAtoi = function(str) {
    return Math.max(Math.min(parseInt(str) || 0, Math.pow(2, 31) - 1), Math.pow(-2, 31))
}

let myAtoi1 = function(str) {
    let sign = 1,
        flag = true,
        res = 0,
        i = 0;
    while (i < str.length && flag) {
        if (str[i] === '-' && sign === 1) sign = -1;
        if (!isNaN(str[i])) {
            if (str[i] !== ' ') res = res * 10 + (str[i] - '0')
        } else {
            if (!(sign === -1 && str[i] === '-')) flag = false;
        }
        i++;
    }
    return res * sign;
}

// 9、Palindrome Number 验证回文数字
// 首尾验证，在去除首尾循环验证
let isPalindrome = function(x) {
    if (x < 0) return false;
    let size = 1;
    while (x / size >= 10) size *= 10;
    while (x > 0) {
        let left = parseInt(x / size),
            right = x % 10;
        if (left !== right) return false;
        x = parseInt(x % size / 10);
        size /= 100;
    }
    return true;
}

// 反向取数比较
let isPalindrome1 = function(x) {
    if (x < 0) return false;
    let num = 0,
        y = x;
    while (y > 0) {
        num = num * 10 + y % 10;
        y = Math.floor(y / 10);
    }
    return x === num;
}

let isPalindrome2 = function(x) {
    if (x < 0) return false;
    let num = 0;
    while (x > num) {
        num = num * 10 + x % 10;
        x = parseInt(x / 10);
    }

}