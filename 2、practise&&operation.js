// 队列，先进先出，最新添加的元素在队列的末尾
function Queue() {
    let items = []; // 模拟队列
    this.enqueue = (item) => {
        items.push(item);
    }
    this.dequeue = () => {
        return items.shift();
    }
    this.front = () => {
        return items[0];
    }
    this.isEmpty = () => {
        return items.length === 0;
    }
    this.size = () => {
        return items.length;
    }
    this.print = () => {
        console.log(items.toString());
    }
}

// es6编写queue，用weakMap来保存私有属性items

let Queue2 = (function () {
    const items = new WeakMap();

    class Queue2 {
        constructor() {
            items.set(this, []);
        }

        enqueue(item) {
            items.get(this).push(item);
        }

        dequeue() {
            return items.get(this).shift();
        }

        front() {
            return items.get(this)[0];
        }

        isEmpty() {
            return items.get(this).length === 0;
        }

        size() {
            return items.get(this).length;
        }

        print() {
            console.log(utems.get(this).toString());
        }
    }

    return Queue2;
})();

// 优先级队列
function PriorityQueue() {
    let items = [];

    // 新建一个特殊的元素，记录要添加到队列的元素和其在队列中的优先级
    function QueueElement(element, priority) {
        this.element = element;
        this.priority = priority;
    }

    this.enqueue = (element, priority) => {
        let queueElement = new QueueElement(element, priority);
        let added = false;
        for (let i = 0; i < items.length; i++) {
            if (queueElement.priority < items[i].priority) {
                items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) {
            items.push(queueElement);
        }
    };
    this.print = () => {
        for (let i = 0; i < items.length; i++) {
            console.log(`${items[i].element} - ${items[i].priority}`)
        }
    };
    this.dequeue = () => {
        return items.shift();
    };
    this.front = () => {
        return items[0];
    };
    this.isEmpty = () => {
        return items.length === 0;
    };
    this.size = () => {
        return items.length;
    };
}

let priorityQueue = new PriorityQueue();
priorityQueue.enqueue('John', 2);
priorityQueue.enqueue('Jack', 3);
priorityQueue.enqueue('Jim', 1);
priorityQueue.enqueue('Jerry', 1);
priorityQueue.print();

// 循环队列--Hot Potato
function hotPotato(nameList, num) {
    let queue = new Queue();
    for (let i = 0; i < nameList.length; i++) {
        queue.enqueue(nameList[i]); // 删除队列的头添加到队列的末尾
    }
    let eliminated = '';
    while (queue.size() > 1) {
        for (let i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }
        eliminated = queue.dequeue();
        console.log(eliminated + '在游戏中被淘汰！');
    }
    return queue.dequeue();
}

let names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
let winner = hotPotato(names, 7);
console.log('the winner is:' + winner);