let r = (head) => {
  let pre = null, cur = head;
  while (cur) {
    let next = head.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

let r1 = (head) => {
  if (head === null || head.next === null) {
    return head;
  }
  let next = head.next;
  let newHead = r1(next);
  next.next = head.next;
  head.next = null;
  return newHead;
}

let c = (arr1, m, arr2, n) => {
  let len1 = m - 1, len2 = n - 1, len = m + n - 1;
  while (len2 > 0) {
    if (len1 < 0) {
      arr1[len--] = arr2[len2--];
      continue;
    }
    arr1[len--] = arr1[len1] > arr2[len2] ? arr1[len1--] : arr2[len2--];
  }
  return arr1;
}

let arr = ['A', "B", "C"];
// 1=>"A 4=>'AA'
let ch = (num) => {
  let m = num / arr.length, n = num % arr.length - 1, s = '';
  for (let i = 0; i < m; i++) {
    s += arr[n < 0 ? arr.length - 1 : n];
  }
  return s;
}

console.log(ch(9), ch(1), ch(4))