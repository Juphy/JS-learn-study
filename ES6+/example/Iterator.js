var it = makeIterator(['a', 'b']);

function makeIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { value: arr[index++], done: false }
      } else {
        return { value: undefined, done: true }
      }
    }
  }
}

console.log(it.next());
console.log(it.next());
console.log(it.next());