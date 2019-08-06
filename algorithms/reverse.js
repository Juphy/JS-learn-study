String.prototype.reverse = function() {
    return this.split('').reverse().join('');
}

let a = 'string';
console.log(a.reverse());

Array.prototype.reverse = function() {
    for (var i = 0; i < Math.floor(this.length / 2); i++) {
        var a = this[i];
        this[i] = this[this.length - i - 1];
        this[this.length - i - 1] = a;
    }
    return this;
}

let b = [1, 2, 3, 4, 5];
console.log(b.reverse());

// 输出size位数的斐波那契数组
function fibonacci(size) {
    if (size <= 0) {
        return [];
    } else {
        let i = 0,
            temp = [];
        while (i <= size) {
            if (i === 0) {
                temp.push(0)
            }
            if (i === 1) {
                temp.push(1);
            }
            if (i > 1) {
                var a = temp[i - 1] + temp[i - 2];
                temp.push(a);
            }
            i++;
        }
        return temp;
    }
}

console.log(new Date().getTime());
fibonacci(1000000);
console.log(new Date().getTime());

// 输出size位数的斐波那契数列之和
function fibonacci1(size) {
    var fibArray = [];
    var fibNum = function(i) {
        if (i == 0) {
            return 0;
        }
        if (i == 1) {
            return 1;
        }
        return arguments.callee(i - 1) + arguments.callee(i - 2); //递归调用fibNum函数
    };
    for (var i = 0; i < size; i++) {
        fibArray[fibArray.length] = fibNum(i);
    }
    return fibArray;
}

console.log(new Date().getTime());
fibonacci1(1000000);
console.log(new Date().getTime());