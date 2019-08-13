let a = new Array(100000).fill(0);
let t1 = new Date().getTime();
for (let [index, item] of a.entries()) {
    console.log(index, item);
}
let t2 = new Date().getTime();
let entries = a.entries(),
    done = false;
while (!done) {
    let item = entries.next();
    done = item.done;
    if (!done) {
        console.log(item.value[0], item.value[1]);
    }
}
let t3 = new Date().getTime();
console.log('时间比较：', t2 - t1, t3 - t2);
//  数据较多时，基本没有差别