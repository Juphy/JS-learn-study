function gen(w, fn) {
    let arr = [];
    for (let i = 0; i < w * 10000; i++) {
        arr[i] = i + 1;
    }
    arr = fn(arr);
    return arr;
}

function shuffle1(arr) {
    for (let i = 0; i < arr.length; i++) {
        const j = i + Math.floor(Math.random() * (arr.length - i));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function shuffle2(arr) {
    return arr.sort((a, b) => Math.round(Math.random()) * (-1));
}




function measure(fn) {
    return function(n, foo) {
        let time = new Date().getTime();
        let f = fn(n, foo);
        console.log(new Date().getTime() - time);
        return f;
    }
}

const m_gen = measure(gen);
// m_gen(100);
console.log(m_gen(100, shuffle1));
console.log(m_gen(100, shuffle2));