### clipboard.js
剪切板依赖于 Selection 和 execCommand API，几乎所有的浏览器都支持 Selection API，然而 execCommand API 却存在一定的兼容性问题。

> 安装引用
```
npm install clipboard --save

<script src="https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js"></script>
```

> 正确使用
```
<input id="foo" type="text" value="大家">
<button class="btn" data-clipboard-action="copy" data-clipboard-target="#foo">复制</button>

<script>
  var clipboard = new ClipboardJS('.btn');

  clipboard.on('success', function(e) {
    console.log(e);
  });
    
  clipboard.on('error', function(e) {
    console.log(e);
  });
</script>
```

除了 input 元素之外，复制的目标还可以是 div 或 textarea 元素。

```
实例化 clipboard 对象时，设置复制的目标。
let clipboard = new ClipboardJS('.btn', {
  target: function() {
    return document.querySelector('div');
  }
});

如果需要设置复制的文本，我们也可以在实例化 clipboard 对象时，设置复制的文本。
let clipboard = new ClipboardJS('.btn', {
  text: function() {
    return 'to be or not to be';
  }
});
```

### Selection API
`Selection`对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。文本选区由用户拖拽鼠标经过文字而产生。如果要获取用于检查或修改的`Selection`对象，可以调用`window.getSelection`方法。

Selection 对象所对应的是用户所选择的 ranges （区域），俗称 拖蓝。默认情况下，该函数只针对一个区域，我们可以这样使用这个函数：
```
let selection = window.getSelection();
let range = selection.getRangeAt(0);
```
以上是如何获取选区，其实除了获取选区中的区域之外，还可以通过`createRange`API创建一个新的区域，然后将该区域添加到选区中：
```
<div>123123<strong>文字</strong>。欢迎关注<strong>驱蚊器翁</strong></div>
<script>
   let strongs = document.getElementsByTagName("strong");
   let s = window.getSelection();

   if (s.rangeCount > 0) s.removeAllRanges(); // 从选区中移除所有区域
   for (let i = 0; i < strongs.length; i++) {
     let range = document.createRange(); // 创建range区域
     range.selectNode(strongs[i]); // 让range区域包含指定节点及其内容
     s.addRange(range); // 将创建的区域添加到选区中
   }
</script>
```
**前只有使用 Gecko 渲染引擎的浏览器，比如 Firefox 浏览器实现了多个区域。**

### execCommand API
`document.execCommand` API 允许运行命令来操作网页中的内容，常用的命令有 bold、italic、copy、cut、delete、insertHTML、insertImage、insertText 和 undo 等。

> document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
- aCommandName：字符串类型，用于表示命令的名称；
- aShowDefaultUI：布尔类型，用于表示是否展示用户界面，一般为 false；
- aValueArgument：额外参数，一些命令（比如 insertImage）需要额外的参数（提供插入图片的 URL），默认为 null。

调用`document.execCommand`方法后，该方法会返回一个布尔值。如果是`false`的话，表示操作不被支持或未被启用。

> document.queryCommandSupported：确定当前的浏览器是否支持指定的编辑命令
```
static isSupported(action = ['copy', 'cut']) {
  const actions = (typeof action === 'string') ? [action] : action;
  let support = !!document.queryCommandSupported;

  actions.forEach((action) => {
    support = support && !!document.queryCommandSupported(action);
  });

  return support;
}
```