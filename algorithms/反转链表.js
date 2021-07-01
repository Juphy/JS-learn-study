// 全反转
let reverse = (head) => {
  let pre, cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

let reserve1 = (head) => {
  if (head === null || head.next === null) {
    return head;
  }
  let newHead = reserve1(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// 反转m->n的链表