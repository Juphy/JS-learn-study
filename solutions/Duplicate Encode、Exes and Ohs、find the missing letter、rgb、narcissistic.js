// 将字符串转换为新字符串， 其中新字符串中的每个字符都是 "("，该字符在原始字符串中只出现一次； 或者 ")"，该字符在原始字符串中出现多次。 在确定字符是否重复时忽略大小写。

// "din"      => "((("
// "recede"   => "()()()"
// "Success"  => ")())())"
// "(( @"     => "))((" 

function duplicateEncode(word) {
    return word
        .toLowerCase()
        .split('')
        .map((item, i, array) => {
            return array.indexOf(item) == array.lastIndexOf(item) ? '(' : ')'
        })
        .join('');
}

// 检查字符串是否具有相同数量的'x'和'o'。该方法必须返回一个布尔值并且不区分大小写。该字符串可以包含任何char。

// XO("ooxx") => true
// XO("xooxx") => false
// XO("ooxXm") => true
// XO("zpzpzpp") => true // when no 'x' and 'o' is present should return true
// XO("zzoo") => 

function XO(str) {
    let x = str.match(/x/gi);
    let o = str.match(/o/gi);
    return (x && x.length) === (o && o.length);
}

// 将一系列连续（递增）字母作为输入，并返回数组中缺少的字母。

// ['a', 'b', 'c', 'd', 'f'] -> 'e'
// ['O', 'Q', 'R', 'S'] -> 'P'

function findMissingLetter(array) {
    var i = array[0].charCodeAt();
    array.forEach(x => x.charCodeAt() == i ? i++ : i);
    return String.fromCharCode(i);
}

// 创建输入字符串的所有排列并删除重复项（ 如果存在），所有可能的顺序对输入中的所有字母进行随机排列。

// permutations('a'); // ['a']
// permutations('ab'); // ['ab', 'ba']
// permutations('aabb'); // ['aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa']

function permutations(string) {
    let r = [];

    function _(t, a) {

    }
}

console.log(permutations('aabb'));