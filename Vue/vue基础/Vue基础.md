### Object.freeze()
阻止修改现有property，意味着系统无法在追踪变化
```
var data = {
  a: 1
}

var vm = new Vue({
  data: data
})

vm.a == data.a => true

//设置property会影响到原始数据
vm.a = 2;
data.a // => 2

data = 3
vm.a // => 3
```
当这些数据改变时，视图会进行重新渲染，但是`只有当实例被创建时就已经存在于data中的property才是响应式的`，如果添加新的property，vm.b = 1，对b的改变将不会触发任何视图的更新。

### 除了数据 property，Vue 实例还暴露了一些有用的实例 property 与方法。它们都有前缀 $，以便与用户定义的 property 区分开来。
```
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

### 生命周期

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。

**不要在选项property或毁掉上使用箭头函数，比如created: () => console.log(this.a) 或 vm.$watch('a', new Value => this.myMethod()).因为箭头函数没有this，this会变作为变量一直向上级词法作用域查找，知道找到为止。**

![生命周期图示](../assets/images/lifecycle.png)


### 模板语法
Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

> 数据绑定使用双大括号的文本插值

> v-once：只能执行一次性地插值，当数据改变时，插值处的内容不会更新。
```
<span v-once>{{msg}}</span>
```

> v-html: 双大括号将数据解释为普通文本，而非HTML代码。
```
<span v-html="msg"></span>
```
*不能使用v-html来复合局部模板，因为 Vue 不是基于字符串的模板引擎*
*你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。*

> v-bind: 双括号语法不能作用在attribute上，需要使用v-bind
```
<div v-bind:id="dynamicId"></div>
```
如果attribute的值是布尔，
```
<button v-bind:disabled="isButtonDisabled">Button</button>
```
如果 isButtonDisabled 的值是 null、undefined 或 false，则 disabled attribute 甚至不会被包含在渲染出来的`<button>`元素中。

*模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不应该在模板表达式中试图访问用户定义的全局变量。*

### 指令
带有 v- 前缀的特殊 attribute。指令 attribute 的值预期是单个 JavaScript 表达式 。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

> v-if

> v-bind: 一些指令能够接收一个“参数”，在指令名称之后以冒号表示，`v-bind`指令可以用于相应式地更新，v-bind:href="url"

> v-on: 用于监听DOM事件

### **2.6.0**: 用方括号起来的JavaScript表达式作为一个指令的参数。
```
<a v-bind:[attributeName]="url"> ... </a>
```
这里的`attributeName`会被作为一个JavaScript表达式进行动态求值，求得的值会作为最终的参数来使用。同样，可以使用动态参数为一个动态的事件名绑定处理函数：
```
<a v-on:[eventName]="doSomething"> ... </a>
```
当`eventName`的值为"focus"时，就等价于`v-on: focus`.

动态参数预期会求出一个字符串，异常情况下值为null，这个特殊的null值可以被显性地用于移除绑定，任何其他类型非字符串的值将会触发一个警告。

动态参数表达式有一些语法约束，因为某些字符，如`空格`和`引号`，放在HTML attribute名里是无效的：
```
<a v-bind:['foo' + bar]="value"> ... </a>
```
解决的方法是使用没有空格或引号的表达式，或引用属性替代这种复杂表达式。

在DOM中使用模板时，还需要避免使用大写字符来命名键名，因为浏览器会把attribute名全部强制转为小写：
```
<a v-bind:[someAttr]="value"> ... </a>
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
```

### 修饰符
以半角句号.指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。如：`.prevent`修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()。
```
<form v-on:submit.prevent="onSubmit">...</form>
```

### 缩写
`v-`前缀作为一种视觉提示，用来识别模板中 Vue 特定的 attribute。当你在使用 Vue.js 为现有标签添加动态行为 (dynamic behavior) 时，`v-`前缀很有帮助，然而，对于一些频繁用到的指令来说，就会感到使用繁琐。同时，在构建由 Vue 管理所有模板的单页面应用程序 (SPA-single page application) 时，`v-`前缀也变得没那么重要了。因此，Vue 为`v-bind`和`v-on`这两个最常用的指令，提供了特定简写：

> v-bind

```
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>
```

> v-on

```
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```
