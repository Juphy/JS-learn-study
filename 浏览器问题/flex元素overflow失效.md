## flex:1无效
> 使用flex布局时，有些需要滚动显示全部内容的元素在firefox下却不能滚动，其原因在于overflow失效。

解决方法：给该元素添加min-height: 0或者min-width: 0，取决于你的滚动方向，如果无效，尝试给其父元素添加该style，以此类推。

原因：在firefox下，flex元素默认将其最小尺寸设置为其子元素的尺寸，这意味着父元素永远能显示全部子元素，就是这样导致整个页面超过了屏幕。因此需要覆盖默认的最小尺寸。

> 在设置了flex:1的容器中，如果文字很长，这时候文字就会超出容器，而不是待在设置好的动态剩余的空间中。

```
<div class="main">
    <img alt="" class="logo" src="pic.jpg">
    <div class="content">
        <h4 class="name">a name</h4>
        <p class="info">a info</p>
        <p class="notice">This is notice content.</p>
    </div>
</div>
.main {
    display: flex;
}
.logo {
    width: 100px;
    height: 100px;
    margin: 10px;
}
.content {
    flex: 1;
}
.content > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```
.notice可能会非常长，一些设备下需要隐藏显示，即不换行，并留下省略符...作标记。这里会发现text-overflow:ellipsis不生效，省略符根本没有出现，而且因为设置了nowrap会发现文字会将content撑开，导致内容超出屏幕。

flex布局的问题，省略符需要对父元素限定宽度，对父元素.content设置width: 100%无效，但是设置width: 0可行。
```
.content{
    flex: 1;
    width: 0;
}
```

如果不设置宽度，.content可以被子节点无限撑开，因此.notice总有足够的宽度在一行内显示文本，也就不能触发截断省略的效果。
```
.content{
    flex: 1;
    overflow: hidden;
}
```

## [flex在各浏览器中的bug](https://github.com/philipwalton/flexbugs)