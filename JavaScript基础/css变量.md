### 变量的声明

声明变量的时候，变量名前面要加两根连词线(--)，css 自定义属性，\$用于 Sass，@用于 Less。

```
  --main-color: #4d4e53;
  --main-bg: rgb(255, 255, 255);
  --logo-border-color: rebeccapurple;

  --header-height: 68px;
  --content-padding: 10px 20px;

  --base-line-height: 1.428571429;
  --transition-duration: .35s;
  --external-link: "external link";
  --margin-top: calc(2vh + 20px);
```

**变量名大小写敏感**

### var()函数

`var()`函数用于读取变量。`var()`函数使用第二个参数，表示变量的默认值，如果该变量不存在，就会使用这个默认值。

- 第二个参数不处理内部的逗号或空格，都视为参数的一部分。

```
color: var(--foo);
color: var(--foo, #7F583F);
var(--font-stack, "Roboto", "Helvetica");
var(--pad, 10px 15px 20px);
```

- 用于变量的声明，变量值只能用作属性值，不能用作属性名

```
:root{
    --primary-color: red;
    --logo-text: var(--primary-color);
}
.foo{
    --side: margin-top;
    // 无效
    var(--side): 20px;
}
```

### 变量值的类型

- 如果变量值是一个字符串，可以与其他字符串拼接。

```
--bar: 'hello';
--foo: var(--bar)' world';
body:after{
    content: '--screen-category: 'var(--screen-category);
}
```

- 如果变量值是数值，不能与数值单位直接连用

```
.foo{
    --gap: 20;
    // 无效
    margin-top: var(--gap)px;
}
```

- 数值与单位直接写在一起，是无效的，必须使用`calc()`函数连接。

```
.foo{
    --gap: 20;
    margin-top: calc(var(--gap)*1px)
}
```

- 如果变量值带有单位，就不能写成字符串

```
// 无效
.foo{
    --foo: '20px';
    font-size: var(--foo);
}

// 有效
.foo{
    --foo: 20px;
    font-size: var(--foo);
}
```

### 作用域

同一个 css 变量，可以在多个选择器内声明，读取的时候，优先级最高的声明生效。这与 CSS 的"层叠"（cascade）规则是一致的。

```
<style>
    :root{  --color: blue;}
    div{ --color: green; }
    #alert{ --color: red; }
    *{ color: var(--color) }
</style>
<p>蓝色</p>
<div>绿色</div>
<div id="alert">红色</div>
```

**变量的作用域就是它所在的选择器的有效范围**

```
body{
    --foo: #7F583F;
}
.content{
    --bar: #F7EFD2;
}
```

变量`--foo`的作用域是`body`选择器的生效范围，`--bar`的作用域是`.content`选择器的生效范围。
由于这个原因，全局的变量通常放在根元素`:root`里面，确保任何选择器都可以读取它。

### 响应式布局

响应式布局的`media`命令里面声明变量，使得不同的屏幕宽度有不同的变量值。

```
body{
    --primary: #7F583F;
    --secondary: #F7EFD2;
}

a{
    color: var(--primary);
    text-decoration-color: var(--secondary);
}

@media screen and (min-width: 768px){
    body{
        --primary: #F7EFD2;
        --secondary: #7F583F;
    }
}
```

### 兼容性处理

对于不支持 CSS 变量的浏览器，可以采用如下写法：

```
a{
    color: #7F583F;
    color: var(--primary);
}
```

也可以使用`@support`命令进行检测

```
@supports((--a: 0)){
    // supported
}

@supports(not(--a: 0)){
    // not supported
}
```

### JavaScript 操作

JavaScript 检测浏览器是否支持 CSS 变量

```
let isSupported =
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('--a', 0);
if(isSupported){
    // supported
}else{
    // not supported
}
```

JavaScript 操作的 CSS 变量：

```
// 设置变量
document.body.style.setProperty('--primary', '#7F583F');

// 读取变量
document.body.style.getPropertyValue('--primary').trim();

// 删除变量
document.body.style.removeProperty('--primary');
```

JavaScript 可以将任意值存入样式表：

```
let style = document.documentElement.style;
document.addEventListener('mousemove', e =>{
    style.setProperty('--mouse-x', e.clientX);
    style.setProperty('--mouse-y', e.clientY);
})
```

**CSS 变量不合法的缺省特性**

```
body{
    --color: 20px;
    background-color: #369;
    background-color: var(--color, #cd0000);
}
```
对于CSS变量，只要语法是正确的，就算变量里面的值是乱七八糟的东西，也是会正常的声明解析，如果发现变量值是不合法的，
