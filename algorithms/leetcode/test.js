let threeSum = function(nums) {
    if (nums.length < 3) return [];
    nums = nums.sort((a, b) => a - b);
    if (nums[0] > 0 || nums[nums.length - 1] < 0) return [];
    let res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;
        if (nums[i] === nums[i - 1]) continue;
        let v = 0 - nums[i],
            l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let _v = nums[l] + nums[r];
            if (v === _v) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++;
                r--;
            }
            if (v > _v) l++;
            if (v < _v) r--;
        };
    }
    return res;
}

let longestCommonPrefix = (strs) => {
    let res = strs[0] || '';
    for (let i = 0; i < res.length; i++) {
        let pre = res[i];
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] !== pre) return res.slice(0, i);
        }
    }
    return res;
}

let threeSumClosest = (nums, target) => {
    let diff = Number.MAX_SAFE_INTEGER;
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] === nums[i - 1]) continue;
        let l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let sum = nums[i] + nums[l] + nums[r];
            let newDiff = Math.abs(sum - target);
            if (newDiff === 0) return sum;
            if (diff > newDiff) diff = newDiff, closest = sum;
            if (sum > target) r--;
            else l++;
        }
    }
    return closest;
}

let letterCombinations1 = (digits) => {
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
    if (digits.length === 1) return dict[digits[0]];
    return digits.split('').reduce((a, k) => {
        if (!a.length) {
            return [...dict[k]];
        } else {
            let ary = [];
            a.forEach(i => {
                dict[k].forEach(j => {
                    ary.push(i + j);
                })
            });
            return ary;
        }
    }, [])
}

let letterCombinations = function(digits) {
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
    let result = [];
    let tmp = [];
    if (digits.length) backTracking(0);

    function backTracking(index) {
        if (index === digits.length) {
            result.push(temp.join(""));
            return;
        }
        dict[digits[index]].forEach(item => {
            temp.push(item);
            backTracking(index + 1);
            temp.pop();
        })
    }
    return result;
}

let fourSum = (nums, target) => {
    let res = [];
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            let l = j + 1;
            r = nums.length - 1;
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

function ListNode(val) {
    this.val = val;
    this.next = null;
}
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

// 20 用栈解决，先进后出。array模拟之
let isValid = (s) => {
    if (s.length % 2 !== 0) return false;
    let dict = {
        "}": "{",
        ")": '(',
        "]": "["
    };
    let stach = [];
    for (let i = 0; i < s.length; i++) {
        if (!dict[s[i]]) {
            stach.push(s[i]);
        } else {
            if (stach.pop() !== dict[s[i]]) {
                return false;
            }
        }
    }
    if (stach.length) {
        return false;
    }
    return true;
}

// 21 混合插入两个有序链表生成一个新的有序链表
let mergeTwoLists = function(l1, l2) {
    let dummy = new ListNode(null),
        cur = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            cur.next = l1;
            l1 = l1.next;
        } else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = l1 ? l1 : l2;
    return dummy.next;
}

// 22、Generate Parentheses 生成括号
let generateParenthesis = (n) => {
    let res = [];
    let helper = (left, right, out) => {
        if (left < 0 || right < 0 || left > right) return;
        if (left === 0 && right === 0) {
            res.push(out);
            return;
        }
        helper(left - 1, right, out + '(');
        helper(left, right - 1, out + ')');
    }
    helper(n, n, '');
    return res;
}

// 23、合并k个有序链表形成一个有序链表
let mergeKLists = (lists) => {
    let n = lists.length;
    while (n > 1) {
        let k = Math.floor((n + 1) / 2);
        for (let i = 0; i < Math.floor(n / 2); i++) {
            lists[i] = mergeTwoLists(lists[i], lists[i + k]);
        }
        n = k;
    }
    return lists[0];
}

// 24、swap nodes inpaors 成对交换节点
// 给定一个链表，两两交换其中相邻的节点，并返回交换后的链表，不能单纯改变节点内部的值，而是需要实际的进行节点交换
// 迭代
let swapPairs = (head) => {
    let dummy = new ListNode(null),
        cur = dummy;
    dummy.next = head;
    while (cur.next && cur.next.next) {
        let t = cur.next.next;
        cur.next.next = t.next;
        t.next = cur.next;
        cur.next = t;
        cur = t.next;
    }
    return dummy.next;
}

// 递归  回溯，递归遍历到链表末尾，然后先交换末尾两个，然后依次往前交换
let swapPairs1 = (head) => {
    if (!head || !head.next) return head;
    let t = head.next;
    head.next = swapPairs1(head.next.next);
    t.next = head;
    return t;
}

// 25、 Reverse Nodes in K-Group 每k个一组翻转链表
// 链表：1->2->3->4->5
// k=2：2->1->3->4->5
// k=3：3->2->1->4->5
// 每k个一组来翻转链表，实际上就是把原链表分成若干个小段，然后对其进行翻转。
let reverseKGroup = (head, k) => {
    if (!head || k === 1) return head;
    let dummy = new ListNode(null),
        pre = dummy,
        cur = head;
    dummy.next = head;
}