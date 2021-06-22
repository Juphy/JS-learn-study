### counter-reset
创建或重置一个或多个计数器。

### counter-increment
递增一个或多个计数器值。

counter-reset和counter-increment通常用于content属性。在content中庸counter读取定义的计数器。先counter-reset重置计数器，再counter-increment开始计数。

IE8只有指定!DOCTYPE才支持counter-reset属性。

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>菜鸟教程(runoob.com)</title>
<style>
body {counter-reset:section;}
h1 {counter-reset:subsection;}
h1:before
{
	counter-increment:section;
	content:"Section " counter(section) ". ";
}
h2:before 
{
	counter-increment:subsection;
	content:counter(section) "." counter(subsection) " ";
}
</style>
</head>

<body>

<p><b>注意:</b> 仅当 !DOCTYPE已经定义 IE8支持 这个属性.</p>

<h1>HTML tutorials</h1>
<h2>HTML Tutorial</h2>
<h2>XHTML Tutorial</h2>
<h2>CSS Tutorial</h2>

<h1>Scripting tutorials</h1>
<h2>JavaScript</h2>
<h2>VBScript</h2>

<h1>XML tutorials</h1>
<h2>XML</h2>
<h2>XSL</h2>

</body>
</html>
```