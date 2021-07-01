### Mixins
页面的风格不同，但是执行的方法和需要的数据非常的相似。不管是写成两个组件还是保留一个并且兼容另一个都是不合理的，因为组件写成2个，不仅麻烦而且维护麻烦；做兼容但是页面逻辑混乱，必然不清晰。

vue 创建高阶组件的实现不够 react 优雅，但那是 vue 和 react 的设计思想导致的。在 react 中一切都是函数，而在 vue 中，组件最终都是函数，但在开发时可以是 JSON 对象，而且每个 vue 组件要注意三个点：props、events 和 slots，就是这三个导致 vue 创建高阶组件时要传入相应的属性，较 react 要复杂。

```
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

每个 vue 组件有 mixins 属性接收 mixin 数组，但由于 mixin 与组件，mixin 与 mixin 之间存在属性命名冲突的问题，vue 解决这个的方式是：

1. 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
2. 同名钩子函数（created,mounted...）将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
3. 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
4. Vue.extend()和 new Vue()创建的组件，解决上述的命名冲突的方案是一样的。
`组件拥有最终发言权`

```mixins
const list = {
  data () {
    return {
      loading: false,
      pageParam: {
        pageNum: 1, // 页码
        pageSize: 20, // 页长
        total: 0 // 总记录数数
      },
      pageSizes: [10, 20, 30, 50], // 页长数
      pageLayout: 'total, sizes, prev, pager, next, jumper', // 分页布局
      pageCount: 5, // 页码按钮的数量，当总页数超过该值时会折叠(大于等于 5 且小于等于 21 的奇数)
      list: []
    }
  },
  methods: {
    // 分页回掉事件
    handleSizeChange (val) {
      this.pageParam.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageParam.pageNum = val
      this.getList()
    },
    /**
     * 表格数据请求成功的回调 处理完公共的部分（分页，loading取消）之后把控制权交给页面
     * @param {*} apiResult
     * @returns {*} promise
     */
    listSuccessCb (apiResult = {}) {
      return new Promise((resolve, reject) => {
        let tempList = [] // 临时list
        try {
          this.loading = false
          tempList = apiResult.data
          this.pageParam.total = apiResult.page.total
          // 直接抛出
          resolve(tempList)
        } catch (error) {
          reject(error)
        }
      })
    },
    /**
     * 处理异常情况
     * ==> 简单处理 仅仅是对表格处理为空以及取消loading
     */
    listExceptionCb (error) {
      this.loading = false
      console.error(error)
    }
  },
  created () {
    // 这个生命周期是在使用组件的生命周期之前
    this.$nextTick().then(() => {
      // todo
    })
  }
}
export default list;
```

```
import mixin from '@/mixins/list' // 引入
import {getList} from '@/api/demo'
export default {
  name: 'mixins-demo',
  mixins: [mixin], // 使用mixins
  data () {
    return {
    }
  },
  methods: {
    // 加载列表
    getList () {
      const params = { ...this.searchForm, ...this.pageParam }
      fetchUserList(params).then(res => {
        if (res.code === 0) {
          this.listSuccessCb(res).then((list) => {
            this.list = list
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
  },
  created() {
    this.load()
  }
}

```
在`list.js`中可以直接调用组件的方法，比如在分页回调事件中调用组件的`getList()`方法，在组件中直接调用`list.js`中的代码，如直接访问`this.pageParam`.


> 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。

比如现在将element-ui的弹框组件进行了封装，那我们知道在element1.x版本时，控制弹框组件大小的属性是size，但是升级到2.0后变成了width，并且值是百分比，很显然之前的用法已经不能用了，但是我又不想更改我之前的代码，我们就可以使用mixins.
```
export default {
  computed: {
    width() {
      let width;
      switch (this.options.size) {
        case 'small':
          width = '50%';
          break;
        case 'medium':
          width = '60%';
          break;
        case 'large':
          width = '80%';
          break;
        default:
          width = '45%';
          break;
      }
      return width;
    },
  },
};
```