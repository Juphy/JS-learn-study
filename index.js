// 反转链表
let reverse = (arr) => {
    let pre, cur = arr;
    while (cur) {
        let next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}

let reserve1 = (arr) => {
    if (arr === null && arr.next === null) {
        return arr;
    }
    let newArr = reverse1(arr.next);
    arr.next.next = arr;
    arr.next = null;
    return newArr
}

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

console.log(mergeArr([1, 3, 5, 7], [2, 4, 6, 8]));

async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(function(){
            resolve()
        }, time)
    })
}

(async function(){
    console.log(new Date());
    await sleep(1000);
    console.log(new Date());
})()

