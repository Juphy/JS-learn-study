### Angular 启动

```
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

启动项目，platformBrowserDynamic 提供的 bootstrapModule 方法引导根模块或主模块。

### platform 平台

angular 抽象出 platform，来实现跨平台。实例化 angular 根模块`bootstrapModule`的方法在浏览器端来自`@angular/platform-browser-dynamic`。

`@angular/platform-browser`这俩模块的主要区别是编译方式的不同，`platform-browser-dynamic`提供 JIT 编译，也就是说在浏览器内完成，而`platform-browser`提供 AOT 编译，编译在本地完成。

### platformBrowserDynamic

```
angular/packages/platform-browser-dynamic/src/platform-browser-dynamic.ts

/**
 * @publicApi
 */
export const platformBrowserDynamic = createPlatformFactory(
    platformCoreDynamic, 'browserDynamic', INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
```

`platformBrowserDynamic`方法就是调用创建平台的工厂方法`createPlatformFactory`返回的一个返回值是平台实例`PlatformRef`的函数。

### createPlatformFactory

```
angular/packages/core/src/application_ref.ts

/**
 * Creates a factory for a platform
 *
 * 1.判断是否已经创建了
 * 2.判断是否有父'Factory'
 * 3.如果有父'Factory'就把调用'Factory'时传入的'Provider'和调用'createPlatformFactory'传入的'Provider'合并，然后调用父'Factory'
 * 4.如果没有父'Factory',先创建一个'Injector'，然后去创建'PlatformRef'实例
 *
 * @publicApi
 */
export function createPlatformFactory(
    parentPlatformFactory: ((extraProviders?: StaticProvider[]) => PlatformRef) | null,
    name: string, providers: StaticProvider[] = []): (extraProviders?: StaticProvider[]) =>
    PlatformRef {
  const desc = `Platform: ${name}`;
  const marker = new InjectionToken(desc);
  return (extraProviders: StaticProvider[] = []) => {
    let platform = getPlatform();
    // 判断是否存在平台实例
    if (!platform || platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
      if (parentPlatformFactory) {
        // 调用父平台方法
        parentPlatformFactory(
            providers.concat(extraProviders).concat({provide: marker, useValue: true}));
      } else {
        const injectedProviders: StaticProvider[] =
            providers.concat(extraProviders).concat({provide: marker, useValue: true}, {
              provide: INJECTOR_SCOPE,
              useValue: 'platform'
            });
        // Injector.create创建平台实例，并获取设置为全局平台实例
        createPlatform(Injector.create({providers: injectedProviders, name: desc}));
      }
    }
    return assertPlatform(marker);
  };
}
```

`parentPlatformFactory: ((extraProviders?: StaticProvider[]) => PlatformRef) | null` 返回父平台工厂实例的方法
`name: string` 平台的名字
`provider: StaticProvider[] = []` DI 的服务提供者
通过`InjectionToken`创建一个`Platform: ${name}`的值`provide`，然后返回一个方法，接受服务提供者`extraProviders?: StaticProvider[]`，返回一个平台实例`PlatformRef`

`createPlatformFactory`返回的方法：

- 获取当前平台实例
- 如果当前实例不存在并且不存在`AllowMultipleToken`，这个允许多个令牌的服务提供者
  - 父级平台工厂方法`parentPlatformFactory`存在，则合并服务提供商并递归调用`parentPlatformFactory`
  - 父级平台工厂方法`parentPlatformFactory`不存在，则使用注入器创建实例方法`Injector.create`创建实例平台实例并用`createPlatform`设置为全局的平台实例
- 调用 assetPlatform 确认 IOC 容器中存在，该`marker`的平台实例并返回

所以创建平台实例的顺序是：合并`browserDynamic`的`provider`—>合并`coreDynamic`的`provider`—>合并`provider`并创建`core`。

### createPlatform

```
angular/packages/core/src/application_ref.ts

let _platform: PlatformRef;
/**
 * Creates a platform.
 * Platforms have to be eagerly created via this function.
 *
 * @publicApi
 */
export function createPlatform(injector: Injector): PlatformRef {
  if (_platform && !_platform.destroyed &&
      !_platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
    throw new Error(
        'There can be only one platform. Destroy the previous one to create a new one.');
  }
  publishDefaultGlobalUtils();
  // 初始化平台时将执行的函数，平台browserDynamic提供
  _platform = injector.get(PlatformRef);
  const inits = injector.get(PLATFORM_INITIALIZER, null);
  if (inits) inits.forEach((init: any) => init());  // 依次执行`PLATFORM_INITIALIZER`注入的工厂方法
}
```

`_platform`是全局的唯一平台实例。
创建平台实例的关键方法，传入服务注入器实例`injector`返回平台实例：

- 确认全局的平台实例存在，状态不是被销毁，并且不存在多个平台实例
- 从注入器中获取平台实例
- `Injector.get(PLATFORM_INITIALIZER, null)`获取`初始化平台时需要执行的函数并执行`

—>`platformBrowserDynamic` 中的`INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS`

```
angular/packages/platform-browser-dynamic/src/platform_providers.ts

/**
 * @publicApi
 */
export const INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS: StaticProvider[] = [
  INTERNAL_BROWSER_PLATFORM_PROVIDERS, // 初始化方法
  {
    provide: COMPILER_OPTIONS,
    useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderImpl, deps: []}]},
    multi: true
  },
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
];
```

`INTERNAL_BROWSER_PLATFORM_PROVIDERS`

```
angular/packages/platform-browser/src/browser.ts

export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: StaticProvider[] = [
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true}, // 初始化的方法
  {provide: PlatformLocation, useClass: BrowserPlatformLocation, deps: [DOCUMENT]},
  {provide: DOCUMENT, useFactory: _document, deps: []},
];
```

`@angular/platform-browser`提供了一些浏览器端的 ng 实现：

- `PLATFORM_INITIALIZER` 是初始化需要执行的方法集合
- `DOCUMENT`浏览器端的`document`,`_document`工厂方法返回`document`

`initDomAdapter`:

```
export function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
  BrowserGetTestability.init();
}
```

`BrowserDomAdapter.makeCurrent()`通过`BrowserDomAdapter`的静态方法实例化一个`BrowserDomAdapter`全局 DOM 适配器，具体就是`实现并封装了一些浏览器端的方法`。
`BrowserGetTestability.init()`则是初始化 angular 的测试。

### platformCoreDynamic

在创建`paltfromBrowserDynamic`时候，传入了返回父平台实例的方法`platformCoreDynamic`

```
angular/packages/platform-browser-dynamic/src/platform_core_dynamic.ts

import {COMPILER_OPTIONS, CompilerFactory, PlatformRef, StaticProvider, createPlatformFactory, platformCore} from '@angular/core';
import {JitCompilerFactory} from './compiler_factory';

/**
 * A platform that included corePlatform and the compiler.
 *
 * @publicApi
 */
export const platformCoreDynamic = createPlatformFactory(platformCore, 'coreDynamic', [
  {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
  {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
]);
```

- `platformCore`来自`@angular/core`
- 平台名`coreDynamic`
- 两个静态服务提供者：编译选项`COMPILER_OPTIONS`和`platformDynamic`的 JIT 编译器工厂

### JitComplierFactory

```
angular/packages/platform-browser-dynamic/src/compiler_factory.ts

/**
 * @publicApi
 */
export class JitCompilerFactory implements CompilerFactory {
  private _defaultOptions: CompilerOptions[];

  /* @internal */
  constructor(defaultOptions: CompilerOptions[]) {
    const compilerOptions: CompilerOptions = {
      useJit: true,
      defaultEncapsulation: ViewEncapsulation.Emulated,
      missingTranslation: MissingTranslationStrategy.Warning,
    };

    this._defaultOptions = [compilerOptions, ...defaultOptions];
  }
  createCompiler(options: CompilerOptions[] = []): Compiler {
    const opts = _mergeOptions(this._defaultOptions.concat(options));
    const injector = Injector.create([
      // 编译器Complier在这里被替换成CompilerImpl
      COMPILER_PROVIDERS, {
        provide: CompilerConfig,
        useFactory: () => {
          return new CompilerConfig({
            // let explicit values from the compiler options overwrite options
            // from the app providers
            useJit: opts.useJit,
            jitDevMode: isDevMode(),
            // let explicit values from the compiler options overwrite options
            // from the app providers
            defaultEncapsulation: opts.defaultEncapsulation,
            missingTranslation: opts.missingTranslation,
            preserveWhitespaces: opts.preserveWhitespaces,
          });
        },
        deps: []
      },
      opts.providers !
    ]);
    return injector.get(Compiler); // 创建一个`injector`，然后获取编译器实例`Complier`
  }
}
```

编译器在`COMPILER_PROVIDERS`作为服务器提供商被提供给注射器，后面的编译器会大量用到。

```
angular/packages/platform-browser-dynamic/src/compiler_factory.ts

/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
export const COMPILER_PROVIDERS = <StaticProvider[]>[
  // 这里也是一个核心点-编译反射器
  {provide: CompileReflector, useValue: new JitReflector()},
  // ResourceLoader- 资源加载器
  {provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER},
  // jit 摘要解析器
  {provide: JitSummaryResolver, deps: []},
  // 摘要解析器
  {provide: SummaryResolver, useExisting: JitSummaryResolver},
  {provide: Console, deps: []},
  // 语法分析器
  {provide: Lexer, deps: []},
  // 解析器
  {provide: Parser, deps: [Lexer]},
  // 基本的HTML解析器
  {
    provide: baseHtmlParser,
    useClass: HtmlParser,
    deps: [],
  },
  // 国际化的HTML解析器
  {
    provide: I18NHtmlParser,
    useFactory: (parser: HtmlParser, translations: string | null, format: string,
                 config: CompilerConfig, console: Console) => {
      translations = translations || '';
      const missingTranslation =
          translations ? config.missingTranslation ! : MissingTranslationStrategy.Ignore;
      // new 国际化的HTML解析器
      return new I18NHtmlParser(parser, translations, format, missingTranslation, console);
    },
    deps: [
      baseHtmlParser,
      [new Optional(), new Inject(TRANSLATIONS)],
      [new Optional(), new Inject(TRANSLATIONS_FORMAT)],
      [CompilerConfig],
      [Console],
    ]
  },
  {
    provide: HtmlParser,
    useExisting: I18NHtmlParser,
  },
  // 模板解析器
  {
    provide: TemplateParser, deps: [CompilerConfig, CompileReflector,
    Parser, ElementSchemaRegistry,
    I18NHtmlParser, Console]
  },
  { provide: JitEvaluator, useClass: JitEvaluator, deps: [] },
  // 指令规范器
  { provide: DirectiveNormalizer, deps: [ResourceLoader, UrlResolver, HtmlParser, CompilerConfig]},
  // 元数据解析器
  { provide: CompileMetadataResolver, deps: [CompilerConfig, HtmlParser, NgModuleResolver,
                      DirectiveResolver, PipeResolver,
                      SummaryResolver,
                      ElementSchemaRegistry,
                      DirectiveNormalizer, Console,
                      [Optional, StaticSymbolCache],
                      CompileReflector,
                      [Optional, ERROR_COLLECTOR_TOKEN]]},
  DEFAULT_PACKAGE_URL_PROVIDER,
  // 样式编译器
  { provide: StyleCompiler, deps: [UrlResolver]},
  // view 编译器
  { provide: ViewCompiler, deps: [CompileReflector]},
  // NgModule编译器
  { provide: NgModuleCompiler, deps: [CompileReflector] },
  // 编译器配置项目
  { provide: CompilerConfig, useValue: new CompilerConfig()},
  // JIT时，Compiler的服务供应商 CompilerImpl
  { provide: Compiler, useClass: CompilerImpl, deps: [Injector, CompileMetadataResolver,
                                TemplateParser, StyleCompiler,
                                ViewCompiler, NgModuleCompiler,
                                SummaryResolver, CompileReflector, JitEvaluator, CompilerConfig,
                                Console]},
  // DOM schema
  { provide: DomElementSchemaRegistry, deps: []},
  // Element schema
  { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry},
  // URL解析器
  { provide: UrlResolver, deps: [PACKAGE_ROOT_URL]},
  // 指令解析器
  { provide: DirectiveResolver, deps: [CompileReflector]},
  // 管道解析器
  { provide: PipeResolver, deps: [CompileReflector]},
  // 模块解析器
  { provide: NgModuleResolver, deps: [CompileReflector]},
];
```

### platformCore

```
angular/packages/core/src/platform_core_providers.ts

import {PlatformRef, createPlatformFactory} from './application_ref';
import {PLATFORM_ID} from './application_tokens';
import {Console} from './console';
import {Injector, StaticProvider} from './di';
import {TestabilityRegistry} from './testability/testability';

const _CORE_PLATFORM_PROVIDERS: StaticProvider[] = [
  // Set a default platform name for platforms that don't set it explicitly.
  {provide: PLATFORM_ID, useValue: 'unknown'},
  // 在这里PlatfromRef被加入了injector并在createPlatformFactory中实例化
  {provide: PlatformRef, deps: [Injector]},
  {provide: TestabilityRegistry, deps: []},
  {provide: Console, deps: []},
];

/**
 * This platform has to be included in any other platform
 *
 * @publicApi
 */
export const platformCore = createPlatformFactory(null, 'core', _CORE_PLATFORM_PROVIDERS);
```

`platformCore`则是创建了一个返回根平台工厂实例的方法，并设置了 4 个基础的 DI 的服务提供者

- `PLATFORM_ID` 平台 id
- `PlatformRef` 在这里`PlatformRef`被加入`injector`并在后续的`createPlatformFactory`中通过`createPlatform(Injector.create({providers: injectedProviders, name: desc}))` 平台实例会被实例化
- `TestabilityRegistry` 可测试性注册表。测试相关
- `Console` angular 把 Console 作为服务注入了 DI，但是只实现了 log 和 warn 两种方法。

### PlatformRef

```
angular/packages/core/src/application_ref.ts

@Injectable()
export class PlatformRef {
  private _modules: NgModuleRef<any>[] = [];
  private _destroyListeners: Function[] = [];
  private _destroyed: boolean = false;

  /** @internal */
  constructor(private _injector: Injector) {}

  bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>, options?: BootstrapOptions):
      Promise<NgModuleRef<M>> {
        ...
  }

  bootstrapModule<M>(
      moduleType: Type<M>, compilerOptions: (CompilerOptions&BootstrapOptions)|
      Array<CompilerOptions&BootstrapOptions> = []): Promise<NgModuleRef<M>> {
    // bootstrapModule` 首先通过 `optionsReducer` 递归 reduce 将编译器选项 `compilerOptions` 拍平为对象
    const options = optionsReducer({}, compilerOptions);
    // 这里获取到编译后的模块工厂，然后返回给 bootstrapModuleFactory创建模块
    return compileNgModuleFactory(this.injector, options, moduleType)
        .then(moduleFactory => this.bootstrapModuleFactory(moduleFactory, options));
  }

  private _moduleDoBootstrap(moduleRef: InternalNgModuleRef<any>): void {
    ...
  }

  onDestroy(callback: () => void): void { this._destroyListeners.push(callback); }

  get injector(): Injector { return this._injector; }

  destroy() {
    if (this._destroyed) {
      throw new Error('The platform has already been destroyed!');
    }
    this._modules.slice().forEach(module => module.destroy());
    this._destroyListeners.forEach(listener => listener());
    this._destroyed = true;
  }

  get destroyed() { return this._destroyed; }
}
```

`PlarformRef`就是平台实例的类，有一些方法和属性：

- bootstrapModule 引导根模块的方法
- bootstrapModuleFactory 实例模块的工厂方法，会运行 zone.js 并监听事件
- destory 销毁平台上实例的方法

调用`platformBrowserDynamic()`并生成`platformRef`时大概经历了这些：
1.调用`createPlatformFactory`合并平台 `browserDynamic` 的 `providers` 并触发父级平台 `coreDynamic` 的平台工厂函数平台 `browserDynamic` 提供了 `PLATFORM_INITIALIZER` 平台初始化函数和 `BrowserDomAdapter` 全局 DOM 适配器这个服务供应商

2.调用 `createPlatformFactory` 合并平台 `coreDynamic` 的 `providers` 并触发父级平台 `core` 的平台工厂函数平台 `coreDynamic` 提供了 `JitCompilerFactory` 运行时编译器，`JitCompilerFactory` 又通过创建 `COMPILER_PROVIDERS` 创建了编译器实例，所以 `@angular/platform-browser-dynamic` 提供JIT运行时编译

3.平台 `core` 提供了 `PlatformRef` 平台实例这个服务供应商

4.由于平台 `core` 无父级平台，调用 `Injector.create` 创建 `PlatformRef` 实例，并赋值给全局唯一的平台实例 `_platform`

5.在 `createPlatform` 创建 `PlatformRef` 的时候，实例化一个 `BrowserDomAdapter` 全局 DOM 适配器 ，具体就是实现并封装了一些在浏览器端的方法

6.最后断言，确认存在 `PlatformRef` 实例，并返回 `PlatformRef` 实例

所以大概，`@angular/platform-browser-dynamic` 提供了运行时编译，实现并封装了浏览器方法
