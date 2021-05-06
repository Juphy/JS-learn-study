一般情况下，通过`input`元素的`accept`属性来限制上传的文件类型：
```
<input type="file" id="inputFile" accept="image/png">
```
这种方案可以满足大部分场景，但是如果用户把后缀更改的话，就可以突破这个限制，那么就需要通过读取文件的二进制数据来识别正确的文件类型。

### 如何查看图片的二进制数据
借助现成的编辑器，Window的`WinHex`或macOS的`Synalyze It! Pro`十六进制编辑器。

### 如何区分图片的类型
`计算机并不是通过图片的后缀来区分不同的图片类型，而是通过"魔数"（Magic Number）来区分`。对于某些类型的文件，起始的几个字节内容都是固定的，根据这几个字节的内容就可以判断文件的类型。
常见的图片类型对应的魔数如下：
| 文件类型 | 文件后缀 | 魔数                               |
| :------- | :------- | :--------------------------------- |
| JPEG     | jpg/jpeg | 0xFF D8 FF                         |
| PNG      | png      | 0x89 50 4E 47 0D 0A 1A 0A          |
| GIF      | gif      | 0x47 49 46 38（GIF8）              |
| BMP      | bmp      | 0x42 4D                            |
| PDF      | pdf      | 0x25 50 44 46 对应的字符串是`%PDF` |

### 如何检测图片的类型
在获取文件对象后，通过FileReader API来读取文件的内容，并不需要读取文件的完整信息，可以封装一个`readBuffer`函数，用于读取文件中指定范围的二进制数据。
```
function readBuffer(file, start = 0, end = 2){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = () =>{
            resolve(reader.result);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(start, end));
    })
}
```
对于PNG类型的图片来说，该文件的前8个字节是`0x89 50 4E 47 0D 0A 1A 0A`。因此，在检测已选择的文件是否为PNG类型的图片时，只需要读取前8个字节的数据，并逐一判断每个字节的内容是否一致。

为了实现逐字节对比并能够更好地实现复用，定义一个`check`函数：
```
function check(headers){
    return (buffers, options = { offset: 0 })=>
        headers.every(
            (header, index) => header === buffers[options.offset + index]
        )
}
```
### example
```html
<div>
    选择文件：<input type="file" id="inputFile" accept="image/*" onchange="handleChange(event)">
    <p id="readFileType"></p>
</div>
```
```JavaScript
const isPng = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // png图片对应的魔数
const readFileElement = document.querySelector('#readFileType');
async function handleChange(event){
    const file = event.target.files[0];
    const buffers = await readBuffer(file, 0, 8);
    const unit8Array = new Uint8Array(buffers);
    readFileElement.innerText = `${file.name}文件的类型是：${isPNG(unit8Array)?"image/png":file.type}`;
}

// PDF
function stringToBytes(string){
    return [...string].map((character) => character.charCodeAt(0));
}
const isPDF = check(stringToBytes('%PDF'));
```

> 文件类型是多种多样的，也可以使用现成的第三方库来实现文件检测的功能，比如`file-type`