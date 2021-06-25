BFC：块级格式化上下文
触发条件：根元素，浮动，display: inline-block, flex, table-cell, flex-inline, position: absolute fixed, overflow不是visible

特性：1.属于同一BFC的元素在垂直方向上排列
2.相邻元素之间的margin会重叠
3.BFC内部的元素的margin的左边，与包含块border的左边相接触
4.计算BFC的高度时 浮动元素需要计算在内(这解释了overflow: hidden能解决父元素高度塌陷的问题)
5.浮动元素不会遮挡文字，文字会环绕在浮动元素周围
6.BFC是独立容器。内部元素布局不会影响到外部元素。