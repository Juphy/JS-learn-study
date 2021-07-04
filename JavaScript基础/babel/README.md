### Babel 的包构成

> 核心包

- babel-core：babel 转译器本身，提供了 babel 的转译 API，如 babel.transform 等，用于对代码进行转译。像 webpack 的 babel-loader 就是调用这些 API 来完成转译过程的。
- babylon：js 的词法解析器
- babel-traverse：用于对 AST（抽象语法树，想了解的请自行查询编译原理）的遍历，主要给 plugin 用
- babel-generator：根据 AST 生成代码

> 功能包

- babel-types：用于检验、构建和改变 AST 树的节点
- babel-template：辅助函数，用于从字符串形式的代码来构建 AST 树节点
- babel-helpers：一系列预制的 babel-template 函数，用于提供给一些 plugins 使用
- babel-code-frames：用于生成错误信息，打印出错误点源代码帧以及指出出错位置
- babel-plugin-xxx：babel 转译过程中使用到的插件，其中 babel-plugin-transform-xxx 是 transform 步骤使用的
- babel-preset-xxx：transform 阶段使用到的一系列的 plugin
- babel-polyfill：JS 标准新增的原生对象和 API 的 shim，实现上仅仅是 core-js 和 regenerator-runtime 两个包的封装
- babel-runtime：功能类似 babel-polyfill，一般用于 library 或 plugin 中，因为它不会污染全局作用域

> 工具包

- babel-cli：babel 的命令行工具，通过命令行对 js 代码进行转译
- babel-register：通过绑定 node.js 的 require 来自动转译 require 引用的 js 代码文件

### babel 的配置

- 如果是以命令行方式使用 babel，那么 babel 的设置就以命令行参数的形式带过去
- 还可以在 package.json 里在 babel 字段添加设置
- 但是建议还是使用一个单独的.babelrc 文件，把 babel 的设置都放置在这里，所有 babel API 的 options（除了回调函数之外）都能够支持
  常用 options 字段说明：
- env：指定在不同环境下使用的配置。比如 production 和 development 两个环境使用不同的配置，就可以通过这个字段来配置。env 字段的从 process.env.BABEL_ENV 获取，如果 BABEL_ENV 不存在，则从 process.env.NODE_ENV 获取，如果 NODE_ENV 还是不存在，则取默认值"development"
- plugins：要加载和使用的插件列表，插件名前的 babel-plugin-可省略；plugin 列表按从头到尾的顺序运行
- presets：要加载和使用的 preset 列表，preset 名前的 babel-preset-可省略；presets 列表的 preset 按从尾到头的逆序运行（为了兼容用户使用习惯）
- 同时设置了 presets 和 plugins，那么 plugins 的先运行；每个 preset 和 plugin 都可以再配置自己的 option

配置文件的查找：
babel 会从当前转译的文件所在目录下查找配置文件，如果没有找到，就顺着文档目录树一层层往上查找，一直到.babelrc 文件存在或者带 babel 字段的 package.json 文件存在为止。

### babel 的工作原理

babel 是一个转译器，感觉相对于编译器 compiler，叫转译器 transpiler 更准确，因为它只是把同种语言的高版本规则翻译成低版本规则，而不像编译器那样，输出的是另一种更低级的语言代码。
但是和编译器类似，babel 的转译过程也分为三个阶段：parsing、transforming、generating，以 ES6 代码转译为 ES5 代码为例，babel 转译的具体过程如下：

```
ES6代码输入 ==》 babylon进行解析 ==》 得到AST
==》 plugin用babel-traverse对AST树进行遍历转译 ==》 得到新的AST树
==》 用babel-generator通过AST树生成ES5代码
```

babel 只是转译新标准引入的语法，比如 ES6 的箭头函数转译成 ES5 的函数；而新标准引入的新的原生对象，部分原生对象新增的原型方法，新增的 API 等（如 Proxy、Set 等），这些 babel 是不会转译的。需要用户自行引入 polyfill 来解决

#### plugins

插件应用于 babel 的转译过程，尤其是第二个阶段 transforming，如果这个阶段不使用任何插件，那么 babel 会原样输出代码。
我们主要关注 transforming 阶段使用的插件，因为 transform 插件会自动使用对应的词法插件，所以 parsing 阶段的插件不需要配置。

### presets

如果要自行配置转译过程中使用的各类插件，那太痛苦了，所以 babel 官方帮我们做了一些预设的插件集，称之为 preset，这样我们只需要使用对应的 preset 就可以了。以 JS 标准为例，babel 提供了如下的一些 preset：

- es2015
- es2016
- es2017
- env
  es20xx 的 preset 只转译该年份批准的标准，而 env 则代指最新的标准，包括了 latest 和 es20xx 各年份
  另外，还有 stage-0 到 stage-4 的标准成形之前的各个阶段，这些都是实验版的 preset，建议不要使用。

### polyfill

polyfill 是一个针对 ES2015+环境的 shim，实现上来说 babel-polyfill 包只是简单的把 core-js 和 regenerator runtime 包装了下，这两个包才是真正的实现代码所在（后文会详细介绍 core-js）。
使用 babel-polyfill 会把 ES2015+环境整体引入到你的代码环境中，让你的代码可以直接使用新标准所引入的新原生对象，新 API 等，一般来说单独的应用和页面都可以这样使用。
使用方法:

- 1. 先安装包： npm install --save babel-polyfill
- 2. 要确保在入口处导入 polyfill，因为 polyfill 代码需要在所有其他代码前先被调用代码方式： import "babel-polyfill"; webpack 配置: module.exports = { entry: ["babel-polyfill", "./app/js"] }

如果只是需要引入部分新原生对象或 API，那么可以按需引入，而不必导入全部的环境

### runtime

> polyfill 和 runtime 的区别

直接使用 babel-polyfill 对于应用或页面等环境在你控制之中的情况来说，并没有什么问题。但是对于在 library 中使用 polyfill，就变得不可行了。因为 library 是供外部使用的，但外部的环境并不在 library 的可控范围，而 polyfill 是会污染原来的全局环境的（因为新的原生对象、API 这些都直接由 polyfill 引入到全局环境）。这样就很容易会发生冲突，所以这个时候，babel-runtime 就可以派上用场了。

> transform-runtime 和 babel-runtime

babel-plugin-transform-runtime 插件依赖 babel-runtime，babel-runtime 是真正提供 runtime 环境的包；也就是说 transform-runtime 插件是把 js 代码中使用到的新原生对象和静态方法转换成对 runtime 实现包的引用，举个例子如下：

```JavaScript

// 输入的ES6代码
var sym = Symbol();
// 通过transform-runtime转换后的ES5+runtime代码
var _symbol = require("babel-runtime/core-js/symbol");
var sym = (0, _symbol.default)();
```

从上面这个例子可见，原本代码中使用的 ES6 新原生对象 Symbol 被 transform-runtimec 插件转换成了 babel-runtime 的实现，既保持了 Symbol 的功能，同时又没有像 polyfill 那样污染全局环境（因为最终生成的代码中，并没有对 Symbol 的引用）
另外，这里我们也可以隐约发现，babel-runtime 其实也不是真正的实现代码所在，真正的代码实现是在 core-js 中。

transform-runtime 插件的功能：

1. 把代码中的使用到的 ES6 引入的新原生对象和静态方法用 babel-runtime/core-js 导出的对象和方法替代
2. 当使用 generators 或 async 函数时，用 babel-runtime/regenerator 导出的函数取代（类似 polyfill 分成 regenerator 和 core-js 两个部分）
3. 把 Babel 生成的辅助函数改为用 babel-runtime/helpers 导出的函数来替代（babel 默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，通过引用 babel-runtime/helpers 就可以统一起来，减少代码体积）

上述三点就是 transform-runtime 插件所做的事情，由此也可见，babel-runtime 就是一个提供了 regenerator、core-js 和 helpers 的运行时库。
建议不要直接使用 babel-runtime，因为 transform-runtime 依赖 babel-runtime，大部分情况下都可以用 transform-runtime 达成目的。
此外，transform-runtime 在.babelrc 里配置的时候，还可以设置 helpers、polyfill、regenerator 这三个开关，以自行决定 runtime 是否要引入对应的功能。
最后补充一点：由于 runtime 不会污染全局空间，所以实例方法是无法工作的（因为这必须在原型链上添加这个方法，这是和 polyfill 最大的不同） ，比如

```
var arr = ['a', 'b', 'c'];
arr.fill(7);  // 实例方法不行
Array.prototype.fill.apply(arr, 7);  // 用原型链来调用也是不行
```

### 通过 core-js 实现按需引入 polyfill 或 runtime

core-js 包才上述的 polyfill、runtime 的核心，因为 polyfill 和 runtime 其实都只是对 core-js 和 regenerator 的再封装，方便使用而已。
但是 polyfill 和 runtime 都是整体引入的，不能做细粒度的调整，如果我们的代码只是用到了小部分 ES6 而导致需要使用 polyfill 和 runtime 的话，会造成代码体积不必要的增大（runtime 的影响较小）。所以，按需引入的需求就自然而然产生了，这个时候就得依靠 core-js 来实现了。

> core-js 的组织结构

首先，core-js 有三种使用方式：

- 默认方式：require('core-js'): 这种方式包括全部特性，标准的和非标准的
- 库的形式： var core = require('core-js/library'): 这种方式也包括全部特性，只是它不会污染全局名字空间
- 只是 shim： require('core-js/shim')或 var shim = require('core-js/library/shim'): 这种方式只包括标准特性（就是只有 polyfill 功能，没有扩展的特性）

core-js 的结构是高度模块化的，它把每个特性都组织到一个小模块里，然后再把这些小模块组合成一个大特性，层层组织。比如：
core-js/es6（core-js/library/es6）就包含了全部的 ES6 特性，而 core-js/es6/array（core-js/library/es6/array）则只包含 ES6 的 Array 特性，而 core-js/fn/array/from（core-js/library/fn/array/from）则只有 Array.from 这个实现。
实现按需使用，就是自己选择使用到的特性，然后导入即可。

> core-js 的按需使用

1. 类似 polyfill，直接把特性添加到全局环境，这种方式体验最完整

```
require('core-js/fn/set');
require('core-js/fn/array/from');
require('core-js/fn/array/find-index');

Array.from(new Set([1, 2, 3, 2, 1])); // => [1, 2, 3]
[1, 2, NaN, 3, 4].findIndex(isNaN);   // => 2
```

2. 类似 runtime 一样，以库的形式来使用特性，这种方式不会污染全局名字空间，但是不能使用实例方法

```
var Set       = require('core-js/library/fn/set');
var from      = require('core-js/library/fn/array/from');
var findIndex = require('core-js/library/fn/array/find-index');

from(new Set([1, 2, 3, 2, 1]));      // => [1, 2, 3]
findIndex([1, 2, NaN, 3, 4], isNaN); // => 2
```

3. 因为第二种库的形式不能使用 prototype 方法，所以第三种方式使用了一个小技巧，通过::这个符号而不是.来调用实例方式，从而达到曲线救国的目的。这种方式的使用，路径中都会带有/virtual/

```
import {fill, findIndex} from 'core-js/library/fn/array/virtual';

Array(10)::fill(0).map((a, b) => b * b)::findIndex(it => it && !(it % 8)); // => 4

// 对比下polyfill的实现
// Array(10).fill(0).map((a, b) => b * b).findIndex(it => it && !(it % 8));
```

### Babel 编译的三个阶段

Babel 的编译过程和大多数其他语言的编译器相似，可以分为三个阶段：

解析（Parsing）：将代码字符串解析成抽象语法树。
转换（Transformation）：对抽象语法树进行转换操作。
生成（Code Generation）: 根据变换后的抽象语法树再生成代码字符串。
