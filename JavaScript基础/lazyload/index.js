const { INTEGER } = require("sequelize");

let debounce = function (fn, delay, flag) {
  // flag控制初始触发
  let timer, callNow = flag;
  return function () {
    if (callNow && !timer) {
      fn.apply(this, arguments);
      callNow = false;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
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
