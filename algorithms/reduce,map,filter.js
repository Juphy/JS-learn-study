Array.prototype.reduce = function (cb, initValue) {
    if (initValue === undefined && !this.length) {
        throw new Error('myReduce of empty array with no initial value');
    }
    let result = initValue !== undefined ? initValue : this[0];
    for (let i = initValue !== undefined ? 0 : 1; i < this.length; i++) {
        result = cb(result, this[i], i, this);
    }
    return result;
}