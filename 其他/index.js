let arr = ['A', "B", "C"];
// 1=>"A 4=>'AA'
let ch = (num) => {
  let m = num / arr.length, n = num % arr.length - 1, s = '';
  for (let i = 0; i < m; i++) {
    s += arr[n < 0 ? arr.length - 1 : n];
  }
  return s;
}

console.log(ch(9), ch(1), ch(4));

function getUrlParam(sUrl, sKey) {
  let p = sUrl.split('?')[1].split('#')[0].split('&');
  let res = {};
  p.forEach(item => {
    let o = item.split('=');
    res[o[0]] = res[o[0]] || [];
    res[o[0]].push(o[1]);
  });
  if (sKey) {
    return res[sKey] ? (res[sKey].length === 1 ? res[sKey][0] : res[sKey]) : ''
  } else {
    return res
  }
}

// 实现简单的模板字符串替换
var template = "{{name}}很厉害，才{{age}}岁"