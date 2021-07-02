### ID锚点定位
> a标签的href属性中写入#ID，需要跳转到的div给上id="ID"
> window.location.hash="ID"

锚点定位的问题：浏览器的URL会发生变化，如果刷新可能会出现问题。
```
<h2>
    <a href="#div1">to div1</a>
    <a href="#div2">to div2</a>
    <a href="#div3">to div3</a>
</h2>
<div id="div1">div1</div>
<div id="div2">div2</div>
```
### 点击锚点时，页面借用animate属性进行滚动到相应的DIV
如果页面复杂的话，偏移值可能会发生变化需要算法辅助
```html
    <h2>
        <a id="div1Link">to div1</a>
        <a id="div2Link">to div2</a>
        <a id="div3Link">to div3</a>
    </h2>
    <div id="div1" style="background: brown">div1</div>
    <div id="div2" style="background: burlywood">div2</div>
    <div id="div3" style="background: cadetblue">div3</div>
```
```JavaScript
<script type="text/javascript" src="http://code.jquery.com/jquery-1.8.0.min.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        $("#div1Link").click(function () {
            $("html, body").animate({
                scrollTop: $("#div1").offset().top
            }, { duration: 500, easing: "swing" });
            return false;
        });
        $("#div2Link").click(function () {
            $("html, body").animate({
                scrollTop: $("#div2").offset().top
            }, { duration: 500, easing: "swing" });
            return false;
        });
        $("#div3Link").click(function () {
            $("html, body").animate({
                scrollTop: $("#div3").offset().top
            }, { duration: 500, easing: "swing" });
            return false;
        });
    });
</script>
```

### srollIntoView
scrollIntoView()可以在所有的HTML元素上调用，通过滚动浏览器窗口或某个容器元素，
调用元素就可以出现在视窗中。如果给该方法传入true作为参数，或者不传入任何参数，那么
窗口滚动之后会让调动元素顶部和视窗顶部尽可能齐平。如果传入false作为参数，调用元素
会尽可能全部出现在视口中（可能的话，调用元素的底部会与视口的顶部齐平。）不过顶部
不一定齐平。
参数：true -> 元素上边框与视窗顶部齐平  false -> 元素下边框与视窗底部齐平
问题：滚动不平滑，需要设置`scroll-behavior: smooth`
```html
    <h2>
        <a id="Link1">to div1</a>
        <a id="Link2">to div2</a>
        <a id="Link3">to div3</a>
    </h2>
    <div id="div1" style="background: brown">div1</div>
    <div id="div2" style="background: burlywood">div2</div>
    <div id="div3" style="background: cadetblue">div3</div>
```
```JavaScript
    document.querySelector('#Link1').onclick = function () {
        document.querySelector('#div1').scrollIntoView(true);
    }
    document.querySelector('#Link2').onclick = function () {
        document.querySelector('#div2').scrollIntoView(true);
    }
    document.querySelector('#Link3').onclick = function () {
        document.querySelector('#div3').scrollIntoView(true);
    }
```

