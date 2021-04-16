### pointer-events:none
pointer-events: none。鼠标事件无效

pointer-events: none的作用不只是禁用链接hover，将click事件去掉。而按钮禁用状态下点击事件的阻止往往还是使用js来实现的，因为`pointer-events: none`可以直接让鼠标事件无效，不能让键盘事件无效，这里是`pointer-events`，而不是"any"或是"every"之类。

`input[type=text|button|radio|checkbox]`等控件元素完全支持dsiabled属性，可以实现事件的完全禁用（附带UI变化）。而a标签应用disabled属性是无法阻挡任何鼠标经过或是点击事件的。