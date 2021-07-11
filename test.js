let debounce = function (cb, delay, flag) {
  let timer;
  return function () {
    if (flag && !timer) {
      cb.apply(this, arguments)
    }
    if (timer) clearTimeout(timer);
    timer = SetTimeout(() => {
      cb.apply(this, arguments);
    }, delay)
  }
}

let throttle = function (cb, delay, flag) {
  let timer, callNow = flag;
  return function () {
    if (callNow) {
      cb.apply(this, arguments);
      callNow = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        cb.apply(this, arguments);
        timer = null;
      }, delay)
    }
  }
}