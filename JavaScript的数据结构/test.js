let f1 = function (nums, target) {
    let arr;
    for (let x of nums) {
        let i = nums.indexOf(x);
        let j = nums.indexOf(target - x);
        if (j > -1 && i !== j) {
            arr = [i, j];
            break;
        }
    }
    return arr;
};
console.log(f1([1, 4, 3, 5, 6], 8));
