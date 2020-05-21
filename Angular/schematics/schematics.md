### 什么是 Schematics

Schematics 是改变现存文件系统的生成器，有了 Schematics 我们就可以

- 创建文件
- 重构现存文件
- 到处移动文件

### Schematics 能做什么

总体上，Schematics 可以：

- 为 Angular 工程添加库
- 升级 Angular 工程的库
- 生成代码

在工程或者所在组织中使用 Schematics 是具有无限可能：

- 在应用中生成通用 UI 模板
- 使用预先定义的模板或布局生成组织指定的组件
- 强制使用组织内架构

> Schematics 现在是 Angular 生态圈的一部分，不仅限于 Angular 工程，你可以生成想要的模板。

### CLI 集成

schematics 与 Angular CLI 紧密集成，下列的 CLI 命令可以使用 schematics：

- ng add
- ng generate
- ng update

### 什么是 Collection？

Collection 是一系列的 schematics。我们会在工程中 collection.json 中为每个 schematics 定义元数据。

### 安装

```
npm install -g @angular-devkit/schematics-cli
yarn add -g @angular-devkit/schematics-cli
```

创建名为`demo-schema`的文件夹，在其中已经创建了多个文件

```
schematics blank --name=demo-schema
==>
CREATE demo-schema/package.json (566 bytes)
CREATE demo-schema/README.md (639 bytes)
CREATE demo-schema/tsconfig.json (656 bytes)
CREATE demo-schema/.gitignore (191 bytes)
CREATE demo-schema/.npmignore (64 bytes)
CREATE demo-schema/src/collection.json (228 bytes)
CREATE demo-schema/src/demo-schema/index.ts (317 bytes)
CREATE demo-schema/src/demo-schema/index_spec.ts (472 bytes)
√ Packages installed successfully.
```

collection.json

```
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "demo-schema": {
      "aliases": ["demo"],    //需要自己添加
      "factory": "./demo-schema/index.ts#demoSchema",
      "description": "A blank schematic.",
      "schema": "./demo-schema/schema.json"  //需要自己添加
    }
  }
}
```

- \$schema：定义该 collection 架构的 url 地址
- schematics：这是你的 schematics 定义。
  - demo-schema：以后使用这个 schematics 的 cli 名称
  - aliases：别名
  - factory：定义代码
  - description：简单的说明
  - schema：schema 的设置。这个文件的内容应该如下所示，我们在其中定义了多个自定义的选项，在使用这个 Schematics 的时候，可以通过这些选项来设置生成的内容。

### 入口函数

打开`src/demo-schema/index.ts`文件，查看内容：

```
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
export function demoSchema(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

- export 了会作为"entry function"调用的 demoSchema 函数
- 函数接收一个`_options`参数，它是命令行参数的键值对对象，和我们定义的`schema.json`有关
- 这个函数是一个高阶函数，接收或者返回一个函数引用，此处，这个函数返回一个接收`Tree`和`SchematicsContext`对象的函数

### 什么是 Tree？

> Tree 是变化的待命区域，包含源文件系统和一系列应用到其上面的变化

Tree 能完成的事情：

- read(path:string): Buffer | nul：读取指定的路径
- exists(path: string): boolean：确定路径是否存在
- create(path: string, content: Buffer|string): void：在指定路径使用指定内容创建新文件
- beginUpdate(path: string): UpdateRecorder: 为在指定路径的文件返回一个新的 UpdateRecorder 实例
- commitUpdate(record: UpdateRecorder):void：提交 UpdateRecorder 中的动作，简单理解就是更新指定文件内容

### 什么是 Rule

Rule 是一个根据 SchematicContext 为一个 Tree 应用动作的函数，入口函数返回了一个 Rule。

```
declare type Rule =  (tree: Tree, context: SchematicContext) => Tree | Observable<Tree> | Rule | void;
```

### 构建和执行
要运行，首先需要构建它，然后使用schematics命令行工具，将schematic项目目录的路径作为集合。从项目的根：
```
npm run build
# ...等待构建完成
schematics .:demo-schema --name=test --dry-run
# ...查看在控制台生成创建的文件日志
```
**注意**：使用`--dry-run`不会生成文件，在调试时候可以使用它，如果想要创建正在的文件，去掉即可。使用`npm run build -- -w`命令，修改`index.ts`文件以后自动构建。

### 如何使用在angular项目中
使用短连安装：
```
npm link demo-schema
```
使用`ng generate`运行：
```
ng generate demo-schema:demo-schema
```
- 第一个demo-schema => 是package.json的name
- 第二个demo-schema => 是我们运行的schematics