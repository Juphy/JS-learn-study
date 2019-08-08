let fn = (nums, target) => {
    let map = new Map(),
        len = nums.length;
    for (let i = 0; i < len; i++) {
        let j = map.get(target - nums[i]);
        console.log(j);
        if (j > -1) {
            return [j, i];
        }
        map.set(nums[i], i);
    }
    return [];
}
console.log(fn([2, 7, 11, 15], 9));

function ListNode(val) {
    this.val = val;
    this.next = null;
}

let fo = (l1, l2) => {
    let l = new ListNode(null),
        cur = l,
        carry = 0;
    while (l1, l2) {
        let val1 = l1 ? l1.val : 0,
            val2 = l2 ? l2.val : 0;
        let sum = val1 + val2 + carry;
        carry = parseInt(sum / 10);
        cur.next = new ListNode(sum % 10);
        cur = cur.next;
        l1 && (l1 = l1.next);
        l2 && (l2 = l2.next);
    }
    if (carry) cur.next = new ListNode(carry);
    return l.next;
}

let foo = (s) => {
    let map = new Map(),
        left = -1,
        res = 0;
    for (let i = 0; i < s.length; i++) {
        let j = map.get(s[i]);
        if (j > left) {
            left = j;
        }
        map.set(s[i], i);
        res = Math.max(res, i - left);
    }
}

let f = (s) => {
    let set = new Set(),
        i = 0,
        j = 0,
        res = 0,
        len = s.length;
    while (i < len && j < len) {
        if (set.has(s[j])) {
            set.delete(s[i++]);
        } else {
            set.add(s[j++]);
            res = Math.max(res, j - i);
        }
        console.log(set);
    }
    return res;
}

let longestPalindrome = function(s) {
    let len = s.length;
    if (len < 0) return s;
    let start = 0,
        maxLen = 0;
    for (let i = 0; i < len;) {
        let left = i,
            right = i;
        while (right < len - 1 && s[right] === s[right + 1]) {
            ++right;
        }
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

// console.log(longestPalindrome("cbbd"));

let findMedianSortedArrays = function(nums1, nums2) {}
findMedianSortedArrays([1, 2, 3, 4, 5], [1, 2, 3, 4]);
findMedianSortedArrays([-2, -1], [3]);
findMedianSortedArrays([1, 2], [3, 4]);
findMedianSortedArrays([1, 2, 5, 6], [3, 4]);
findMedianSortedArrays([1, 2], [3, 4, 5, 6, 7]);