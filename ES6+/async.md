## async
async就是Generator函数的语法糖。
```
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 用async函数改写

const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
async函数就是将Generator函数的星号（*）替换成async，将yield替换成await。
async函数对Generator函数的改进：
- 内置执行器：不需要调用next方法或者co模块，就能执行。
- 更好的语义：async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
- co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数中的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
- 返回值是promise：async函数的返回值是promise对象，如果不是promise会默认转换成promise，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

```
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

### 注意事项：
- await后面的是promise，运行结果可能是rejected，因此最好把await放在try...catch中
```
async function fn(){
    try{
        await f();
    }catch(err){
        console.log(err)
    }
}
/// 或者
async function fn(){
    await f().catch(function(err){
        console.log(err);
    })
}
```
- await后面的异步操作，如果不存在继发关系，最好让他们同时触发。
```
let foo = await getFoo();
let bar = await getBar();
// 上面这种方式比较耗时，只有在getFoo完成之后，才会执行getBar，完全可以让他们同时发生。
// 可以使用下面两种方法：
// 一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 二
let fooPromise = getFoo(), barPromise = getBar();
let foo = await fooPromise, bar = await barPromise;
```
- await只能在async函数中，如果在普通函数中，就会报错。
```
function dbFuc(db){
    let docs=[{},{},{}];
    docs.forEach(async function(doc){
        await db.post(doc);
    })
}

此时，db.post操作是并发执行的，也就是同时执行，而不是继发执行，可能不会正常工作。
async function dbFuc(db){
    let docs = [{},{},{}];
    for(let doc of docs){ // for循环，继发执行
        await db.post(doc);
    }
}
```
如果确实希望多个请求并发执行，可以使用Promise.all,当三个请求都会resolved时，
```
async function dbFuc(db){
    let docs = [{}, {}, {}];
    let promises = doc.map(doc => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}

// 或者
async function dbFuc(db){
    let doc = [{}, {}, {}];
    let promises = docs.map(doc => db.post(doc));

    let results = [];
    for(let promise of promises){
        results.push(await promise);
    }
    console.log(results);
}
```



