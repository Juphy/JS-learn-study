### 枚举（enum）

使用枚举可以定义一些带名字的变量，清晰地表达一图或创建一组有区别的用例。TypeScript 支持数字和基于字符串的枚举。

### 数字枚举

```
enum Direction{
    Up =1,
    Down,
    Left,
    Right
}
let dir = Direction.Up;
=====>
"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
let dir = Direction.Down;
```

Up 使用初始化为 1，其余的成员会从 1 开始自动增长。也可以不使用初始化器，则默认初始值为 0.

```
enum Direction{
    Up,
    Down,
    Left,
    Right
}
```

`通过枚举的属性来访问枚举成员和枚举的名字来访问枚举`，Direction.Up 的值为 1，Down 为 2，Left 为 3，Right 为 4。
通过枚举的属性来访问枚举成员，和枚举的名字来访问枚举类型。

```
enum Response{
    No=0,
    Yes=1,
}
function respond{recipient: string,message: Response}:void{
    // ...
}
respond("Princess Caroline", Response.Yes)
```

不带初始化器的枚举或者被放在第一的位置，或者被放在使用了数字常量或其它常量初始化了的枚举后面。

```
// 以下的情况不被允许
enum E{
    A = getSomeValue(),
    B, // error! "A" is not constant-initialized, so "B" needs an initializer.
}
```

### 字符串枚举

在字符串枚举中，每个成员都必须使用字符串字面量，或者另外一个字符串枚举成员进行初始化。由于字符串枚举没有自增长的行为，字符串枚举可以很好的序列化。

```
enum Direction{
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
=====>
"use strict";
var Direction;
(function (Direction) {
    Direction["NORTH"] = "NORTH";
    Direction["SOUTH"] = "SOUTH";
    Direction["EAST"] = "EAST";
    Direction["WEST"] = "WEST";
})(Direction || (Direction = {}));
```

### 异构枚举

枚举可以混合字符串和数字成员，一般不建议这样做。

```
enum BooleanLikeHeterogeneousEnum{
    No=0,
    Yes = "YES",
}
=====>
"use strict";
var Enum;
(function (Enum) {
    Enum[Enum["No"] = 0] = "No";
    Enum["Yes"] = "YES";
})(Enum || (Enum = {}));
console.log(Enum.No);  // 0
console.log(Enum[0]); // 'No'
```

数字枚举相对于字符串枚举多了“反向映射”。

### 计算的常量成员

每个枚举成员都带有一个值，它可以是常量或计算出来的，当满足以下条件时，枚举成员被当做是常量：

- 枚举的第一个成员且没有初始化，这种情况下被赋值 0
  ```
  // E.X is constant:
  enum E { X }
  ```
- 不带有初始化器且它之前的枚举成员是一个数字常量，这种情况下，当前枚举成员的值为它上一个枚举成员的值加 1

  ```
  enum E1 { X, Y, Z }
  enum E2 { A = 1, B, C}

  // All enum members in 'E1' and 'E2' are constant.
  ```

- 枚举成员使用`常量枚举表达式`初始化，常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常量枚举表达式： - 一个枚举表达式字面量（主要是字符串字面量或数字字面量） - 一个对之前定义的常量枚举成员的引用（可以是在不同的枚举类型中定义的） - 带括号的常量枚举表达式 - 一元运算符 +, -, ~其中之一应用在了常量枚举表达式 - 常量枚举表达式做为二元运算符 +, -, \*, /, %, <<, >>, >>>, &, |, ^的操作对象。 若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错
  所有其他情况的枚举成员被当做是需要计算得出的值。

```
enum FileAccess{
    // constant members
    None,
    Read =1 << 1,
    Write=1 >> 2,
    ReadWrite = Read | Write,
    // computed member
    G = "123".length
}
```

### 联合枚举与枚举成员的类型

存在一种特殊的非计算的常量枚举成员的子集：字面量枚举成员。 字面量枚举成员是指不带有初始值的常量枚举成员，或者是值被初始化为：

- 任何字符串字面量（例如："foo"，"bar"）
- 任何数字字面量（例如：1,100）
- 应用了一元`-`符号的数字字面量（例如：-1，-100）

当所有枚举成员都拥有字面量枚举值时，它就带有了一种特殊的语义。

#### 枚举成员是类型（class）

```
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}
```

#### 枚举类型本身变成了每个枚举成员的联合。

TypeScript 能够捕获在比较值的时候犯的愚蠢的错误。

```
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
    }
}
// 先检查 x是否不是 E.Foo。 如果通过了这个检查，然后 || 会发生短路效果， if语句体里的内容会被执行。 然而，这个检查没有通过，那么 x则 只能为 E.Foo，因此没理由再去检查它是否为 E.Bar。
```

### 运行时的枚举

枚举是在运行时真正存在的对象

```
enum E {
    X, Y, Z
}

function f(obj: { X: number }){
    return obj.X;
}
// Works, since "E" has a property named "X" which is number.
f(E);
```

### 反向映射

除了创建一个以属性名作为对象成员的对象之外，数字枚举成员还具有了反向映射，从枚举值到枚举名字。不会为字符串枚举成员生成反向映射。

```
enum Enum{
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
===> 编译成JavaScript
var Enum;
(function (Enum){
    Enum[Enum["A"]=0] ="A"; // 赋值时返回所赋的值
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

### const 枚举

为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问，可以使用 const 枚举，常量枚举通过在枚举上使用 const 修饰符来定义，因为常量枚举不允许包含计算成员。常量枚举只能使用常量枚举表达式，并且不同于常规枚举，它们在编译阶段会被删除。常量枚举成员在使用的地方会被内联进来。

```
const enum Direction{
    Up,
    Down,
    Left,
    Right
}
let direction = [Direction.Up, Direction.Down, DIrection.Left, Direction.Right];
===>
var directions = [0,1,2,3];
```

### 外部枚举

外部枚举用来描述已经存在的枚举类型的形状。

```
declare enum Enum{
    A = 1,
    B,
    C = 2
}
```

外部枚举和非枚举之间有一个重要的区别，在正常的枚举里，没有初始化方法的成员被当成常数成员。对于非常数的外部枚举而言，没有初始化方法时被当做需要经过计算的。
