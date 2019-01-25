async function fn() {
    return "hello async";
}

function foo() {
    return Promise.resolve('something');
}

async function test() {
    var f1 = await fn(), f2 = await foo();
    // console.log(f1, f2);
}

test();

function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('long_time_value')
        }, 1000);
    })
}

async function t() {
    var a = await takeLongTime();
    // console.log(a);
    // console.log(2);
}

t();

// console.log(1);

async function getStockSymbol(name) {
    return name
}

async function getStockPrice(symbol) {
    return symbol + '1'
}

async function getStockPriceByName(name) {
    const symbol = await getStockSymbol(name);
    const stockPrice = await getStockPrice(symbol);
    return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
    // console.log(result);
});

function dbFuc(db) {
    let docs = [1, 2, 3];
    docs.forEach(async function (doc) {
        await db(doc);
    })
}

let dbFn = (a) => {
    // console.log(a);
};

dbFuc(dbFn);

async function async1() {
    console.log('async1 start');
    async2().then(function () {
        console.log('async1 end');
    })
}

async function async2() {
    console.log('async2');
}

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});

async1();
