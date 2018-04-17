# History 对象

- 属性
    - length
    只读的，其值为一个整数，标志包括当前页面在内的会话历史中的记录数量，比如我们通常打开一个空白窗口，length 为 0，再访问一个页面，其 length 变为 1。

    - scrollRestoration
    允许 Web 应用在会话历史导航时显式地设置默认滚动复原，其值为 auto 或 manual。

    - state
    只读，返回代表会话历史堆栈顶部记录的任意可序列化类型数据值，我们可以以此来区别不同会话历史纪录
- 方法
    - back()
    返回会话历史记录中的上一个页面，等价于 window.history.go(-1) 和点击浏览器的后退按钮。

    - forward()
    进入会话历史记录中的下一个页面，等价于 window.history.go(1) 和点击浏览器的前进按钮。

    - go()
    加载会话历史记录中的某一个页面，通过该页面与当前页面在会话历史中的相对位置定位，如，-1 代表当前页面的上一个记录，1 代表当前页面的下一个页面。若不传参数或传入0，则会重新加载当前页面；若参数超出当前会话历史纪录数，则不进行操作。

    - pushState()
    在会话历史堆栈顶部插入一条记录，该方法接收三个参数，一个 state 对象，一个页面标题，一个 URL：

        - 状态对象

        > 存储新添会话历史记录的状态信息对象，每次访问该条会话时，都会触发 popstate 事件，并且事件回调函数会接收一个参数，值为该事件对象的复制副本。

        > 状态对象可以是任何可序列化的数据，浏览器将状态对象存储在用户的磁盘以便用户再次重启浏览器时能恢复数据

        > 一个状态对象序列化后的最大长度是 640K，如果传递数据过大，则会抛出异常

        - 页面标题

        > 目前该参数值会被忽略，暂不被使用，可以传入空字符串

        - 页面 URL

        > 此参数声明新添会话记录的入口 URL

        > 在调用 pushState() 方法后，浏览器不会加载 URL 指向的页面，我们可以在 popstate 事件回调中处理页面是否加载

        > 此 URL 必须与当前页面 URL 同源,，否则会抛异常；其值可以是绝对地址，也可以是相对地址，相对地址会被基于当前页面 URL 解析得到绝对地址；若其值为空，则默认是当前页面 URL

    - replaceState()
    更新会话历史堆栈顶部记录信息，支持的参数信息与 pushState() 一致。

        pushState() 与 replaceState() 的区别：pushState()是在 history 栈中添加一个新的条目，replaceState() 是替换当前的记录值。此外这两个方法改变的只是浏览器关于当前页面的标题和 URL 的记录情况，并不会刷新或改变页面展示。

    - onpopstate 事件
    window.onpopstate 是 popstate 事件在 window 对象上的事件句柄。每当处于激活状态的历史记录条目发生变化时，popstate 事件就会在对应 window 对象上触发。如果当前处于激活状态的历史记录条目是由 history.pushState() 方法创建，或者由 history.replaceState() 方法修改过的，则 popstate 事件对象的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝。

        调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。popstate 事件只会在浏览器某些行为下触发，比如点击后退、前进按钮 (或者在 JavaScript 中调用 history.back()、history.forward()、history.go() 方法)。

        当网页加载时，各浏览器对 popstate 事件是否触发有不同的表现，Chrome 和 Safari 会触发 popstate 事件，而 Firefox 不会。