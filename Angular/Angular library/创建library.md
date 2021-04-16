### 新建Angular工程
```
ng new example-ng6-lib-app
rename example-ng6-lib-app example-ng6-lib
cd example-ng6-lib
ng serve
```
angular.json配置文件
```
"projects": {
      "example-ng6-lib-app": {
        ...
    },
    "example-ng6-lib-app-e2e": {
        ...
    }
}
```
- example-ng6-lib-app：这是我们用于测试库的应用。
- example-ng6-lib-app-e2e：这是用于 e2e 测试的默认项目。在本文中，你可以毫无副作用地忽视这个项目。

### 目标
使用`ng new`命令时，Angular CLI将为我们生成一个新的工作区（workspace）。
在Angular工作区中我们将拥有两个项目：
- 一个库项目（projects目录）

这是由组件和服务组成的库。其包含了我们将会上传到npm的代码。
- 一个应用项目（src目录）

该项目作为Library的测试工具存在。默认情况下，Angular CLI会生成第三个用于e2e测试的项目（e22目录）。

### 创建库模块
```
ng generate library example-ng6-lib --prefix=enl
```
`--prefix`标签，其目的是让库组件变得更加有辨识度（就像ng-zorro所做的nz-xxx一样）。如果不对其进行配置，Angular CLI将使用lib作为默认前缀标签。
- 在angular.json文件中为我们的库添加了一个新的example-ng6-lib项目
- 将ng-packagr的依赖项添加到package.json文件中
- 在tsconfig.json文件中添加对example-ng6-lib构建路径的引用
- 在projects/example-ng6-lib文件夹下创建库的初始源代码

#### 在angular.json文件中的example-ng6-lib项目
查看angular.json文件就会发现我们在`projects`对象下创建了一个名为example-ng6-lib的新项目。
```
"projects": {
    "example-ng6-lib-app":{

    },
    "example-ng6-lib-app-e2e":{

    },
    "ng-element": {
      "projectType": "library",
      "root": "projects/ng-element",
      "sourceRoot": "projects/ng-element/src",
      "prefix": "enl",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "tsConfig": "projects/ng-element/tsconfig.lib.json",
            "project": "projects/ng-element/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/ng-element/tsconfig.lib.prod.json"
            }
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "projects/ng-element/src/test.ts",
            "tsConfig": "projects/ng-element/tsconfig.spec.json",
            "karmaConfig": "projects/ng-element/karma.conf.js"
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "projects/ng-element/tsconfig.lib.json",
              "projects/ng-element/tsconfig.spec.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
}
```
`root `指向我们的库项目的根文件夹
`sourceRoot`指向我们的库项目的源代码位置
`projectType`特别指出这是一个library项目，而不像是其他两个类型名称为application的引用项目
`prefix`用于我们的组件选择器的前缀标识符。
`architect`用于指定Angular CLI如何处理项目的构建，测试和lint构建部分中的构建器使用了ng-packagr

#### package.json文件中的ng-packagr依赖项
在生成Library时，Angular CLI意识到它需要ng-packagr这个包，因此将其添加到了工作区的package.json文件中devDependencies依赖中
```
"ng-packagr": "^3.0.0-rc.2"
```

#### 在tsconfig.json文件中的构建路径
通常，当我们使用第三方库时，我们使用npm install指令安装，并将其安装到我们的node_modules文件夹中。
即使在当前的情况下，example-ng6-lib不会安装到node_modules文件夹中，但是它会被构建到工作区的dist文件夹下的某个子文件夹中。Angular CLI将这个文件夹添加到tsconfig.json文件中，这样example-ng6-lib就可以像一个Library一样以常见的方式被测试应用所引用。
```
"paths": {
    "example-ng6-lib":[
        "dist/example-ng6-lib"
    ]
}
```

#### example-ng6-lib的源代码
库的src文件夹被包含在`project/example-ng6-lib`文件夹中。在库中，Angular CLI创建了一个包含服务和组件的新模块。除此之外还包含了更多文件：
`package.json`专门用于库的package.json文件，也是库作为npm包发布所使用的package.json文件。当用户通过npm安装库时，该文件用于指定其依赖项。
`public_api.ts`该文件作为入口文件存在，它用于描述库中哪个部分是外部可见的
`ng-package.json`这是ng-packagr的配置文件。在CLI和ng-packagr没有集成的时代我们需要尽可能地熟悉该文件的内容，但是现在，在拥有新版Angular CLI的情况下，我们只需要知道该文件适用于告知ng-packagr去哪构建库的内容即可。

### 构建库
在使用新生成的库之前首先需要构建它：
```
ng build example-ng6-lib
```
该命令会将库构建于`example-ng6-lib-app\dist\example-ng6-lib`文件夹中，
