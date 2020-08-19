### 点击按钮跳转路由多出问号

Vue 中的 form 表单中，在 input 框中回车时，默认表单的提交事件，如果点击 button 再使用 this.\$router 进行路由跳转时就会在第一次点击跳转时，路径后面加上问号，第二次点击跳转时，才能真正跳转而且带有问号。当然如果使用 router-link 进行跳转时没有这一问题。这是由于点击 button 按钮时，触发了默认事件也就是提交行为，而 chrome 的空表单提交导致会自动在 url 加问号的 bug，因此使用`@`click.prevent 阻止默认事件。

### Unexpected console statement (no-console)

- 在项目的根目录下的 package.json 文件中的 eslintConfig: {}中的"rules": 加入{ "no-console": 'off' }

### bezierEasingMixin();Inline JavaScript is not enabled. Is it set in your options?

在使用 antd 时，修改 babel.config.js

```
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ]
}
```

发生问题：Inline JavaScript is not enabled. Is it set in your options?

1. 修改 less 版本为 3.0 一下

```
npm i less@2.7.2 -D
```

2. 在 vue.config.js 中添加

less-loader: 5.x.x

```
module.exports = {
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
}
```

less-loader: 6.0+

```
module.exports = {
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true
                }
            }
        }
    }
}
```

### vue-cli 引用 antd，按需加载

使用*babel-plugin-import*，这是一个用于按需加载组件代码和样式的 babel 插件

```
yarn add babel-plugin-import --dev
```

1. vue-cli2
   修改`.babelrc`文件，配置 bable-plugin-import

```
{
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
   "plugins": ["transform-vue-jsx", "transform-runtime"]
   "plugins": [
     "transform-vue-jsx",
     "transform-runtime",
     ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
   ]
}
```

2. vue-cli3
   修改`babel.config.js`文件，配置 babel-plugin-import

```
 module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ]
};
```
然后移除在`src/main.js`里全量添加的`import 'ant-design-vue/dist/antd.css'`;样式代码，并且按下面的格式引入模块，
```
  import Vue from 'vue'
- import Button from 'ant-design-vue/lib/button';
+ import { Button } from 'ant-design-vue';
- import 'ant-design-vue/dist/antd.css'
  import App from './App'

  Vue.use(Button)

  Vue.config.productionTip = false

  new Vue({
    render: h => h(App)
  }).$mount("#app");
```