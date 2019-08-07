onmessage = function(e) {
    console.log('Worker: Message received from main script');
    let result = e.data[0] * e.data[1];
    if (isNaN(result)) {
        postMessage('please write two numbers');
    } else {
        let workerResult = 'Result: ' + result;
        console.log('Worker: Posting message back to main script');
        postMessage(workerResult);
    }
}

function timeCount() {
    for (var i = 0; i < 10000000000; i++) {
        if (i % 100000 === 0) {
            postMessage(i)
        }
    }
}

timeCount();