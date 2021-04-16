/**
 * 检查数据类型
 * @param {Array} params 
 */
function type(params) {
    return Object.prototype.toString.call(params);
}

/**
 * 数组去重
 * @param {Array} params 
 */
function unique1(params) {
    return [...new Set(params)]
}
function unique2(params) {
    let obj = {};
    return params.filter(ele => {
        if (!obj[ele]) {
            obj[ele] = true;
            return true;
        }
    })
}
function unique3(params) {
    var result = [];
    params.forEach(ele => {
        if (result.indexOf(ele) === -1) {
            result.push(ele)
        }
    })
    return result;
}

/**
 * 字符串去重
 */
String.prototype.unique = function () {
    var obj = {}, str = '';
    for (var i = 0; i < this.length; i++) {
        if (!obj[this[i]]) {
            str += this[i];
            obj[this[i]] = true;
        }
    }
    return str;
}

/**
 * 去除连续的字符串
 * @param {String} str 
 */
function unique(str){
    return str.replace(/(\w)\1+/g,'$1')
}

/**
 * 深拷贝
 * @param {Object} obj 
 * @param {Object} result 
 */
function deepClone(obj, result){
    
}
