## canvas
canvas是一种立即模式的渲染方式，不会存储额外的渲染信息。Canvas 受益于立即模式,允许直接发送绘图命令到 GPU。但若用它来构建用户界面，需要进行一个更高层次的抽象。例如一些简单的处理,比如当绘制一个异步加载的资源到一个元素上时，将一个元素绘制在另一个元素之上的简单方法可能会出现问题,如在图片上绘制文本。在HTML中，由于元素存在顺序，以及 CSS 中存在 z-index，因此是很容易实现的。
dom渲染是一种保留模式，保留模式是一种声明性API，用于维护绘制到其中的对象的层次结构（z-index）。保留模式 API 的优点是，对于你的应用程序，他们通常更容易构建复杂的场景，例如 DOM。通常这都会带来性能成本,需要额外的内存来保存场景和更新场景，这可能会很慢。

## "被污染"的canvas
尽管不通过CORS就可以在画布中使用图片，但是这会污染画布，一旦画布被污染，你就无法读取其数据，你不能再使用画布的 toBlob(), toDataURL() 或 getImageData() 方法，调用它们会抛出安全错误。这种机制可以避免未经许可拉取远程网站信息而导致的用户隐私泄露。如果是本地资源，或者base64生成的图片资源，就不存在这种问题。

如果图片是外链地址，后台需要设置CORS，就是设置Access-Control-Allow-Origin: *，然后在给图片的crossOrigin属性设置为'Anonymous'。

## 外链图片转为base64（后端处理）
```
// nodejs处理
// 图片的地址url
let http = require('http'), path = require('path');
if(url.includes('https')){
    http = require('https');
}
http.get(url, function(res){
    var chunks=[]; // 用于保存网路请求不断加载传输的缓冲数据
    var size = 0; // 保存缓冲数据的总长度
    res.on('data', function(chunk){
        chunks.push(chunk);  //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，node会把接收到的数据片段逐段的保存在缓存区（Buffer），这些数据片段会形成一个个缓冲对象（即Buffer对象），而Buffer数据的拼接并不像字符串那样拼接（因为一个中文符占三个字节，如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，直接字符串拼接会导致乱码，为避免乱码，所以将缓冲数据推入到chunks数组中）
        size += chunk.length; // 累计缓冲数据的长度
    });
    res.on('end', function(err){
        var data = Buffer.concat(chunks, size); // Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
        //可通过Buffer.isBuffer(data)方法判断变量data是否为一个Buffer对象
        var base64Img = data.toString('base64'); // 将Buffer对象转换为字符串并以base64编码格式显示
        base64Img = 'data:image/' + path.extname(url).substring(1)+';base64,'+base64Img;
    })
})
```

## 本地图片转为base64（通过input上传）
```
<input type="file" name="image" accept="image/*" id="input">
var input = document.getElemnetById('input');
input.addEventListener('change', function(e){
    var files = e.target.files;
    let reader = new FileReader();
    reader.onload = function(e){
        reader.result  // base64地址
    };
    reader.readAsDataURL(files[0]);
})
```


## 图片转为canvas
```
let canvas = document.createElement('canvas');
canvas.width= 640;
canvas.height = 686;
let ctx = canvas.getContext('2d');
ctx.fillStyle="#fff";
ctx.fillRect(0,0,640,686);
let loadImageSync = (src)=>{
    return new Promise(resolve =>{
        let img = new Image();
        // 外链图片，如果图片后台设置允许跨域
        // img.setAttribute('crossOrigin', 'Anonymous')

        // 如果图片无法跨域可以用接口转为base64
        img.onload = () =>{
            resolve(img);
        }
        img.src = src;
    })
}
```

## 绘制文本
> fillText(text,x,y[,maxWidth])

文本字符串和开始绘制的xy坐标，以及非必填宽度，但是画布一次只能绘制一行文本。

> strokeText(text, x, y, maxWidth?)

用描边的形式绘制指定的文本Text，其中也指定了绘制的坐标（x， y），还有最后一个可选参数，最大的宽度，如果所绘制的文本超过了指定的maxWidth，则文本会按照最大的宽度来绘制，那么文字之间的间距就将减少，文字可能被压缩。

> measureText(text)

在当前的文字样式下，测量绘制文本text会占据的宽度值，返回一个对象，这个对象有一个width属性，必须先设置文本样式，再来测量才行。在实际时，常常以'W'字母测量出来的宽度值加上一点点，就大致是当前文本的高度值。

### 文本属性
- font 指定文本的字体大小，字体集，字体样式等，但在canvas中，line-height被强制设置为normal，会忽略其他设置的值。
- textAlign 设置文本的水平对齐方式，可选值：left，right，center，start，end。默认值是start。
- textBaseline 设置文本的垂直对齐方式，可选值：top，hanging，middle，alphabetic，ideographic，bottom。默认值是alphabetic。

## 绘制图片
> 第一参数image，不仅可以使图片元素，实际上还可以是canvas元素，video元素
> drawImage(image, dx, dy)

直接将图片绘制到指定的canvas坐标上，图片由image传入，坐标由dx和dy传入。

> drawImage(image,dx,dy,dw,dh)

指定图片绘制的宽度和高度，宽高由dw和dh传入。

> drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)

第一参数是待绘制的图片元素，第二个到第五个参数，指定了原图片上的坐标和宽高，这部分区域将会被绘制到canvas中，而其他区域将忽略，最后四个参数跟形式二一样，指定了canvas目标中的坐标和宽高。分别指定了原图片被绘制的区域和目标canvas的区域，用过sx,sy,sw,sh我们可以选择图片中某一部分区域，也可以是完整的区域，dx,dy,dw,dh待绘制目标canvas区域。

### 图像像素
- getImageData
ctx.getImageData(sx,sy,sw,sh)，接受四个参数，表示canvas区域的某一个矩形区域，这个矩形区域的左上角坐标是(sx,sy)，宽高是sw 和sh，它的返回值是一个ImageData类型的对象，包含的属性有width，height，data。
    - ImageData.width，无符号长整型，表示这个图像区域的像素的宽度。
    - ImageData.height，无符号长整型，表示这个图像区域的像素的高度。
    - ImageData.data，一个Uint8ClampedArray数组，数组里每4个单元，表示一个像素值。一个像数值用RGBA表示的，这4个单元分别表示R，G，B，A，表示意思是红，绿，蓝，透明度，取值范围是0～255。
ctx.getImageData(sx,sy,sw,sh)，如果参数表示的矩形区域超出了canvas的区域，那么超出的部分将是用黑色的透明度为0的RGBA值表示，也就是(0,0,0,0)。
Imagedata.data = Imagedata.width×Imagedata.height×4，每个像素是由四个分量组成（r，g，b，a）。

- putImageData
通过getImageData得到canvas某一个矩形区域的像素数据之后，我们可以通过改变这个imageData.data数组里的颜色分量值，再将改变后的ImageData通过putImageData方法绘制到canvas上。
    - ctx.putImageData(imgData,dx,dy)，这种方式，将imgData绘制到canvas区域(dx,dy)坐标处，绘制到canvas的区域的矩形大小就是imgData的矩形的大小。
    - ctx.putImageData(imgData,dx,dy,dirtyX,dirtyY,dirtyW,dirtyH)，不仅指定了canvas区域(dx,dy)，也指定了imgData脏数据区域的(dirtyX,dirtyY)和宽高dirtyW，dirtyH。这种形式，可以只将imgData种某一块区域绘制到canvas上。
```
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let img = document.createElement('img');
img.src = 'google.png';
img.addEventListener(
 'load',
 () => {
   let imgWidth = img.width; //获取图片的宽度
   let imgHeight = img.height; //获取图片的高度
   let targetWidth = canvasWidth; //指定目标canvas区域的宽度
   let targetHeight = (imgHeight * targetWidth) / imgWidth; //计算出目标canvas区域的高度
   ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
   //操作ImageData像素数据
   let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
   oprImageData(imgData, (r, g, b, a) => {
     if (a === 0) {
       return [r, g, b, 255]; //将透明的黑色像素值改变为不透明， 透明度=a/255
     }
     return [r, g, b, a];
     return [255-r, 255-g, 255-b, a]; // 反向颜色
     let avg = (r, g, b, a)/3;
     return [avg, avg, avg, a] //灰度
   });
   //将imgData绘制到canvas的中心。超出canvas区域将被自动忽略
   ctx.putImageData(imgData, canvasWidth / 2, canvasHeight / 2);
 },
 false,
);

// 遍历像素数据
function oprImageData(imgData, oprFunction) {
 let data = imgData.data;
 for (let i = 0, l = data.length; i < l; i = i + 4) {
   let pixel = oprFunction(data[i], data[i + 1], data[i + 2], data[i + 3]);
   data[i] = pixel[0];
   data[i + 1] = pixel[1];
   data[i + 2] = pixel[2];
   data[i + 3] = pixel[3];
 }
}
```
- createImageData
    - ctx.createImageData(width,height)，可以指定宽高，创建一个ImageData对象，ImageData.data中的像素值都是一个透明的黑色，也就是（0，0，0，0）。
    - ctx.createImageData(imgData)，可以指定一个已经存在的ImageData 对象来创建一个新的ImageData对象，新创建的ImageData对象的宽高与参数中的ImageData 的宽高一样，但是像素值就不一样了，新创建出来的ImageData的像素值都是透明的黑色，也就是（0，0，0，0）。