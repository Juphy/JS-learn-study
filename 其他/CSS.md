1. 伪类和伪元素的区别？
单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。（伪元素由双冒号和伪元素组成）
双冒号是在当前规范中引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素写法。
比如`:first-line`、`:first-letter`、`:bofore`、`:after`等，而新的在CSS3中引入的伪元素则不允许再支持旧的单冒号的写法。
想让插入的内容出现在其它内容前，使用::before，否者，使用::after。
伪类一般匹配的是元素的一些特殊状态，如hover、link等，而伪元素一般匹配的特殊的位置，比如after、before等。
css引入伪类和伪元素概念是为了格式化文档树以外的信息。

伪类用于当已有的元素处于某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过:hover来描述这个元素的状态。

伪元素用于创建一些不在文档树中的元素，并为其添加样式。它们允许我们为元素的某些部分设置样式。比如说，我们可以通过::before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。

> 新增的伪类

:nth-child(n) :nth-last-child(n) :last-child :only-child :nth-of-type(n) :first-of-type 
:last-of-type :only-of-type :empty :target :not(elem) :enabled :disabled :checked

2. 页面导入样式时，使用link和@import有什么区别？
- 从属关系的区别：`@import`是CSS提供的语法规则，只能导入样式表的作用；`link`是HTML提供的标签，不仅可以加载CSS文件，还可以定义RSS、rel连接属性。
- 加载顺序区别：加载页面时，`link`标签引入的CSS被同时加载，`@import`引入的CSS将在页面加载完毕后被加载
- 兼容性区别：`@import`是CSS2.1才有的语法，故只在IE5+才能识别；`link`标签作为HTML元素，不存在兼容性问题。
- DOM可操作性性：可以通过JS操作DOM，插入`link`标签来改变样式，由于DOM方法是基于文档的，无法使用`@import`方式插入

3. 渲染页面时常见哪些不良现象？

- FOUC：主要指的是样式闪烁的问题，由于浏览器渲染机制（比如firefox），在 CSS 加载之前，先呈现了 HTML，就会导致展示出无样式内容，然后样式突然呈现的现象。会出现这个问题的原因主要是 css 加载时间过长，或者 css 被放在了文档底部。

- 白屏：有些浏览器渲染机制（比如chrome）要先构建 DOM 树和 CSSOM 树，构建完成后再进行渲染，如果 CSS 部分放在 HTML 尾部，由于 CSS 未加载完成，浏览器迟迟未渲染，从而导致白屏；也可能是把 js 文件放在头部，脚本的加载会阻塞后面文档内容的解析，从而页面迟迟未渲染出来，出现白屏问题。

4. DOMContentLoaded 事件和 Load 事件的区别？
当初始的HTML文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的加载完成。

Load 事件是当所有资源加载完成后触发的。

5. 如何处理 HTML5 新标签的浏览器兼容问题？
- IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式。

- 当然也可以直接使用成熟的框架，比如 html5shim
```JS
<!--[if lt IE 9]>
<script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
<![endif]-->
```
6. 伪类LVHA的解释？
a标签有四种状态：链接访问前，链接访问后，鼠标滑过，激活，分别对应四种伪类`:link`,`:visited`,`:hover`,`:active`
当链接未访问过时：
(1)当鼠标点击激活a链接时，满足`:link`和`:hover`两种状态，要改变a标签的颜色，就必须将`:hover`伪类放在
`:link`伪类后面声明。
(2)当鼠标点击激活a链接时同时满足`:link`,`:hover`,`:active`三种状态，要显示a标签激活时的样式(`:active`) ,
必须将`:active`声明放到`:link`和`:hover`之后。

当访问链接时，情况基本同上，只不过需要将`:link`换成`:visited`。

7. li 与 li 之间有看不见的空白间隔是什么原因引起的？
浏览器会把inline元素间的空白字符（空格、换行、Tab等）渲染成一个空格。
而为了美观。我们通常是一个`<li>`放在一行，这导致`<li>`换行后产生换行字符，
它变成一个空格，占用了一个字符的宽度。
- 为li设置float:left。 不足：有些容器是不能设置浮动的，如左右切换的焦点图
- 将所有li写在同一行。 不足：代码不美观
- 将ul内的字符尺寸直接设为0，即font-size: 0。 不足：ul中的其他字符也被设为0，需要额外重新设定其他字符尺寸
- 消除ul的字符间距letter-spaceing: -8px。 不足：这也设置li内的字符间隔，因此需要将li内字符间隔设为默认letter-spaceing: normal

8. 图片base64编码的优点和缺点
优点：减少一个图片的HTTP请求
缺点：1.根据base64的编码原理，编码后的大小会比原文件大小打1/3，如果把大图片编码到html/css中，不仅会造成文件体
积的增加，影响文件的加载速度，还会增加浏览器对html或css文件解析渲染的时间。
2.使用base64无法直接缓存，要缓存只能缓存包含base64的文件，比如HTML或者CSS，这相比于直接缓存图片的效果要差很多
3.兼容性问题，IE8以前的浏览器不支持。
一般一些网站的小图标可以使用base64图片来引入。

9. margin重叠问题
`margin必须是相邻的。`
- 相邻兄弟元素margin合并：设置块状格式化上下文元素（BFC）
- 父级和第一个或者最后一个子元素的margin合并
  - 父元素设置块级格式化上下文元素
  - 父元素设置border-top/bottom值或者padding-top/bottom
  - 父元素和第一个元素或者最后一个元素添加内联元素
- 空块级元素的margin合并
  - 设置垂直方向上的border或者padding
  - 里面设置内联元素
  - 设置height或者min-height


10. 溢出的省略
```CSS
// 单行省略
div{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 多行省略
div{
  display: -webkit-box; // 对象作为弹性盒子模型显示
  -webkit-box-orient: vertical; // 设置或检索伸缩对象的子元素的排列方式
  -webkit-line-clamp: 3; // 设置省略的界限
  overflow: hidden;
}
```

11. 两栏布局
- 利用浮动: 左边宽度设置为200px，并且设置左浮动，将右边元素的margin-left设置为200px,宽度设置为auto
- flex布局: 将左边元素的放大和缩小比例设置为0，基础大小设置为200px。将右边元素的放大比例设置为1
```CSS
.outer{
  display: flex;
  height: 100px
}

.left{
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 200px;
  background: tomato;
}

.right{
  flex: 1 1 auto
}
```
- 绝对定位的布局方式，将父级元素设置相对位置。左边元素absolute，右边元素margin-left。或者左边正常设置宽度，右边absolute。

12. 三栏布局
- 利用绝对定位的方式，左右两栏设置为绝对定位，中间设置对应方向上的margin值。
- flex布局，左右两栏的放大和缩小比例设置为0，基础大小设置为固定大小，中间一栏设置为auto
- 浮动方式，左右设置为固定大小，并设置对应方向的浮动，中建议一栏设置左右两个方向的margin值