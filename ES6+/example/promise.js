let timeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
    })
}
timeout(1000).then((value) => {
    console.log(value);
})

let promise = new Promise((resolve, reject) => {
    console.log('Promise');
    resolve();
})
promise.then(function () {
    console.log('resolved.')
})

console.log("Hi!");

let loadImageAsync = (url) => {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function () {
            resolve(image);
        }
        image.onerror = function () {
            reject(new Error('Could not load image at ' + url))
        }
        image.src = url;
    })
}

let getJSON = (url) => {
    let promise = new Promise((resolve, reject) => {
        var handler = function () {
            if (this.readyStatus !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusText));
            }
        };
        let client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    })
    return promise;
}

getJSON('/posts.json').then(function (json) {
    console.log('Contents:' + json);
}, function (error) {
    console.log('出错了', error);
})

let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000);
})

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p1.then(result => console.log(result))
    .catch(error => console.log(error))

promise = new Promise(function (resolve, reject) {
    throw new Error('test')
    // reject(new Error('test'))
})

promise.catch(function (error) {
    console.log(error);
})

promise = new Promise(function (resolve, reject) {
    resolve('ok');
    throw new Error('test');
})
promise.then(function (value) {
    console.log('xxxxxxxxxxxx', value)
}).catch(error => {
    console.log(error);
})

let someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        resolve(x + 2);
    })
}
someAsyncThing().then(function () {
    console.log('everything is great');
})

setTimeout(() => {
    console.log(123);
}, 2000);

process.on('unhandleRejection', function (err, p) {
    throw err;
})

p = new Promise((resolve, reject) => {
    resolve('ok');
    setTimeout(() => {
        throw new Error('test')
    }, 0);
})
p.then(value => {
    console.log(value);
})