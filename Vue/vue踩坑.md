### 点击按钮跳转路由多出问号
Vue中的form表单中，在input框中回车时，默认表单的提交事件，如果点击button再使用this.$router进行路由跳转时就会在第一次点击跳转时，路径后面加上问号，第二次点击跳转时，才能真正跳转而且带有问号。当然如果使用router-link进行跳转时没有这一问题。这是由于点击button按钮时，触发了默认事件也就是提交行为，而chrome的空表单提交导致会自动在url加问号的bug，因此使用`@`click.prevent阻止默认事件。

### Unexpected console statement (no-console)
- 在项目的根目录下的package.json文件中的eslintConfig: {}中的"rules": 加入{ "no-console": 'off' }