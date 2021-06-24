// 翻转链表
let reverseList = (head) => {
  let pre = null, cur = head;
  while (cur !== null) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

let reverseList1 = (head) => {
  if (head = null || head.next === null) {
    return head;
  }
  let nextHead = reverseList1(head.next);
  head.next.next = head;
  head.next = null;
  return nextHead;
}

// 合并两个有序数组
let combineArr=(arr1, arr2)=>{
  
}