### position:sticky

position:relative 和 position:fixed 的结合体——当元素在屏幕内是，表现为 relative，就要滚出显示器屏幕的时候，表现为 fixed。

[example](./example/position_sticky1.html)

`position:sticky要想生效，top属性或者left属性（看滚动方向）是必须有明确的计算值的，否则fixed的表现不会出现。`

#### 富有层次的滚动交互

[example](./example/position_sticky2.html)

_sticky 元素的效果完全受制于父级元素们_，这和`position:fixed`定位有着根本性的不同，fixed 元素直抵页面根元素，其他元素对其 left/top 定位无法限制。

- 父级元素不能有任何`overflow:visible`以外的 overflow 设置，否则没有粘滞效果。因为改变滚动容器（即使没有出现滚动条），因此，如果你的`position:sticky`无效，看看是不是某一个祖先元素设置了`overflow: hidden`。
- 父级元素也不能设置固定的`height`高度值，否则也没有粘滞效果。(父级元素的高度大于所需高度否则会遮挡部分滚动。)
- 同一个父级容器中的 sticky 元素，如果定位值相等，则会重叠；如果属于不同父元素，则会挤开原来的元素，形成依次占位的效果。
- sticky 定位，不仅可以设置 top，基于滚动容器上边缘定位；还可以设置`bottom`，也就是相对底部粘滞。如果是水平滚动，也可以设置`left`和`right`值。

#### 层次滚动实现原理

```
<article>
    <section>
        <h4>网曝王宝强殴打马蓉</h4>
        <content>
            <p>12月2日，有网友爆料称...</p>
        </content>
        <footer>网友评论：...</footer>
    </section>
    <section>
        <h4>知情人爆料称马蓉闯入王宝强家拿剪刀对峙</h4>
        <content>
            <p>...</p>
        </content>
        <footer>网友评论：...</footer>
    </section>
    ...
</article>
```

其中，标题和底部设置了 sticky 定位

```
article h4,
h4 {
    position: sticky;
    top: 0;
    z-index: 1;
}
content {
    position: relative;
}
footer {
    position: sticky;
    bottom: 50vh;
    z-index: -1;
}
```

由于每一段短视频都在 selection 标签中，属于不同的父元素，因此，滚动的时候，后面的新闻标题才能把前面已经 sticky 定位的新闻标题推开。

两个关键点：

- 定位用的`bottom`，效果和`top`正好是对立的，设置 top 粘滞的元素随着往下滚动，是先滚动后固定；而设置 bottom 粘滞的元素则是先固定，后滚动。
- `z-index:-1`隐藏评论。

