// 栈，先进后出，新添加的或待删除的元素都保存在栈的同一端，称作栈顶，另一端叫栈底。在栈里新元素靠近栈顶，旧元素就接近栈底。
function Stack() {
    let item = []; // 用数组来模拟栈
    this.push = (element) => {
        item.push(element);
    }
    this.pop = () => {
        return item.pop();
    }
    this.peek = () => {
        return item[item.length - 1]
    }
    this.isEmpty = () => {
        return item.length === 0;
    }
    this.clear = () => {
        item = [];
    }
    this.size = () => {
        return item.length;
    }
    this.print = () => {
        console.log(item.toString());
    }
}

// 任意十进制数字转化成任意进制（低于十进制）
function divideByAny(decNumber, num) {
    if (num > 0) {
        let ary1 = [], cur, str = '';
        while (decNumber > 0) {
            cur = Math.floor(decNumber % num);
            ary1.push(cur);
            decNumber = Math.floor(decNumber / num);
        }
        while (ary1.length) {
            str += ary1.pop().toString();
        }
        return str;
    }
}

console.log(divideByAny(10, 3));

// 队列，先进先出
function Queue() {
    let items = [];
    this.enqueue = (ele) => {
        items.push(ele);
    }
    this.dequeue = () => {
        return items.shift()
    }
    this.front = () => {
        return items[0];
    }
}

function hotPotato(nameList, num) {
    let queue = new Queue();
    nameList.forEach(item => {
        queue.enqueue(item);
    })
    let eliminated = '';
    while (queue.length > 1) {
        for (var i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }
        eliminated = queue.dequeue();
        console.log(eliminated + 'Get out!')
    }
    return queue.dequeue();
}

console.log(hotPotato(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 5));

// 单向链表
// 链表中最简单的形式就是单向链表，链表中的节点都包含两个部分，第一部分储存着自身信息，第二部分则储存有指向下一节点的指针
/**
 * 单向链表构造函数
 */
function LinkedList() {
    /**
     * 单向链表中节点的构造函数
     * @param {Any} element 要传入链表的节点
     */
    const Node = (element) => {
        this.element = element;
        // 下一个节点的地址
        this.next = null;
    }

    // 单向链表的长度
    let length = 0;
    // 单向链表的头结点，初始化为null
    let head = null;

    /**
     * 向单向链表尾部添加元素
     * @param  {Any} element 要加入链表的节点
     */
    this.append = (element) => {
        var node = new Node(element);
        var current;
        if (head == null) {
            head = node;
        } else {
            // 当前项等于链表头部元素.
            // while循环到最后一个，从而将该节点加入链表尾部。
            current = head;
            // 当next为null时，判定为false。退出循环。
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        length++;
    }

    /**
     * 向单向链表中插入某个元素
     * @param  {Number} position 要插入的位置
     * @param  {Any} element  要插入的元素
     * @return {Boolean}          插入成功返回true，失败返回false
     */
    this.insert = (position, element) => {
        if (position >= 0 && position <= length) {
            let node = new Node(element);
            let current = head;
            let previous;
            let index = 0;

            if (position == 0) {
                node.next = current;
                head = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = node;
                node.next = current;
            }
            length++;
            return true;
        } else {
            return false;
        }
    }
}

