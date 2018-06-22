// 观察者模式
// 监听者
class Observer {
    constructor(index) {
        this.index = index;
    }

    say() {
        console.log(`我是第${this.index}个用户`);
    }

    update() {
        console.log(`observer: 我开始了`);
        this.say();
    }
}

// 被监听者
class Observable {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserverByIndex(index) {
        this.observers.splice(index, 1);
    }

    notify() {
        console.log('observable：开始通知所有监听者');
        this.observers.forEach(x => x.update());
    }
}

const observer1 = new Observer(1);
const observer2 = new Observer(2);
const observable = new Observable();
observable.addObserver(observer1);
observable.addObserver(observer2);
observable.notify();

// 迭代器模式

let getIterator = (array) => {
    let index = 0;
    return {
        next: () => {
            return index < array.length ? {value: array[index++], done: false} : {done: true}
        }
    };
};

let iterator = getIterator([1, 2, 3]);
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
