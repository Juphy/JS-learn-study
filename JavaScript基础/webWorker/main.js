const first = document.querySelector('#number1'),
    second = document.querySelector('#number2');

const result = document.querySelector('.result');
if (window.Worker) {
    const myworker = new Worker("./worker.js");
    const shareBuffer = new SharedArrayBuffer(1024);
    first.onchange = function (params) {
        myworker.postMessage([first.value, second.value]);
        console.log('Message posted to worker');
    }

    second.onchange = function () {
        myworker.postMessage([first.value, second.value]);
        console.log("Message posted to worker");
    }

    myworker.onmessage = function (e) {
        result.textContent = e.data;
        console.log("Message received from worker");
    }
} else {
    console.log('Your browser doesn\'t support web workers.')
}

let mywoker;

function startWorker() {
    if (typeof Worker !== 'undefined') {
        myworker = new Worker("./worker.js");
        myworker.onmessage = ({
            data
        }) => {
            document.getElementById('result').innerHTML = data;
        }
    }
}

function stopWorker() {
    myworker.terminate();
}

let mywoker1;

function postSharedBuffer() {
    if (typeof Worker !== 'undefined') {
        myworker1 = new Worker('./worker1.js');
        // 新建1KB共享内存
        // const sharedBuffer = new SharedArrayBuffer(1024);
        // 主线程将共享内存的地址发送出去
        // mywoker1.postMessage(sharedBuffer);
        // 在共享内存上建立视图，供写入数据

        // 分配10万个32位整数占据的内存空间
        const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);
        // 建立32位整数视图
        const ia = new Int32Array(sab); // ia.length === 100000
        // 新建一个质数生成器
        const primes = new PrimeGenerator();
        // 将10万个质数，写入这段内存空间
        for (let i = 0; i < ia.length; i++) {
            ia[i] = primes.next();
        }
        // 向Worker线程发送共享内存
        mywoker1.postMessage(ia);
    }
}