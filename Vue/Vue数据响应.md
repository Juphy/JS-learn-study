### Vue 中 data 里面声明的数据才具有响应式的特性

vue 在数据初始化的时候会对 data，computed，watcher 中的属性进行依赖收集，如果支持 proxy，则直接使用 proxy 代理拦截，好处是可以深层次的进行拦截，如果不支持 proxy，则使用 object.defineProperty 来进行数据拦截依赖收集。但是 object.defineProperty 无法做到深层次的监听，所以是对属性进行递归算法去实现依赖收集，如果在初始化是没有将属性收集进去，则很有可能没有收集到依赖，这种情况则需要使用$set，在$set 中重新进行依赖收集。
还有一种情况是直接操作数组的下标，也不会发生 dom 更新，其实 vue 对数组的 push，pop，unshift，shift，splice，sort，reverse 这几个方法进行了重新定义，如果使用这几个方法对数组进行操作，是可以见听到数据变化的。
还有一种情况就是你的数据变更在 dom 挂在之前，比如，数组要放到一个容器里渲染，可是容器还没有挂在出来。导致找不到 dom，这种情况就需要使用$nextTick。

### Vue 数据更新了但页面没有更新

1. Vue 无法检测实例被创建时不存在于 data 中的 property
由于 Vue 会在初始化实例时对 property 执行`getter`/`setter`转化，所以 property 必须在`data`对象上才能让 Vue 将它转化成响应式的.

```
var vm = new Vue({
  data:{},
  // 页面不会变化
  template: '<div>{{message}}</div>'
})
vm.message = 'Hello!' // `vm.message` 不是响应式的
```

2. Vue 无法检测对象 property 的添加或移除
   由于 ES5 的限制, Vue.js`不能检测到对象属性的添加或删除`。因为 Vue.js 在初始化实例时将属性转化为`getter/setter`,所以属性必须在`data`对象上才能让 Vue.js 转换它，才能让它是响应的。

```
var vm = new Vue({
  data:{
    obj: {
      id: 001
    }
  },
  // 页面不会变化
  template: '<div>{{ obj.message }}</div>'
})

vm.obj.message = 'hello' // 不是响应式的
delete vm.obj.id       // 不是响应式的

=>
// 动态添加 - Vue.set
Vue.set(vm.obj, propertyName, newValue)

// 动态添加 - vm.$set
vm.$set(vm.obj, propertyName, newValue)

// 动态添加多个
// 代替 Object.assign(this.obj, { a: 1, b: 2 })
this.obj = Object.assign({}, this.obj, { a: 1, b: 2 })

// 动态移除 - Vue.delete
Vue.delete(vm.obj, propertyName)

// 动态移除 - vm.$delete
vm.$delete(vm.obj, propertyName)
```

3. Vue 不能检测通过数组索引直接修改一个数组项
由于 JavaScript 的限制，Vue 不能检测数组和对象的变化，性能代价和获得用户体验不成正比。
```
数组这些可以改变原数组的方法是可以被Vue检测到。
push()

pop()

shift()

unshift()

splice()

sort()

reverse()
```
```
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的

=>
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

// vm.$set
vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

> Object.defineProperty() 可以监测数组的变化

```
Object.defineProperty()可以用来检测数组的变化，但对数组新增一个属性（index）不会监测到数据变化，因为无法监测到新增数组的下标（index）,删除一个属性（index）也是。

var arr = [1, 2, 3, 4]
arr.forEach(function(item, index) {
    Object.defineProperty(arr, index, {
    set: function(value) {
      console.log('触发 setter')
      item = value
    },
    get: function() {
      console.log('触发 getter')
      return item
    }
  })
})
arr[1] = '123'  // 触发 setter
arr[1]          // 触发 getter 返回值为 "123"
arr[5] = 5      // 不会触发 setter 和 getter
```

4. Vue 不能监测直接修改数组长度的变化
   由于 JavaScript 的限制，Vue 不能检测数组和对象的变化

```
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items.length = 2 // 不是响应性的

vm.items.splice(newLength)
```

5. 在异步更新执行之前操作 DOM 数据不会变化
   Vue 在更新 DOM 时是异步执行的，只要监听到数据变化，Vue 将开启一个队列，并在缓冲同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环`tick`中，Vue 刷新队列并执行实际（已去重）工作。Vue 在内部中对异步队列使用原生的`Promise.then`,`MutationObserver`和`setImmediate`,如果执行环境不支持，则会采用`setTimeout(fn, 0)`代替。

```
<div id="example">{{message}}</div>

var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
vm.$el.style.color = 'red' // 页面没有变化

=>
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
//使用 Vue.nextTick(callback) callback 将在 DOM 更新完成后被调用
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
  vm.$el.style.color = 'red' // 文字颜色变成红色
})
```

> 异步更新带来的数据响应的误解

```
<div id="example">{{message.text}}</div>

var vm = new Vue({
  el: '#example',
  data: {
    message: {},
  }
})
vm.$nextTick(function () {
  this.message = {}
  this.message.text = '我更新啦！'
})
```

我们在 data 对象中声明了一个 message 空对象，然后在下次 DOM 更新循环结束之后触发的异步回调中，执行了如下两段代码：

```
this.message = {};
this.message.text = '我更新啦！'
```

到这里，模版更新了，页面最后会显示 我更新啦！。模板更新了，应该具有响应式特性，如果这么想那么你就已经走入了误区。

`但模板切切实实已经更新了，这又是怎么回事呢？`

那是因为 Vue.js 的 DOM 更新是异步的，即当 setter 操作发生后，指令并不会立马更新，指令的更新操作会有一个延迟，当指令更新真正执行的时候，此时 text 属性已经赋值，所以指令更新模板时得到的是新值。
模板中每个指令/数据绑定都有一个对应的 watcher 对象，在计算过程中它把属性记录为依赖。之后当依赖的 setter 被调用时，会触发 watcher 重新计算 ，也就会导致它的关联指令更新 DOM。
具体流程如下：

- 执行 this.message = {}; 时， setter 被调用。
- Vue.js 追踪到 message 依赖的 setter 被调用后，会触发 watcher 重新计算。
- this.message.text = '我更新啦！'; 对 text 属性进行赋值。
- 异步回调逻辑执行结束之后，就会导致它的关联指令更新 DOM，指令更新开始执行。

所以真正的触发模版更新的操作是 this.message = {};这一句引起的，因为触发了 setter，所以单看上述例子，具有响应式特性的数据只有 message 这一层，它的动态添加的属性是不具备的。

6. 循环嵌套层级太深，视图不更新？

```
vm.$forceUpdate()
```

7. 路由参数变化时，页面不更新（数据不更新）
   拓展一个因为路由参数变化，而导致页面不更新的问题，页面不更新本质上就是数据没有更新。
   原因：路由视图组件引用了相同组件时，当路由参会变化时，会导致该组件无法更新，也就是我们常说中的页面无法更新的问题。

```
<div id="app">
  <ul>
    <li><router-link to="/home/foo">To Foo</router-link></li>
    <li><router-link to="/home/baz">To Baz</router-link></li>
    <li><router-link to="/home/bar">To Bar</router-link></li>
  </ul>
  <router-view></router-view>
</div>

const Home = {
  template: `<div>{{message}}</div>`,
  data() {
    return {
      message: this.$route.params.name
    }
  }
}

const router = new VueRouter({
  mode:'history',
    routes: [
    {path: '/home', component: Home },
    {path: '/home/:name', component: Home }
  ]
})

new Vue({
  el: '#app',
  router
})
```
我们在路由构建选项 routes 中配置了一个动态路由 '/home/:name'，它们共用一个路由组件 Home，这代表他们复用 RouterView 。

当进行路由切换时，页面只会渲染第一次路由匹配到的参数，之后再进行路由切换时，message 是没有变化的。
- 通过`watch`监听`$route`的变化
```
const Home = {
  template: `<div>{{message}}</div>`,
  data() {
    return {
      message: this.$route.params.name
    }
  },
  watch: {
       '$route': function() {
       this.message = this.$route.params.name
    }
    }
}
...
new Vue({
  el: '#app',
  router
})
```
- 给`<router-view>`绑定 key 属性，这样 Vue 就会认为这是不同的`<router-view>`。弊端：如果从`/home`跳转到`/user`等其他路由下，我们是不用担心组件更新问题的，所以这个时候`key`属性是多余的。
```
<div id="app">
  ...
  <router-view :key="key"></router-view>
</div>
```