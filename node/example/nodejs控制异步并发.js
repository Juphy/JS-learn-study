
/**
 * 
 * @param {*} list   {Array} - 要迭代的数组 
 * @param {*} limit   {Number}  -  并发数量控制数
 * @param {*} asyncHandle    {Function} -  对`list`的每一项的处理函数，参数为当前处理项，必须return一个Promise来确定是否继续进行迭代
 * @return {Promise} - 返回一个Promise值来确认所有数据是否迭代完成
 */
function mapLimit(list, limit, asyncHandle) {
    let recursion = (arr) => {
        return asyncHandle(arr.shift()).then(() =>{
            if(arr.length!==0) return recursion(arr)  // 数组还未迭代完，递归继续进行迭代
            else return "finish";
        })
    };
    let listCopy = [].concat(list);
    let asyncList=[];  // 正在进行的所有并发异步操作
    while(limit--){
        asyncList.push(recursion(listCopy));
    }
    return Promise.all(asyncList); // 所有并发异步操作完成后，本次并发控制迭代完成
}