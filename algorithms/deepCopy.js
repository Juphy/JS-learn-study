function deepClone(obj) {
    if (obj instanceof Array) { // 必选先判断
        let ary = [];
        for (let i = 0; i < obj.length; i++) {
            ary[i] = deepClone(obj[i]);
        }
        return ary;
    } else if (obj instanceof Object) {
        let ary = {};
        for (let key in obj) {
            ary[key] = deepClone(obj[key])
        }
        return ary;
    } else {
        return obj;
    }
}

