// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3) = 6;
// add(1, 2, 3)(4) = 10;
// add(1)(2)(3)(4)(5) = 15;

function add(...p1) {
  function fn(...p2) {
    return add(...p1, ...p2);
  }
  fn.valueOf = function () {
    return p1.reduce((a, b) => a + b);
  }
  fn.toString = function () {
    return p1.reduce((a, b) => a + b);
  }
  return fn;
}

console.log(add(1)(2)(3))
console.log(add(1, 2, 3)(4).valueOf())
console.log(add(1)(2)(3)(4)(5).valueOf())

function add(...p1) {
  let fn = function (...p2) {
    return add(...p1, ...p2)
  }
  fn.valueOf = function () {
    return p1.reduce((a, b) => a + b);
  };
  return fn;
}

function curry(){
  
}

// 1. 参数复用；2. 提前返回；3. 延迟计算 / 运行。