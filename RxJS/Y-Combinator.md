     在现代编程语言中函数都是具名的，而在传统的Lambda Calculus中，函数都是没有名字的，这样就出现了一个问题，如何在Lambda Calculus中实现递归函数，即匿名递归函数。Haskell B.Curry 发现了一种不定点组合子——Y Combinator，用于解决匿名递归函数实现的问题。Y = λf.(λx.f(xx))(λx.f(xx))

### lambda表达式
把一个lambda表达式解释为一个js函数：
- "λ" 字符可以看作 function 声明，"."字符前为参数列表，"."字符后为函数体
- lambda表达式不能被命名（赋值给变量）。这也就是lambda验算需要引入Y组合子的原因
- lambda表达式只允许定义一个参数

|使用|lambda表达式|javascript箭头函数|javascript函数表达式|
|:--:|:--|:--|:--|
|函数|λx.x+1|x=>x+1|(function(x){return x+1;})|
|函数调用|(λx.x+1)4|(x=>x+1)(4)|(function(x){return x+1;})(4)|

### 组合子与不动点

组合子对照 js 可以理解为：`函数体内，没有使用外部变量。`

不动点是函数的一个特征：`对于函数 f(x)，如果有变量  a 使得  f(a)=a 成立，则称 a 是函数 f 上的一个不动点。`

### 递归
> 普通递归

递归就是函数不断调用自身，一个正常的递归函数应该有一个状态，每次调用不断的递进状态，最终可以通过判断状态结束递归。

> 匿名函数递归

由于不能给函数命名，需要把函数作为参数传入一个高阶函数，在高阶函数中，就可以使用参数名来引用函数，相当于变相的给函数命名。
```
let invokeWithSelf = f => f(f);
相当于：
function invokWithSelf(f){
    return f(f);
}

invokeWithSelf(invokeWithSelf)
相当于：
(f=>f(f))(f=>f(f))
```
```
//首先需要有一个参数来保存递归状态
var func = f => p => f(f)(p);

//加上状态改变和判断
var func = f => p => judge(p) ? f(f)(step(p)) : value;

//增加计算
var func = f => p => judge(p) ? calc(f(f)(step(p)),p) : value;
```

