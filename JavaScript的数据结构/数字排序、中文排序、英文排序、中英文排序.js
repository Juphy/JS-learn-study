// 数字排序
var ary = [98, 89, 12, 36, 72, 58, 64];
ary.sort((a, b) => a - b);
console.log(ary);

// 纯汉字排序
ary = ['白鸽', '麻雀', '大象', '狗', '猫', "鸡"];
ary.sort((a, b) => a.localeCompare(b, 'zh'));
console.log(ary);

// 纯字母
ary = ["ssdas", "asd", "sfdf", "bsad", "psi"];
ary.sort((a, b) => a.localeCompare(b));
console.log(ary);

// 字母+汉字（先把汉字排完再排字母）
ary = ["a水电费", "b是蒋介石的", '武汉', '北京', "asds", '上海', '天津', "啊行行行", "是的", "cs是否", "b阿斯蒂芬"];
ary.sort((a, b)=> a.localeCompare(b, 'zh'));
console.log(ary);

// 汉字+字母（先汉字后字母）
