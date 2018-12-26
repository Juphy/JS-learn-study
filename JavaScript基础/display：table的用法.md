### 父元素宽度固定，想让若干子元素平分宽度
如果设置百分数不一定能整除，设置具体的数值又限制父元素的宽度。
```
.parent{
    display: table;
    width: 1000px;
}
.son{
    display: table-cell;
}
```
当然也可以设置其他百分比，子元素总和必须是100%，方能生效。

### 块级子元素垂直居中
一般单行文字垂直居中设置line-height等于height，块级元素内多行文字需要定位或者flex布局
```
.parent{
    display: table
}
.son{
    display: table-cell;
    vertical-align: middle;
}
```
这种效果也可以用于图片，是图片垂直居中于元素。
```
<div class="parent">
    <div class="son">
        <img>
    </div>
</div>
.parent{
    display: table
}
.son{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
```

display:table => table
display:table-row => tr(行)
display:table-cell => td(列)
*display: table-cell时margin会失效*
*display:table-row时padding，margin会失效*（padding通过浏览器选择器可以看出来，但是确已失效）

### 两个box实现等高对齐
```
<div class="content">
    <div class="img-box"><img></div>
    <div class="text-box"></div>
</div>
.content{
    display: table;
    width: 100%;
}
.img-box{
    display: table-cell;
}
.text-box{

}
```
左侧box设置table-cell，右侧不设置，左侧就会跟随右侧高度变化而变化。如果要实现不管两个box高度产生变化另一个就跟随变化，只需要把右侧的box也设置成display:table-cell就可以实现。
### 弹性、响应式布局
```
<div class="content">
    <div class="left-box"></div>
    <div class="right-box"></div>
</div>
.content{
    display: table;
    width: 100%;
}
.left-box{
    float:left;
    // 有固定的宽度
}
.right-box{
    display: table-cell;
    *display:inline-block;
    *zoom: 1
}
```
左边元素由子元素撑起不确定宽度，右边设置table-cell就自适应剩余的宽度，父级的display:table可以忽略。