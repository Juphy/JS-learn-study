// EventEmitter基本使用
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
    console.log('触发了一个事件');
});

myEmitter.emit('event');
// 定义 MyEmitter 类，该类继承于 EventEmitter 类，接着通过使用 new 关键字创建了 myEmitter 实例，然后使用 on() 方法监听 event 事件，最后利用 emit() 方法触发 event 事件。


// EventEmitter构造函数

function EventEmitter() {
    EventEmitter.init.call(this);
}

EventEmitter.usingDomains = false;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0; // 事件数
EventEmitter.prototype._maxListeners = undefined; // 最大的监听器数

// 在 EventEmitter 构造函数内部，会调用 EventEmitter.init 方法执行初始化操作，EventEmitter.init 的具体实现如下：

EventEmitter.init = function () {
    if (this._events === undefined ||
        this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || undefined;
};

// 在 EventEmitter.init 内部，会根据条件执行初始化操作，比较重要的这行代码 this._events = Object.create(null)，实现过简单发布/订阅模式的小伙伴，估计已经猜到 _events 属性的作用了，这里我们就先不继续讨论，我们先来看一下 on() 方法。


// EventEmitter on() 方法
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
};

// 通过代码我们可以发现 EventEmitter 实例上 addListener 和 on 的实现是一样的，执行时都是调用 events.js 文件内的 _addListener() 函数，它的具体实现如下（代码片段）：


/**
 * 添加事件监听器
 * target：EventEmitter 实例
 * type：事件类型
 * listener：事件监听器
 * prepend：是否添加在前面
 */
function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    // 若监听器不是函数对象，则抛出异常
    if (typeof listener !== 'function') {
        const errors = lazyErrors();
        throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener', 'Function');
    }

    events = target._events;
    // 若target._events对象未定义，则使用Object.create创建一个新的对象
    if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
    } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
            target.emit('newListener', type,
                listener.listener ? listener.listener : listener);

            // Re-assign `events` because a newListener handler could have caused the
            // this._events to be assigned to a new object
            events = target._events;
        }
        existing = events[type]; // 获取type类型保存的对象
    }

    if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        // 优化单个监听器的场景，不需使用额外的数组对象。
        existing = events[type] = listener;
        ++target._eventsCount;
    } else {
        if (typeof existing === 'function') { // 添加type前已有绑定监听器
            // Adding the second element, need to change to array.
            existing = events[type] =
                prepend ? [listener, existing] : [existing, listener];
            // If we've already got an array, just append.
        } else if (prepend) { // 添加到前面
            existing.unshift(listener);
        } else { // 添加到后面
            existing.push(listener);
        }
    }
    return target;
}

