JavaScript 遍历地址数组实现多文件下载，`该方法与导出excel一致`

```
let array=[url1, url2];
array.forEach((item,i) =>{
    let url = item;
    let ele = document.createElement('a');
    ele.style.display='none';
    ele.download="ga-"+i;
    ele.href=url;
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
})
```

Angular8+ Chrome 浏览器：测试环境可以批量下载，打包线上环境只能下载最后一个。

改用 iframe

```
let array=[url1, url2];
array.forEach(item =>{
    let url = item;
    let ele = document.createElement('iframe');
    ele.style.display='none';
    ele.src=url;
    document.body.appendChild(ele);
})
```
