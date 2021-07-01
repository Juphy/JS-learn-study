let mergeArr = (arr1, arr2) => {
  let m = arr1.length - 1, n = arr2.length - 1, len = m + n + 1;
  while (n > -1) {
    if (m < 0) {
      arr1[len--] = arr2[n--];
      continue;
    }
    arr1[len--] = arr1[m] > arr2[n] ? arr1[m--] : arr2[n--];
  }
  return arr1;
}

// 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]

let mergeSPArr = (arr1, arr2) => {
  let len1 = arr1.length, len2 = arr2.length;
  for (let i = 0; i < len1; i++) {
    if ((i + 1) % 2 === 0) {
      arr1.splice((i + 1) + (len2 - arr2.length), 0, arr2.shift())
    }
  }
  return arr1;
}
console.log(mergeSPArr(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'], ['A', 'B', 'C', 'D']))

// 插入排序
let mergeSPArr1 = (arr1, arr2) => {
  let i = 0, j = 0, arr = [];
  while(i<arr1.length&&j<arr2.length){
    if(arr1[i].charAt(0)===arr2[j].charAt(0)){
      arr.push(arr1[i++])
    }else{
      arr.push(arr2[j++])
    }
  }
  while(i<arr1.length) arr.push(arr1[i++])
  while(j<arr2.length) arr.push(arr2[j++])
  return arr;
}

console.log(mergeSPArr1(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'], ['A', 'B', 'C', 'D']))