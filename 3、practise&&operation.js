// 字典 [键：值]
function Dictionary() {
    let items = {};
    this.has = (key) => {
        return key in items;
    }
    this.set = (key, value) => {
        items[key] = value;
    }
    this.delete = (key) => {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    }
    this.get = (key) => {
        return this.has(key) ? items[key] : undefined;
    }
    this.values = () => {
        let values = [];
        for (let key in items) {
            if (this.has(key)) {
                values.push(items[key]);
            }
        }
        return values;
        return Object.values(items);
    }
    this.keys = () => {
        return Object.keys(items);
    }
    this.clear = () => {
        items = {};
    }
    this.size = () => {
        return Object.keys(items).length;
    }
    this.getItems = () => {
        return items;
    }
}

let dictionary = new Dictionary();
dictionary.set('Gandalf', 'gandalf@email.com');
dictionary.set('John', 'johnsnow@email.com');
dictionary.set('Tyrion', 'tyrion@email.com');
console.log(dictionary.size());
console.log(dictionary.has('Gandalf'));
console.log(dictionary.keys());
console.log(dictionary.values());
console.log(dictionary.get('Tyrion'));
dictionary.delete('John');
console.log(dictionary.keys());
console.log(dictionary.values());
console.log(dictionary.getItems());

// 散列表 HashTable也叫做HashMap类，是Dictionary类的一种散列表实现方式
function HashTable() {
    let table = [];
    let loseHashCode = (key) => {
        // 将key的各个字符取ASCII码加到hash变量中
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };
    this.put = (key, value) => {
        let position = loseHashCode(key);
        console.log(position + ' - ' + key);
        table[position] = value;
    };
    this.get = (key) => {
        return table[loseHashCode(key)];
    };
    this.remove = (key) => {
        // 对于 HashTable 类来说，我们不需要像 ArrayList 类一样从 table 数组中将位置也移除。由于元素分布于整个数组范围内，一些位置会没有任何元素占据，并默认为 undefined 值。我们也不能将位置本身从数组中移除（这会改变其他元素的位置），否则，当下次需要获得或移除一个元素的时候，这个元素会不在我们用散列函数求出的位置上。
        table[loseHashCode(key)] = undefined;
    }
    this.print = () => {
        table.forEach((item, i) => {
            if (item !== undefined) {
                console.log(i + ':' + item);
            }
        });
    }
}

var hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
console.log(hash.get('Gandalf'));
console.log(hash.get('Loiane'));
hash.remove('Gandalf');
console.log(hash.get('Gandalf'))

var hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
hash.put('Aaron', 'aaron@email.com');
hash.put('Donnie', 'donnie@email.com');
hash.put('Ana', 'ana@email.com');
hash.put('Jonathan', 'jonathan@email.com');
hash.put('Jamie', 'jamie@email.com');
hash.put('Sue', 'sue@email.com');
hash.put('Mindy', 'mindy@email.com');
hash.put('Paul', 'paul@email.com');
hash.put('Nathan', 'nathan@email.com');
hash.print();
// 此时，出现冲突，处理冲突的方法为：分离链接，线性探查和双散列法

// 分离链接：散列表的每一个位置创建一个链表并将元素存储在里面。它是解决冲突的最简单的方法，但是它在 HashTable 实例之外还需要额外的存储空间。
// 同一个位置储存多个值，不同值通过链表实现
function HashTable() {
    let table = [];

    // 新的辅助类来表示将要加入LinkedList实例的元素，ValuePair类
    function ValuePair(key, value) {
        this.key = key;
        this.value = value;
        this.toString = () => {
            return '[' + this.key + '-' + this.value + ']';
        }
    }

    let loseHashCode = (key) => {
        // 将key的各个字符取ASCII码加到hash变量中
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    };

    this.put = (key, value) => {
        let pos = loseHashCode(key);
        if (table[pos] == undefined) {
            table[pos] = new LinkedList();
        }
    }
}
