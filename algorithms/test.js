let threeSum = function(nums) {
    if (nums.length < 3) return [];
    nums = nums.sort((a, b) => a - b);
    if (nums[0] > 0 || nums[nums.length - 1] < 0) return [];
    let res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;
        if (nums[i] === nums[i - 1]) continue;
        let v = 0 - nums[i],
            l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let _v = nums[l] + nums[r];
            if (v === _v) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++;
                r--;
            }
            if (v > _v) l++;
            if (v < _v) r--;
        };
    }
    return res;
}

let longestCommonPrefix = (strs) => {
    let res = strs[0] || '';
    for (let i = 0; i < res.length; i++) {
        let pre = res[i];
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] !== pre) return res.slice(0, i);
        }
    }
    return res;
}

let threeSumClosest = (nums, target) => {
    let diff = Number.MAX_SAFE_INTEGER;
    nums = nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length - 2; i++) {
        if (nums[i] === nums[i - 1]) continue;
        let l = i + 1,
            r = nums.length - 1;
        while (l < r) {
            let sum = nums[i] + nums[l] + nums[r];
            let newDiff = Math.abs(sum - target);
            if (newDiff === 0) return sum;
            if (diff > newDiff) diff = newDiff, closest = sum;
            if (sum > target) r--;
            else l++;
        }
    }
    return closest;
}

let letterCombinations = (digits) => {
    let dict = {
        2: ['a', 'b', 'c'],
        3: ['a', 'b', 'c'],
        4: ['a', 'b', 'c'],
        5: ['a', 'b', 'c'],
        6: ['a', 'b', 'c'],
        7: ['a', 'b', 'c'],
        8: ['a', 'b', 'c'],
        9: ['a', 'b', 'c']
    }
}