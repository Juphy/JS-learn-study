// 使用对象来表示集合，js对象不允许一个键指向两个不同的属性，也保证了集合里的元素是唯一的
/*function Set() {
    let items = {};
    this.has = (value) => {
        return items.hasOwnProperty(value);
    }
    this.add = (value) => {
        if (!this.has(value)) {
            items[value] = value;
            return true;
        } else {
            return false;
        }
    }
    this.remove = (value) => {
        if (this.has(value)) {
            delete items[value];
            return true;
        }
        return false;
    }
    this.clear = () => {
        items = {};
    }
    this.size = () => {
        return Object.keys(items).length;
    }

    this.values = () => {
        let values = [];
        // for (let i = 0, keys = Object.keys(items); i < keys.length; i++) {
        //     values.push(items[keys[i]]);
        // }
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                values.push(items[key]);
            }
        }
        return values;
    }

    // 取并集
    this.union = (otherSet) => {
        let unionSet = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }
        values = otherSet.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }
        return unionSet;
    }

    // 取交集
    this.intersection = (otherSet) => {
        let interSet = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (otherSet.has(values[i])) {
                interSet.add(values[i]);
            }
        }
        return interSet;
    }

    // 取差集
    this.difference = (otherSet) => {
        let diffSet = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                diffSet.add(values[i])
            }
        }
        return diffSet;
    }

    // 子集 otherSet是否是当前实例的子集
    this.subSet = (otherSet) => {
        if (this.size() > otherSet.size()) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                if (!otherSet.has(values[i])) {
                    return false;
                }
            }
            return true;
        }
    }

}

let set = new Set();
set.add(1);
console.log(set.values());
console.log(set.has(1));
console.log(set.size());
set.add(2);
console.log(set.values());
console.log(set.has(2));
console.log(set.size());
set.remove(1);
set.remove(2);

let setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
setA.add(4);

let setB = new Set();
setB.add(5);
setB.add(6);
setB.add(3);
setB.add(4);

let unionAB = setA.union(setB);
console.log(unionAB.values());

let interAB = setA.intersection(setB);
console.log(1, interAB.values());
let diffAB = setA.difference(setB);
console.log(2, diffAB.values());*/


// ES6的Set的values方法返回Iterator，而不是值构成的数组，另一个区别就是，size方法返回set中存储的值的个数，而ES6的Set则有一个size属性。
// delete方法删除set的元素
// clear方法会重置set数据结构


// ES6 Set类的操作
// 以下使用的是ES6的Set类
let setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);

let setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
setB.add(5);
// 并集
unionAB = new Set();
setA.forEach(i => unionAB.add(i));
setB.forEach(i => unionAB.add(i));
console.log(unionAB);
// 交集
let intersection = (setA, setB) => {
    let interSet = new Set();
    setA.forEach(i => {
        if (setB.has(i)) {
            interSet.add(i);
        }
    });
    return interSet;
}
intersection = new Set([x for (x of setA) if (setB.has(x))]);
console.log(intersection(setA, setB));

