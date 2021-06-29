let reverselist = (head) => {
    let pre = null,
        cur = head;
    while (cur !== null) {
        let next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}

let reverselist1 = (head) => {
    if (head === null || head.next === null) {
        return head;
    }
    let newHead = reverselist1(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}

let f = function (a) {
    if (a > 18) {
        const m = 'a'
    } else {
        const m = "b";
    }
    return m;
}
console.log(f(21));
console.log(m);