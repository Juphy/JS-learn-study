// function ListNode(val, head) {
//   this.val = (val === undefined ? 0 : val);
//   this.next = (head === undefined ? null : head);
// }

function merge(num1, num2) {
  let len1 = num1.length - 1,
    len2 = num2.length - 1,
    len = len1 + len2 + 1;
  while (len2 >= 0) {
    if (len1 < 0) {
      num1[len--] = num2[len2--];
      continue;
    }
    num1[len--] = num1[len1] > num2[len2] ? num1[len1--] : num2[len2--];
  }
  return num1;
}

console.log(merge([1, 3, 5, 7, 9], [2, 4, 6, 8]));

// flatMap 先map在flat
function flat(arr, depth) {
  return depth > 0 ? arr.reduce((a, b) => {
    if (Array.isArray(b)) {
      return a.concat(flat(b, depth - 1))
    } else {
      return [...a, b];
    }
  }, []) : arr
}

console.log(flat([1, [2, [3, [4, [5]]]]], 2));

function flatAll(arr) {
  let res = [];
  while (arr.length) {
    let a = arr.pop();
    if (Array.isArray(a)) {
      arr.push(...a)
    } else {
      res.unshift(a)
    }
  }
  return res;
}

console.log(flatAll([1, [2, [3, [4, [5]]]]]));

function unique1(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  })
}

console.log(unique1([1, 2, 3, 4, 5, 5, 4, 3, 2, 6, 1, 2]));

function unique2(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) < 0) res.push(arr[i])
  }
  return res;
}

console.log(unique2([1, 2, 3, 4, 5, 5, 4, 3, 2, 6, 1, 2]));

// 两数之和
function twoSum(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i],
      k = target - num;
    if (map.has(k)) {
      return [map.get(k), i]
    } else {
      map.set(num, i)
    }
  }
  return [];
}
console.log(twoSum([1, 2, 3, 4, 5, 6, 7, 8], 15))

// 数组交集
function insertsection(nums1, nums2) {
  return [...new Set(nums1.filter(i => nums2.includes(i)))];
}

// 计算多个数组交集
function minsertsection(...rest) {
  if (rest.length === 0) return [];
  if (rest.length === 1) return rest[0];
  return [...new Set(rest.reduce((a, b) => {
    return a.filter(i => b.includes(i))
  }))]
}
console.log(minsertsection([1, 2, 3, 4, 4], [4, 5, 6, 2, 3], [1, 4, 5, 6, 2]));

// 反转链表
function reverseList(head) {
  let prev = null,
    cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = prev;
    pre = cur;
    cur = next;
  }
  return prev;
}

function reverseList1(head) {
  if (head === null || head.next === null) {
    return head;
  }
  let newHead = reverseList1(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// 判断一个链表是否有环
function hasCycle(head) {
  while (head) {
    if (head.flag) return true;
    head.flag = true;
    head = head.next;
  }
  return false;
}

// 链表的中间节点
function midNode(head) {
  let slow = head,
    fast = head;
  while (fast && fast.head) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// 删除链表倒数第n个节点
function removeNthFromEnd(head, n) {
  let dummy = new ListNode(null, head);
  let fast = dummy,
    slow = dummy;
  while (fast.next) {
    n--;
    fast = fast.next;
    if (n < 0) {
      slow = slow.next;
    }
  }
  slow.next = slow.next.next;
  return dummy.next;
}

// Array.prototype.reduce = function (cb, initValue) {
//   if (initValue === undefined && !this.length) {
//     throw new Error('Reduce empty Array with no initial value')
//   }
//   let result = initValue === undefined ? this[0] : initValue;
//   for (let i = initValue === undefined ? 1 : 0; i < this.length; i++) {
//     result = cb(result, this[i], i, this)
//   }
//   return result;
// }

function add(...a) {
  let fn = function (...b) {
    let args = a.concat(b);
    return add(args)
  }
  fn.valueOf = a.reduce((a, b) => a + b);
  return fn();
}

console.log(add(1,2)(3)(4)());