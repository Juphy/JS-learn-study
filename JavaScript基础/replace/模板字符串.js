var str = '{{name}}氨基酸等会，爱健身的{{age}}阿萨德';
var str1 = '{{name}}氨基酸等会name，爱健身的{{age}}阿萨德';
var obj = { name: '小数点', age: 123 };
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

/// * 和 + 限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个 ? 就可以实现非贪婪或最小匹配。

console.log(_parseString(str, obj));
console.log(_parseString(str1, obj));


// 数字转银行卡号
console.log('123123123123123123'.replace(/(\d{4})(?=\d)/g, '$1' + ' '));
