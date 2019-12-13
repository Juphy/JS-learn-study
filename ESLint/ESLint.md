### 初始化

```
# 全局安装 ESLint
npm install -g eslint

# 进入项目
npm init -f

# 初始化 ESLint配置
eslint --init
```

### 配置方式

1.使用注释把 lint 规则直接嵌入到源代码中（这种配置只对当前文件有效）

```javascript
/*eslint eqeqeq: "error"*/
var num = 1;
num == "1";
```

一般使用注释是为了临时禁止某些严格的 lint 规则出现的警告：

```javascript
/* eslint-disable */
alert("该注释放在文件顶部，整个文件都不会出现 lint 警告");

/* eslint-enable */
alert("重新启用 lint 告警");

/* eslint-disable eqeqeq */
alert("只禁止某一个或多个规则");

/* eslint-disable-next-line */
alert("当前行禁止 lint 警告");

alert("当前行禁止 lint 警告"); // eslint-disable-line
```

2.使用配置文件进行 lint 规则配置
这种配置方式，配置信息可以写在单独的`.eslintrc.*`文件中，或者写在`package.json`文件的`eslintConfig`字段中，这种配置对配置文件及其子目录树中的所有文件有效。
初始化过程中，有一个选项就是使用什么文件类型进行 lint 配置(`What format do you want your config file to be in?`)

```javascript
{
    type: "list",
    name: "framework",
    message: "Which framework does your project use?",
    default: "react",
    choices: [
        { name: "React", value: "react" },
        { name: "Vue.js", value: "vue" },
        { name: "None of these", value: "none" }
    ]
}
```

- JavaScript(.eslintrc.js 导出一个包含配置信息的对象)
- YAML(.eslintrc.yaml 或.eslintrc.yml)
- JSON(.eslintrc.json 支持 JavaScript 注释)
- package.json(package.json 增减一个 eslintConfig 字段，该字段定义配置信息)
- .eslintrc 
如果在同一个目录中有多个配置文件，则它们中间只有一个是有效的，优先级如下：
```
.eslintrc.js
.eslintrc.yaml
.eslintrc.yml
.eslintrc.json
.eslintrc
package.json
```
