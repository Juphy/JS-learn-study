function debounce(cb, delay, flag) {
  let timer;
  return function () {
    if (flag && !timer) {
      cb.apply(this, arguments)
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, arguments)
    }, delay)
  }
}

function throttle(cb, delay, flag) {
  let timer, callNow = flag;
  return function () {
    if (callNow) {
      cb.apply(this, arguments);
      callnow = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        cb.apply(this, arguments);
        timer = null;
      }, delay)
    }
  }
}

function mergeArr(arr, brr) {
  let len = arr.length - 1, n = brr.length - 1, m = len - n - 1;
  while (n > -1) {
    if (m < 0) {
      arr[len--] = brr[n--];
      continue;
    }
    arr[len--] = arr[m] > brr[n] ? arr[m--] : brr[n--];
  }
  return arr;
}

let arr = [1, 3, 5, 7, 9], brr = [2, 4, 6, 8];
arr.length = 9;
console.log(mergeArr(arr, brr));

function findLongstr(str) {
  if (str === '') return 0;
  let len = 1, res = str[0];
  for (let i = 1; i < str.length; i++) {
    let s = str[i];
    if (!res.includes(s)) {
      res += s;
    } else {
      len = len > res.length ? len : res.length;
      res = s;
    }
  }
  return len;
}

let str = 'aaabcccdefgggi';
console.log(findLongstr(str))

/**
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 * 
 */