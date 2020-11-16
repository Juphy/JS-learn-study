var parent = Object.assign(Object.prototype, {
  a: {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
  }
})

var child = Object.create(parent, {
  b: {
    value: 2,
    writable: true,
    enumerable: true,
    configurable: true
  },
  c: {
    value: 3,
    writable: true,
    enumerable: false,
    configurable: true
  }
})

// child有两个属性b和c，其中b为可枚举属性，c为不可枚举属性

for (let key in child) {
  console.log(key);
}
// b
// a

for (let key in child) {
  if (child.hasOwnProperty(key)) {
    console.log(key);
  }
}
// b

console.log(Object.getOwnPropertyNames(child));

// [b,c]