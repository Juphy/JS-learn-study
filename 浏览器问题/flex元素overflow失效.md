## flex:1无效
> 使用flex布局时，有些需要滚动显示全部内容的元素在firefox下却不能滚动，其原因在于overflow失效。

解决方法：给该元素添加min-height: 0或者min-width: 0，取决于你的滚动方向，如果无效，尝试给其父元素添加该style，以此类推。

原因：在firefox下，flex元素默认将其最小尺寸设置为其子元素的尺寸，这意味着父元素永远能显示全部子元素，就是这样导致整个页面超过了屏幕。因此需要覆盖默认的最小尺寸。

## [flex在各浏览器中的bug](https://github.com/philipwalton/flexbugs)