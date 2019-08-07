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
        let midVal1 = (i + k / 2 - 1 < m) ? nums1[parseInt(i + k / 2 - 1)] : -1;
        let midVal2 = (j + k / 2 - 1 < n) ? nums2[parseInt(j + k / 2 - 1)] : -1;
        if (midVal1 < midVal2) {
            return findKth(nums1, parseInt(i + k / 2), nums2, j, parseInt(k - k / 2));
        } else {
            return findKth(nums1, i, nums2, parseInt(j + k / 2), parseInt(k - k / 2));
        }
    }
    return (findKth(nums1, 0, nums2, 0, left) + findKth(nums1, 0, nums2, 0, right)) / 2;
}

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

}