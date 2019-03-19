### CSS3 多栏布局
- column-count 指定列的元素应分成的数目。
```
div {
    -webkit-column-count: 3; /* Chrome, Safari, Opera */
    -moz-column-count: 3; /* Firefox */
    column-count: 3;
}
<div>
。。。。。。。。。。
</div>
将该元素中的文本或者元素等平均地分成不同数目的列
```
-column-gap 指定列之间的差距
```
  -webkit-column-gap: 40px; /* Chrome, Safari, Opera */
  -moz-column-gap: 40px; /* Firefox */
  column-gap: 40px;
```
- column-rule-style 指定列之间线的风格
```
  -webkit-column-rule-style: dashed; /* Chrome, Safari, Opera */
  -moz-column-rule-style: dashed; /* Firefox */
  column-rule-style: dashed;
```
- column-rule-width 指定列之间线的宽度
```
  -webkit-column-rule-width: 1px; /* Chrome, Safari, Opera */
  -moz-column-rule-width: 1px; /* Firefox */
  column-rule-width: 1px;
```
- column-rule-color 指定列之间线的颜色
```
  -webkit-column-rule-color: lightblue; /* Chrome, Safari, Opera */
  -moz-column-rule-color: lightblue; /* Firefox */
  column-rule-color: lightblue;
```
- column-rule 指定列之间的线的样式
```
  -webkit-column-rule: 1px solid lightblue; /* Chrome, Safari, Opera */
  -moz-column-rule: 1px solid lightblue; /* Firefox */
  column-rule: 1px solid lightblue;
}
```
- column-span 指定子元素是否跨越，值只有none和all，在它的前后内容都得按照分栏布局

*Firefox and Internet Explorer 9 (and earlier versions) do not support the column-span property.*
```
div{
    column-count: 3;
}

h1{
    -webkit-colun-span: all;
    column-span: all;
}

<div>
    <h1>，，，，，</h1></h1>
    。。。。。。
</div>

此时h2标签元素并不会在列的规则，在列的上方
```
- column-width  指定列的建议宽度，并不是固定这个值，而是结合分栏布局灵活变化

*Internet Explorer 9, and earlier versions, does not support the column-width property.*
```
div{
  -webkit-column-width: 100px; /* Chrome, Safari, Opera */
  -moz-column-width: 100px; /* Firefox */
  column-width: 100px;
}
```

- columns = column-width+column-count 指定列的建议宽度和列的最大数量
```
div {
  -webkit-columns: 100px 3; /* Chrome, Safari, Opera */
  -moz-columns: 100px 3; /* Firefox */
  columns: 100px 3;
}
```
- column-fill 指定如何填充列，平衡与否，默认balance（均衡地填充），auto会按顺序优先填充
```
.newspaper1 {
  -moz-column-fill: auto; /* Firefox */
  column-fill: auto;
}

.newspaper2 {
  -moz-column-fill: balance; /* Firefox */
  column-fill: balance;
}
```
- 

### 多栏布局的应用

[古书排版](example/multiple_columns.html#demo1)

- 每栏宽度控制在一个字左右
- 通过word-warp: break-word使中文的标点符号换行

[writing-mode属性古书排版](example/multiple_columns.html#demo2)

[瀑布流布局](example/multiple_columns.html#demo3)