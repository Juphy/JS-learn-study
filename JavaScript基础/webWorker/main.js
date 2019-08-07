const first = document.querySelector('#number1'),
    second = document.querySelector('#number2');

const result = document.querySelector('.result');
if (window.Worker) {
    const myworker = new Worker("./worker.js");
    first.onchange = function(params) {
        myworker.postMessage([first.value, second.value]);
        console.log('Message posted to worker');
    }

    second.onchange = function() {
        myworker.postMessage([first.value, second.value]);
        console.log("Message posted to worker");
    }

    myworker.onmessage = function(e) {
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
        myworker.onmessage = ({ data }) => {
            document.getElementById('result').innerHTML = data;
        }
    }
}

function stopWorker() {
    myworker.terminate();
}