## Vue

### nextTick

由于 VUE 的数据驱动视图更新，是异步的，即修改数据的当下，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。

触发机制： 在同一事件循环中的数据变化后，DOM 完成更新，立即执行 nextTick(callback)内的回调。

```Vue
   <template>
    <div>
      <div ref="username">{{ username }}</div>
      <button @click="handleChangeName">click</button>
    </div>
  </template>
```

```JS
    export default {
    data () {
      return {
        username: 'PDK'
      }
    },
    methods: {
      handleChangeName () {
        this.username = '彭道宽'
        console.log(this.$refs.username.innerText) // PDK
      }
    }
  }
```
Vue.js在默认情况下，每次触发某个数据的setter方法后，对应的watcher对象其实会被push进一个队列queue中，在下一个tick的时候将这个队列queue全部拿出来run一遍。Vue异步执行DOM更新。只要观察到数据变化，Vue就将开启一个队列，并缓冲在同一个事件循环中发生的所有数据改变。如果同一个watcher被多次触发，只会被推到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作上非常重要。然后在下一次事件循环tick中，Vue刷新队列并执行实际工作。

Vue在修改数据的时候，不会立马就去修改数据。刷新队列时，组件会在事件循环队列清空时的下一个 tick 更新, 为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。