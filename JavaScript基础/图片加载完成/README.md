### load事件
```JavaScript
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>img - load event</title>
</head>
<body>
<img id="img1" src="http://pic1.win4000.com/wallpaper/f/51c3bb99a21ea.jpg">
<p id="p1">loading...</p>
<script type="text/javascript">
    img1.onload = function() {
        p1.innerHTML = 'loaded'
    }
</script>
</body>
</html>
```
基本所有浏览器都支持，可能存在的问题：当存在多张图片且数据会刷新的情况下，
会导致并不一定会捕捉到load事件，可能提前完成。

### readystatechange事件(IE)
```JavaScript
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>img - readystatechange event</title>
</head>
<body>
<img id="img1" src="http://pic1.win4000.com/wallpaper/f/51c3bb99a21ea.jpg">
<p id="p1">loading...</p>
<script type="text/javascript">
    img1.onreadystatechange = function() {
        if(img1.readyState=="complete"||img1.readyState=="loaded"){
            p1.innerHTML = 'readystatechange:loaded'
        }
    }
</script>
</body>
</html>
```
readyState为complete和loaded则表明图片已经加载完毕。测试`IE6-IE10支持该事件，其它浏览器不支持`。

### img的complete属性
```JavaScript
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>img - complete attribute</title>
</head>
<body>
<img id="img1" src="http://pic1.win4000.com/wallpaper/f/51c3bb99a21ea.jpg">
<p id="p1">loading...</p>
<script type="text/javascript">
    function imgLoad(img, callback) {
        var timer = setInterval(function() {
            if (img.complete) {
                callback(img)
                clearInterval(timer)
            }
        }, 50)
    }
    imgLoad(img1, function() {
        p1.innerHTML('加载完毕')
    })
</script>
</body>
</html>
```
轮询不断监测img的complete属性，如果为true则表明图片已经加载完毕，停止轮询。该属性所有浏览器都支持。

### 借用jquery的ready与load
ready只是DOM结构加载完毕（此时图片没有加载完成）load是指dom的生成和资源（比如flash、图片）出来之后才执行.

### 非浏览器环境，可使用Imgae
```JavaScript
let img = new Image();
img.src = "....jpg";
img.onload = function(){
    // 加载完成
}
```
```JavaScript
// ES6
new Promise((resolve, reject)=>{
    let img = new Image();
    img.src = '...jpg';
    img.onload = function(){
        // 加载完成
        resolve(img)
    }
}).then(img =>{
    // code
})
```
