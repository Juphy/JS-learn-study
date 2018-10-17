// 使用对象来表示Set集合，js对象不允许一个键指向两个不同的属性，也保证了集合里的元素是唯一的
function Set() {
    let items = {};
    this.has = (value) => {
        return items.hasOwnProperty(value);
    };
    this.add = (value) => {
        if (!this.has(value)) {
            items[value] = value;
            return items;
        }
    };
    this.delete = (value) => {
        if (this.has(value)) {
            delete items[value];
        }
    };
    this.clear = () => {
        items = {};
    };
    this.size = () => {
        return Object.keys(items).length;
    };
    this.values = () => {
        return Object.keys(items);
    }
}