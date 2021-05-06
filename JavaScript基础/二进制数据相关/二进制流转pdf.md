### PDF
> Angular

将responseType设置为blob，得到response时，window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
```
let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
let ele = document.createElement("a");
ele.href = url;
ele.download = filename.pdf;
document.body.appendChild(ele);
ele.click();
document.body.removeChild(ele);
window.open(url);
```

当responseType为blob时，处理报错
```
let error = event['error'];
if (error instanceof Blob) {
    let reader = new FileReader();
    reader.readAsText(event['error'], 'utf-8');
    let that = this;
    reader.onload = function (e) {
        error = JSON.parse("" + reader.result);
        that.msg.warning(error['error']);
    };
} else {
    this.msg.warning(error['error']);
}
```