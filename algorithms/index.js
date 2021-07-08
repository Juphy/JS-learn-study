// 合并两个有序数组
function merge(num1, num2) {
  let len1 = num1.length - 1, len2 = num2.length - 1,
    len = len1 + len2 + 1;
  while (len2 > -1) {
    if (len1 < 0) {
      num1[len--] = num2[len2--];
    } else {
      num1[len--] = num1[len1] > num2[len2] ? num1[len1--] : num2[len2--];
    }
  }
  return num1;
}

console.log(merge([1, 3, 5, 7, 9], [2, 4, 6, 8]));

// 数组扁平化
/**
 * 
 *不传参数
 *<=0
 *infinity
 */
function flat(arr, depth) {
  return depth > 0 ? arr.reduce((a, b) => {
    if (Array.isArray(b)) {
      return a.concat(flat(b, depth - 1))
    }
    return [...a, b];
  }, []) : arr;
}
console.log(flat([1, [2, 3, [4, 5, 6, [7, 8]]]], 8))

function flatDeep(arr) {
  let result = [], stack = [...arr];
  while (stack.length) {
    let val = stack.pop();
    if (Array.isArray(val)) {
      stack.push(...val)
    } else {
      result.unshift(val)
    }
  }
  return result;
}
console.log(flatDeep([1, [2, 3, [4, 5, 6, [7, 8]]]]))
// 去重
// [...new Set([])]
function unique(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) < 0) res.push(arr[i]);
  }
  return res;
}

function unique(arr) {
  return arr.filter((item, index, array) => {
    return array.indexOf(item) === index;
  })
}

function unique(arr) {
  return arr.sort().reduce((a, b) => {
    if (a.length === 0 || a[a.length - 1] !== b) {
      a.push(b)
    }
    return a;
  }, [])
}

// 排序

// 两数之和
function twoSum(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let k = target - nums[i];
    if (map.has(k)) {
      return [map.get(k), i]
    }
    map.set(nums[i], i)
  }
  return [];
}

// 三数之和


// 计算数组的交集 结果唯一
function insertsection(nums1, nums2) {
  return [...new Set(nums1.filter(a => nums2.includes(a)))]
}

// 计算多个数组的交集
function minsertsection(...rest) {
  if (rest.length === 0) {
    return []
  }
  if (rest.length === 1) {
    return rest[0];
  }
  return [...new Set(rest.reduce((a, b) => {
    return a.filter(i => b.includes(i))
  }))]
}
console.log(minsertsection([1, 2, 3, 4, 4], [4, 5, 6, 2, 3], [1, 4, 5, 6, 2]));

// 反转链表
function reverseList(head) {
  let pre = null, cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

function reverseList(head) {
  if (head === null || head.next === null) {
    return head;
  }
  let newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// 判断一个单链表是否有环
function hasCycle(head) {
  while (head) {
    if (head.flag) return true;
    head.flag = true;
    head = head.next;
  }
  return false;
}

// 链表的中间节点
function middleNode(head) {
  let slow = head, fast = head;
  while (slow && fast.next) { // 判断
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// 删除链表倒数第n个节点
// 1->2->3->4->5->6=>7=>8=>9 n=2  1-2-3-5
// 单独处理第n个节点
function removeNthFormEnd(head, n) {
  let fast = head, slow = head;
  while (--n) {
    fast = fast.next;
  }
  if (!fast.next) return head.next;
  fast = fast.next; // 多走n+1
  // fast slow 一起前进
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
}

// 寻找数组中重复最多的数及其次数
function numss(arr) {
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    let num = arr[i]
    if (obj[num]) {
      obj[num]++
    } else {
      obj[num] = 1;
    }
  }
  let max = 0, res;
  for (let key in obj) {
    if (obj[key] > max) {
      max = obj[key];
      res = Number(key);
    }
  }
  return [res, max];
}