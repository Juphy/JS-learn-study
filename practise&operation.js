const list = [1, 2, 3, 4];
let results = [];
list.forEach(i => {
    list.forEach(j => {
        list.forEach(k => {
            if (i !== j && j !== k && k !== i) {
                results.push(i * 100 + j * 10 + k);
            }
        })
    })
});
console.log(results);
let nums = [-12, 23, 34, 56, 25, 35, 46];
for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) {
            [nums[j], nums[i]] = [nums[i], nums[j]];
        }
    }
}
console.log(nums);
nums = [-12, 23, 34, 56, 25, 35, 46];
const quickSort = (ary) => {
    if (ary.length <= 1) {
        return ary
    }
    let mid_value = ary.splice(Math.floor(ary.length / 2), 1)[0];
    let left = [], right = [];
    for (let i = 0; i < ary.length; i++) {
        ary[i] > mid_value ? right.push(ary[i]) : left.push(ary[i]);
    }
    return quickSort(left).concat(mid_value, quickSort(right));
}
console.log(quickSort(nums));
const insertSort = (ary) => {
    let left = ary.splice(0, 1);
    for (let i = 0; i < ary.length; i++) {
        let cur = ary[i];
        for (let j = left.length - 1; j >= 0;) {
            if (cur < left[j]) {
                j--;
                if (j === -1) {
                    left.unshift(cur);
                }
            } else {
                left.splice(j + 1, 0, cur);
                break;
            }
        }
    }
    return left;
}
console.log(insertSort(nums));

// const Stack = () => {
//     let items = []; // 模拟栈，先进后出
//     this.push = (item) => {
//         items.push(item)
//     }
//     this.pop = () => {
//         return items.pop();
//     }
//     this.peek = () => {
//         return items[items.length - 1]
//     }
//     this.isEmpty = () => {
//         return items.length === 0;
//     }
//     this.clear = () => {
//         items = [];
//     }
//     this.size = () => {
//         return items.length;
//     }
//     this.print = () => {
//         console.log(items.toString());
//     }
// }
let Stack = (function () {
    let _items = Symbol();

    class Stack {
        constructor() {
            this[_items] = [];
        }

        push(item) {
            this[_items].push(item)
        }

        pop() {
            return this[_items].pop();
        }

        peek() {
            return this[_items][this[_items].length - 1]
        }

        isEmpty() {
            return this[_items].length === 0;
        }

        clear() {
            this[_items] = [];
        }

        size() {
            return this[_items].length;
        }

        print() {
            console.log(this[_items].toString());
        }
    }

    return Stack;
})();


let stack = new Stack();
stack.push(5);
stack.push(8);
let objSymbols = Object.getOwnPropertySymbols(stack);
console.log(objSymbols.length)
console.log(objSymbols)
console.log(objSymbols[0])
console.log(stack[objSymbols[0]]);
stack[objSymbols[0]].push(1);
stack.print();

let baseConvert = (decNumber, base) => {
    let stack = new Stack(),
        rem,
        baseString = '',
        digits = '0123456789ABCDEF';
    while (decNumber > 0) {
        rem = Math.floor(decNumber % base);
        stack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }
    while (!stack.isEmpty()) {
        baseString += digits[stack.pop()];
    }
    return baseString;
}
console.log(baseConvert(15, 16));

// 平衡圆括号匹配，如果有"("，就往stack中添加"("，如果有")"，就删除"("。
// 如果“（”多，那么stack就不是空的，如果“）”多，那么删除的时候就会出现空。

let isBracketBalanced = (str) => {
    let stack = new Stack();
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            stack.push('(')
        } else if (str[i] === ')') {
            if (!stack.pop()) {
                return false;
            }
        }
    }
    return stack.isEmpty();
}
console.log(isBracketBalanced("(123)123(123)")); //true
console.log(isBracketBalanced("(12(3)(123)12)")); // true
console.log(isBracketBalanced("(()))")); // false

// 通用括号匹配
let generalBalanced = (str) => {
    let stack = new Stack();
    let types = {
        "(": ")",
        "[": "]",
        "{": "}",
    }
    let temp = '';
    for (let i = 0; i < str.length; i++) {
        if (str[i] in types) {
            stack.push(str[i]);
        } else if(Object.values(types).includes(str[i])){
            temp = stack.pop();
            if (types[temp] !== str[i]) {
                return false;
            }
        }
    }
    return stack.isEmpty();
}
console.log(generalBalanced("[123]{qwe}()[(){}]"));
console.log(generalBalanced("[[qwe]{}()[(){}]"));
console.log(generalBalanced("{{}{[123]()}}"));