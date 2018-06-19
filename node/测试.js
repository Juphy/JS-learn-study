let math = require('mathjs');
let Decimal = require('decimal.js');

function numAdd(num1/*:String*/, num2/*:String*/) {
    var baseNum, baseNum1, baseNum2;
    num1 = num1.toString();
    num2 = num2.toString();
    try {
        baseNum1 = num1.split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
}

console.log(numAdd(0.1, 0.2));
console.log(math.eval('0.1 + 0.2'));

x = new Decimal(0.3);
console.log(x.minus(0.1));