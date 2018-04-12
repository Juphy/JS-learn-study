// 数组的大小是固定的，从数组的起点或中间插入成本很高，因为需要移动元素，链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的，每个元素有一个存储元素本身的节点和一个指向下一个元素的应用组成。
// 链表的好处在于，添加或移除元素的时候不需要移动其他元素，链表想要访问中间的一个元素，需要从起点开始迭代列表知道找到所需要的元素
// 单向链表
function LinkedList() {
    // Node表示加入列表的项，它包含要添加到列表的值，以及一个next属性，即指向列表中下一个节点项的指针
    let Node = (element) => {
        this.element = element;
        this.next = null;
    }
    let length = 0;
    let head = null;

    this.append = (element) => {
        let node = new Node(element), cur;
        if (head == null) {
            head = node; // 列表为空，添加第一个元素
        } else {
            // 列表不为空，则向里面追加元素
            cur = head;
            while (cur.next) {
                cur = cur.next;
            }
            cur.next = node;
        }
        length++;
    }
    this.insert = (position, element) => {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                cur = head,
                pre,
                index;
            if (position === 0) {
                node.next = cur;
                head = node;
            } else {
                while (index++ < position) {
                    pre = cur;
                    cur = cur.next;
                }
                node.next = cur;
                pre.next = node;
            }
            length++;
            return true;
        } else {
            return false;
        }

    }
    this.removeAt = (position) => {
        if (position >= 0 && position < length) {
            let cur = head,
                pre,
                index = 0;
            if (position === 0) {
                head = cur.next;
            } else {
                while (index++ < position) {
                    pre = cur;
                    cur = cur.next;
                }
                pre.next = cur.next;
            }
            length--;
            return cur.element;
        } else {
            return null;
        }
    }
    this.indexOf = (element) => {
        let cur = head,
            index = 0;
        while (cur) {
            if (cur.element === element) {
                return index;
            }
            index++;
            cur = cur.next;
        }
        return -1;
    }

    this.remove = (element) => {
        let cur = head,
            pre = cur,
            index = 0;
        while (cur) {
            if (!index && cur.element === element) {
                head = cur.next;
                return index;
            } else if (index && cur.element === element) {
                pre.next = cur.next;
                return index;
            }
            index++;
            pre = cur;
            cur = cur.next;
        }
        return -1;
    }
    this.remove = (element) => {
        let index = this.indexOf(element);
        return this.removeAt(index);
    }

    this.toString = () => {
        let cur = head,
            str = '';
        while (cur) {
            str += cur.element + (cur.next ? '\n' : '');
            cur = cur.next;
        }
        return str;
    }

    this.isEmpty = () => {
        return length === 0;
    }

    this.size = () => {
        return length;
    }

    this.head = () => {
        return head;
    }
}

// 双向链表
// 在链表中，一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的：一个链向下一个元素，另一个链向前一个元素

function DoublyLinkedList() {
    let Node = function (element) {
        this.element = element;
        this.next = null;
        this.prev = null;
    }
    let length = 0;
    let head = null; // 首项
    let tail = null; // 尾项
    this.insert = (position, element) => {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                cur = head,
                pre,
                index = 0;
            if (position === 0) {
                if (!head) {
                    head = node;
                    tail = node;
                } else {
                    node.next = cur;
                    cur.prev = node;
                    head = node;
                }
            } else if (position === length) {
                cur = tail;
                cur.next = node;
                node.prev = cur;
                tail = node;
            } else {
                while (index++ < position) {
                    pre = cur;
                    cur = cur.next;
                }
                node.next = cur;
                pre.next = node;

                cur.prev = node;
                node.prev = pre;
            }
            length++;
            return true;
        } else {
            return false;
        }
    }
    this.removeAt = (position) => {
        if (position >= 0 && position < length) {
            let cur = head,
                pre,
                index = 0;
            if (position === 0) {
                head = cur.next;
                if (length === 1) {
                    tail = null;
                } else {
                    head.prev = null;
                }
            } else if (position === length - 1) {
                cur = tail;
                tail = cur.prev;
                tail.next = null;
            } else {
                while (index++ < position) {
                    pre = cur;
                    cur = cur.next;
                }
                pre.next = cur.next;
                cur.next.prev = pre;
            }
            length--;
            return cur.element;
        } else {
            return null;
        }
    }
}

// 循环链表 ，最后一个元素指向下一个元素的指针不是引用null，而是指向第一个元素。
// 双向循环链表，指向head元素的tail.next，指向tail元素的head.prev