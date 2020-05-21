- direction 设置文本的方向，默认值ltr(从左到右)，rtl(从右到左)
- writing-mode 指定是否文本行水平或垂直布局
```
horizontal-tb：水平方向从左到右，垂直方向从上到下
vertical-rl：垂直方向从上到下，水平方向从右到左
vertical-lr：垂直方向从上到下，水平方向从左到右
```
- counter-reset 创建计数器，通过counter-increment属性进行增长
```
body{
    // set "my-counter" to 0
    counter-reset: my-counter;
}

h2::before{
    // Increment "my-counter" by 1
    counter-increment: my-counetr;
    content: "Section" counter(my-counter) ".";
}
```
- break-inside 定义页，列或区域断裂的行为方式，如果没有生成的框，则忽略该属性
```
/* Keyword values */
break-inside: auto;
break-inside: avoid;
break-inside: avoid-page;
break-inside: avoid-column;
break-inside: avoid-region;

/* Global values */
break-inside: inherit;
break-inside: initial;
break-inside: unset;
```
每个可能的断点，也就是每个元素的边界都受到三个属性的影响：break-after 属性定义之前元素的中断点，break-before 定义了之后元素的中断点， break-inside 定义了当前元素的中断点。

若要确定是否必须中断，使用一下规则：
- 如果这三个中断属性有一个是强制中断值（always，left，right，page，column，region）具有优先权，如果多余一个是这样的中断，则使用最近出现的元素的值，break-inside=>break-before=>break-after。
- 如果任何三种有关值是避免中断值（avoid，avoid-page，avoid-region，avoid-column），则该点无事发生。

values：
- auto 允许（但不强制）在原理框中插入任何中断（页面，列或区域）
- avoid 避免在主体框中插入任何中断（页面，列或区域）
- avoid-page  避免原理框中的任何分页符
- avoid-column 避免原理框中的任何列中断
- avoid-region 避免原理框中的任何区域中断

- currentColor：当前标签所继承的文字的颜色