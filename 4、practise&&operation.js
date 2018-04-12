function LinkedList() {
    let Node = (element) => {
        this.element = element;
        this.next = null;
    }
    let length = 0;
    let head = null;

    this.append = (element) => {
        let node = new Node(), cur;
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
}