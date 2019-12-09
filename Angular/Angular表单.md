Angular 提供两种不同的方法来通过表单处理用户输入：

- 响应式表单：可扩展性、可复用性和可测试性更强，响应式表单把自定义验证器定义成函数，它以要验证的控件作为参数。
- 模板驱动表单：往应用中添加简单的表单时非常有用，比如邮件列表的登记表单。模板驱动表单和模板指令紧密相关，并且必须提供包装了验证函数的自定义验证器指令。

|                  | 响应式               | 模板驱动          |
| :--------------: | :------------------- | :---------------- |
| 建立（表单模式） | 显式，在组件类中创建 | 隐式，由组件创建  |
|     数据模式     | 结构化               | 非结构化          |
|     可预测性     | 同步                 | 异步              |
|     表单验证     | 函数                 | 指令              |
|      可变性      | 不可变               | 可变              |
|     可伸缩性     | 访问底层 API         | 在 API 之上的抽象 |

共同基础：响应式表单和模板驱动表单共享了一些底层构造块

- FormControl 实例用于追踪单个表单控件的值和验证状态
- FormGroup 用于追踪一个表单控件组的值和状态
- FormArray 用于追踪表单控件数组的值和状态
- ControlValueAccessor 用于在 Angular 的 FormControl 实例和原生 DOM 元素之间创建一个桥梁

## 响应式表单

响应式表单使用显式的、不可变的方式，管理表单在特定的时间点上的状态。对表单状态的每一次变更都会返回一个新的状态，这样可以在变化时维护模型的整体性。响应式表单是围绕 Observable 的流构建的，表单的输入和值都是这些输入值组成的流来提供的，它可以同步访问。

使用响应式表单：

- ReactiveFormsModule
- FormControl 类是最基本的构造块，要注册单个的表单控件，在组件中导入 FormControl 类，并创建一个 FormControl 的新实例，把它保存在类的某个属性中。
- 在组件类中创建了控件之后。修改模板，为表单控件添加 formControl 绑定，formControl 是由 ReactiveFormModule 中的 FormControlDirective 提供的

### 管理控件的值

> 显示表单控件的值：

- 通过可观察对象 valueChanges，你可以在模板中使用 AsyncPipe 或在组件类中使用 subscribe()方法来监听表单值的变化
- 使用 value 属性。它能让你获得当前值的一份快照

> 替换表单控件的值

响应式表单还有一些方法可以用编程的方式修改控件的值，它让你可以灵活的修改控件的值而不需要借助用户交互，FormControl 提供了一个 setValue()方法，它会修改这个表单控件的值，并且验证与控件结构相对应的值的结构。比如，当从后端 API 或服务接收到了表单数据时，可以通过 setValue()方法来把原来的值替换为新的值。

> 表单控件分组

就像 FormControl 的实例能让你控制单个输入框所对应的控件一样，
FormGroup 的实例也能跟踪一组 FormControl 实例（比如一个表单）的表达状态。
当创建 FormGroup 时，其中的每个控价都会根据其名字进行跟踪。

- 创建 FormGroup 实例

FormGroup 实例拥有和 FormControl 实例相同的属性（value、untouched）和方法（setValue()）

```
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });
}
```

- 关联 FormGroup 的模型和视图

```
<form [formGroup]="profileForm">
  <label>
    First Name:
    <input type="text" formControlName="firstName">
  </label>
  <label>
    Last Name:
    <input type="text" formControlName="lastName">
  </label>
</form>
```

> 保存表单数据

FormGroup 指令会监听 form 元素发出的 submit 事件，并发出一个 ngSubmit 事件，并发出一个 ngSubmit 事件，让你可以绑定一个回调函数。

```
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">

<button type="submit" [disabled]="!profileForm.valid">Submit</button>

onSubmit(){
    console.log(this.profileForm.value);
}
```

> 嵌套的表单组

```
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('')
    })
  });
}

<div formGroupName="address">
  <h3>Address</h3>
  <label>
    Street:
    <input type="text" formControlName="street">
  </label>
  <label>
    City:
    <input type="text" formControlName="city">
  </label>
  <label>
    State:
    <input type="text" formControlName="state">
  </label>
  <label>
    Zip Code:
    <input type="text" formControlName="zip">
  </label>
</div>
```

> 部分模型更新

当修改包含过个 FormGroup 实例的值时，你可能只希望更新模型中的一部分，而不是完全替换掉：

- 使用 setValue()方法来为单个控件设置新值。setValue()方法会严格遵循表单组的结构，并整体性替换控价的值
- 使用 patchValue()方法可以用对象中所定义的任何属性为表单模型进行替换

```
updateProfile() {
  this.profileForm.patchValue({
    firstName: 'Nancy',
    address: {
      street: '123 Drew Street'
    }
  });
}
```

### 使用 FormBuilder 来生成表单控件

当需要与多个表单打交道时，手动创建多个表单控件实例会非常繁琐，FormBuilder 服务提供了一些便捷方法来生成表单控件。

- 导入 FormBuilder 类

```
import { FormBuilder } from '@angular/forms';
```

- 注入 FormBuilder 服务

```
FormBuilder是一个可注入的服务提供商，它是由ReactiveFormModule提供的。
constructor(private fb: FormBuilder) { }
```

- 生产表单控件

```
FormBuilder服务有三个方法：control()、group()和Array()，这些方法都是工厂方法，用于在组件类中生成FormControl、FormGroup、FormArray。
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
  });

  constructor(private fb: FormBuilder) { }
}
```

> 简单表单验证

表单验证用于验证用户的输入，以确保其完整和正确

- 导入验证器函数

```
import { Validators } from "@angular/forms";
```

- 把字段这位必填(required)

```
profileForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: [''],
  address: this.fb.group({
    street: [''],
    city: [''],
    state: [''],
    zip: ['']
  })
})

HTML5有一组内置的属性，用来进行原生验证，包括required、minlength、maxlength等。虽然是可选的，不过也可以在表单的输入元素上把它们添加为附加属性来使用它们。
<input type="text" formControlName="firstName" required>
这些HTML5验证器属性可以和Angular响应式表单提供的内置验证器组合使用。组合使用这两种验证器实践，可以防止在模板检查完之后表达式再次被修改导致的错误。
```

- 显示表单状态
  当你往表单控件上添加一个必填字段时，它的初始值是无效的（INVALID）,  这种无效状态会传播到其父 FormGroup 元素上，也让这个 FormGroup 的状态变为无效的。
  _FormGroup 实例的 status 属性来访问其当前状态。_

### 使用表单数组管理动态控件

FormArray 是 FormGroup 之外的另一个选择，用于管理任意数量的匿名控件。
与 FormGroup 实例一样，也可以往 FormArray 中动态插入和移除控件，
并且 FormArray 实例的值和验证状态也是根据它的子控件计算得来的。
_不需要为每个控件定义一个名字作为 key，事先不知道子控件的数量_。

- 导入 FormArray

```
import { FormArray } from "@angular/forms";
```

- 定义 FormArray

```
通过把一组（从零到多项）控件定义在一个数组中来初始化一个FormArray，为profileForm添加一个aliases属性，把它定义为FormArray类型。
profileForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: [''],
  address: this.fb.group({
    street: [''],
    city: [''],
    state: [''],
    zip: ['']
  }),
  aliases: this.fb.array([
    this.fb.control('')
  ])
});
```

- 访问 FormArray 控件

```
相对于重复使用profileForm.get()方法获取每个实例的方式，getter可以更简单访问表单数组各个实例中的别名。表单数组实例用一个数组来代表未定数量的控件。
get aliases(){
  return this.profileForm.get('aliases') as FormArray;
  // 因为返回的控件的类型是AbstractControl，所以要为该方法提供一个显式的类型声明来访问FormArray特有的语法。
}

FormArray.push()方法把该控件添加为数组中的新条目。
addAlias(){
  this.aliases.push(this.fb.control(''));
}
```

- 在模板中显示表单数组

```
<div formArrayName="aliases">
  <h3>Aliases</h3> <button (click)="addAlias()">Add Alias</button>
  <div *ngFor="let address of aliases.controls; let i=index">
    <!-- The repeated alias template -->
    <label>
      Alias:
      <input type="text" [formControlName]="i">
    </label>
  </div>
</div>
```

\*ngFor 指令对 aliases FormArray 提供的每个 FormControl 进行迭代。因为 FormArray 中的元素时匿名的，所以要把索引号赋值给 i 变量，并且把它传给每个控件的 formControlName 输入属性。

### 响应式表单 API

- 类
  |类|说明|
  |:--:|:--|
  |AbstractControl|所有三种表单控件类（FormControl、FormGroup 和 FormArray）的抽象基类。它提供了一些公共的行为和属性。|
  |FormControl|管理单体表单控件的值和有效性状态。它对应于 HTML 的表单控件，比如 `<input>` 或 `<select>`。|
  |FormGroup|管理一组 AbstractControl 实例的值和有效性状态。该组的属性中包括了它的子控件。组件中的顶级表单就是 FormGroup。|
  |FormArray|管理一些 AbstractControl 实例数组的值和有效性状态。|
  |FormBuilder|一个可注入的服务，提供一些用于提供创建控件实例的工厂方法。|
- 指令
  | 指令 | 说明 |
  | :--: | :-- |
  | FormControlDirective | 把一个独立的 FormControl 实例绑定到表单控件元素。 |
  | FormControlName | 把一个现有 FormGroup 中的 FormControl 实例根据名字绑定到表单控件元素。 |
  | FormGroupDirective | 把一个现有的 FormGroup 实例绑定到 DOM 元素。 |
  | FormGroupName | 把一个内嵌的 FormGroup 实例绑定到一个 DOM 元素。 |
  | FormArrayName | 把一个内嵌的 FormArray 实例绑定到一个 DOM 元素。 |

## 模板驱动表单

在模板驱动表单中，只要导入 FormsModule 就不用对`<form>`做任何改动来使用 FormsModule。

ngForm 指令为 form 增补了一些额外特性，它会控制那些带有 ngModel 指令和 name 属性的元素，监听它们的属性（包括其有效性），它还有自己的 valid 属性，这个属性只有在它包含的每个控件都有效时才是真的。

在内部，Angular 创建了一些 FormControl，并把它们注册到 Angular 附加到`<form>`标签上的 NgForm 指令，注册每个 FormControl 时，使用 name 属性值作为键值。


