var str = '{{name}}氨基酸等会，爱健身的{{age}}阿萨德';
var str1 = '{{name}}氨基酸等会name，爱健身的{{age}}阿萨德';
var obj = {name: '小数点', age: 123};
let parseString = function (str, obj) {
    Object.keys(obj).forEach(key => {
        str = str.replace(new RegExp(`{{${key}}}`, 'g'), obj[key]);
    });
    return str;
};
let _parseString = function (str, obj) {
    return str.replace(new RegExp(/\{\{(.*?)\}\}/, 'g'), (match, key) => {
            console.log(match, key);
            return obj[key.trim()];
        }
    )
};

console.log(_parseString(str, obj));
console.log(_parseString(str1, obj));
console.log(__parseString(str1, obj));
