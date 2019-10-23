> Chrome 浏览器启动“增强版 cookies 控制”

产生的问题：浏览器中已登录，在新 tab 中测试无法获取 cookie。解决办法：
- Chrome49 之后的版本：
    - Chrome 快捷图标上点击鼠标右键
    - 选择属性
    - 选择快捷方式标签
    - 在目标里面，在原来的 chrome 路径的基础上，加上`--disable-web-security --user-data-dir=C:\Users\Juphy\Documents\myData`
    - 点击应用，点击确定关闭属性窗口
    - 关闭所有已打开的 chrome，重新启动
