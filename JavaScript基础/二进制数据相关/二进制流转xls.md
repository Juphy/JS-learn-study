后端提供一个导出接口，调用该接口成功的话会直接返回一个二进制流数据，如果导出过程中出现错误则会返回一个json格式的数据。在成功的情况下，前端需要将该二进制流数据转成文件并下载，在失败的情况下则需要根据返回数据的状态码和消息自动进行错误提示和其他操作。

> responseType="application/json" 导致文件乱码

```
// type 为需要导出的文件类型，此处为xls表格类型
const blob = new Blob( [res.data], {type: application/x-xls} )

// 兼容不同浏览器的URL对象
const url = window.URL || window.webkitURL || window.moxURL

// 创建下载链接
const downloadHref = url.createObjectURL(blob)

// 创建a标签并为其添加属性
let downloadLink = document.createElement('a')
downloadLink.href = downloadHref
downloadLink.download = '下载文件名.xls'

// 触发点击事件执行下载
downloadLink.click()
```

> responseType="arrayBuffer"
```
const tempBlob = new Blob( [res.data], {type: ‘application/json} )
// 通过 FileReader 读取这个 blob
const reader = new FileReader()
reader.onload = e => {
  const res = e.target.result
  // 此处对fileReader读出的结果进行JSON解析
  // 可能会出现错误，需要进行捕获
  try {
    const json = JSON.parse(res)
    if (json) {
      // 解析成功说明后端导出出错，进行导出失败的操作，并直接返回
      return
    }
  } catch (err) {
    // 该异常为无法将字符串转为json
    // 说明返回的数据是一个流文件
    // 不需要处理该异常，只需要捕获即刻
  }

  // 如果代码能够执行到这里，说明后端给的是一个流文件，再执行上面导出的代码
  // do export code
}
// 将blob对象以文本的方式读出，读出完成后将会执行 onload 方法
reader.readAsText(tempBlob)
```

火狐浏览器上a标签点击导出无效。解决方法：需要先将a标签添加到当前页面上，再执行click，之后再移除该节点，而不能直接执行click。