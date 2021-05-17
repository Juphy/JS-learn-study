## canvas

```html
<canvas id="canvas"></canvas>
```
```js
let canvas = documnet.getElementById('canvas');
let context = canvas.getContext('2d');

context.fillStyle = "rgb(222, 155, 155)";
context.fillRect(0, 0, canvas.width, canvas.height);
```
- canvas.width设置画布的宽
- canvas.height设置画布的高
- context.fillStyle设置绘制区域的颜色
- context.fillRect设置绘制区域大小为坐标点为左上角固定宽高的距形

### 设置渐变色
> 线性渐变

```JS
createLinearGradient(x0: number, y0: number, x1: number, y1: number)：(x0, y0)连接(x1, y1)方向上进行渐变
比如(0, 0)到(canvas.width, 0)是水平方向上的渐变。
任意方向上的线性渐变：(0, 0)到(canvas.width, canvs.height)对角线上的渐变

addColorStop(offset: number; color: string)：设置渐变色值起始的比例位置
```
> 径向渐变

```JS
createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number)
r0和r1比较哪个大，那么就从那个到半径晓得方向进行渐变，而不是从里到外或者从外到里。
```

### 画布的变换
默认情况下画布的坐标系是左上角。
- context.beginPath()表示开始一段新的路径,下次填充只会修改此段路径内容
- context.moveTo(x, y)路径的起始点
- context.lineTo(x, y)链接到下一个点
- context.strokeStyle = gradient 设置未闭合路径的颜色
- context.stroke() 路径为线

> 画布的translate`[`平移`]`

