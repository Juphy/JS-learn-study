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