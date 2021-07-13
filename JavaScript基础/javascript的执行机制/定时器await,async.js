let fn = function (count) {
    console.log('start', count);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('done', count);
            resolve();
        }, 1000);
    })
}
async function main() {
    console.time();
    let x = await fn(1);
    let y = await fn(2);
    let z = await fn(3);
    console.timeEnd();

    console.time();
    let x1 = fn(4);
    let y1 = fn(5);
    let z1 = fn(6);
    console.timeEnd();
    console.time();
    let x3 = await x1;
    let y3 = await y1;
    let z3 = await z1;
    console.timeEnd();

    console.time();
    let x2 = fn(7);
    let y2 = fn(8);
    let z2 = fn(9);
    console.timeEnd();
    console.time();
    x2;
    y2;
    z2;
    console.timeEnd();

}

main();