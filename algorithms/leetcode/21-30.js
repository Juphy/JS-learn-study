function ListNode(val) {
    this.val = val;
    this.next = null;
}

// 21、Merge Two Sorted Lists 混合插入有序链表
let mergeTwoLists = (l1, l2) => {
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

// 递归
let mergeTwoLists1 = (l1, l2) => {
    if (l1 == null || (l2 !== null && l1.val > l2.val)) {
        let temp = l1;
        l1 = l2;
        l2 = temp;
    }
    if (l1 !== null) l1.next = mergeTwoLists1(l1.next, l2);
    return l1;
}

// 22、generate parentheses 生成括号
let generateParentheses = (n) => {
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

// 23、merge k sorted lists
let mergeKLists = (lists) => {
    let n = lists.length;
    while (n > 1) {
        let k = Math.floor((n + 1) / 2);
        for (let i = 0; i < Math.floor(n / 2); i++) {
            lists[i] = mergeTwoLists(lists[i], lists[i + k]);
        }
        n = k;
    }
    return list[0];
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

// 递归  回溯，递归遍历到链表末尾，然后交换末尾两个，然后依次往前交换
let swapPairs1 = (head) => {
    if (!head || !head.next) return head;
    let t = head.next;
    head.next = swapPairs1(head.next.next);
    t.next = head;
    return t;
}

let swapPairs2 = (head) => {
    let thead = new ListNode(null),
        t = thead;
    thead.next = head;
    while (t.next && t.next.next) {
        let a = t.next,
            b = t.next.next;
        t.next = b;
        a.next = b.next;
        b.next = a;
        t.next = t.next.next;
    }
    return t.next;
}

// 25、k个一组翻转链表
//   list: 1->2->3->4->5
// k=2: 2->1->4->3->5
// k=3: 3->2->1->4->5
let reverseKGroup = (head, k) => {
    if (!head || k === 1) return head;
    let thead = new ListNode(null),
        pre = thead,
        cur = head;
    thead.next = head;
    let reverseGroup = (pre, next) => {
        let last = pre.next,
            cur = last.next;
        while (cur !== next) {
            last.next = cur.next;
            cur.next = pre.next;
            pre.next = cur;
            cur = last.next;
        }
        return last;
    }
    for (let i = 1; cur; i++) {
        if (i % k === 0) {
            pre = reverseGroup(pre, cur.next);
            cur = pre.next;
        } else {
            cur = cur.next;
        }
    }
    return thead.next;
}