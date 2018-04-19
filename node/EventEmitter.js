const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
    console.log('订阅了一个事件');
});

myEmitter.emit('event');