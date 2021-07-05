// 双栈排序 时间复杂度n^2
function stackSort(stk) {
  tmp = [];
  while (stk.length) {
    let peak = stk.pop();
    while (tmp.length && (tmp.slice(-1) > peak)) {
      let t = tmp.pop();
      stk.push(t);
    }
    tmp.push(peak);
  }
  return tmp;
}

console.log(stackSort([4, 5, 15, 7, 9]));

// 冒泡排序: 每次遍历数据将最大的数据找出来，放在后面
function bubbleSort(arr) {
  var len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 选择排序：O(n^2) 每次与后面的比较得出一个最小的放在前面
function selectSort(arr) {
  let len = length, minIndex;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) { // 寻找最小的数
        minIndex = j;               // 将最小数的索引保存
      }
    }
    [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
  }
  return arr;
}

// 插入排序
function insertSort(arr) {
  let preIndex, current;
  for (let i = 1; i < arr.length; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}

// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let mid = arr.splice(Math.floor(arr.length / 2), 1)[0]; // 找到基准数
  var left = [], right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(mid, quickSort(right));
}

function addTwoList(l1, l2) {
  let na = 0;
  const r = [];
  for (let i = 0; i < l1.length; i++) {
    let s = l1[i] + l2[i];
    if (na === 1) {
      s += na;
      na = 0;
    }
    if (s > 9) {
      na = 1;
      r.push(s - 10);
    } else {
      r.push(s);
    }
  }
  if (na === 1) {
    r.push(1);
  }
  return r;
}

console.log(addTwoList([4,5,6,7,8],[1,2,3,5,67,8]))
