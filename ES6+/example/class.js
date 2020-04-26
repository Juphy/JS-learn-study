class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }
}
let p = new Point();
console.log(typeof Point); // 'function'
console.log(Point === Point.prototype.constructor); // true
console.log(p.constructor === Point.prototype.constructor); // true

class Bar {
    doStuff() {
        console.log('stuff');
    }
}

var b = new Bar();
b.doStuff();

Object.assign(Point.prototype, {
    toValue() {}
})

class Foo {
    constructor() {
        return Object.create(null);
    }
}

console.log(new Foo() instanceof Foo)
// Foo();

var point = new Point(2, 3);
console.log(point.toString());

console.log(point.hasOwnProperty('x'));
console.log(point.hasOwnProperty('y'));
console.log(point.hasOwnProperty('toString'));
console.log(point.__proto__.hasOwnProperty('toString'));

var p1 = new Point(2, 3);
var p2 = new Point(3, 2);

console.log(p1.__proto__ === p2.__proto__);
p1.__proto__.printName = function () {
    return 'Oops'
}
console.log(p1.printName());
console.log(p2.printName());

var p3 = new Point(4, 2);
console.log(p3.printName());

class MyClass {
    constructor() {

    }

    get prop() {
        return 'getter';
    }

    set prop(value) {
        console.log('setter: ' + value);
    }
}

let inst = new MyClass();
inst.prop = 123;
console.log(inst.prop);

class CustomHTMLElement {
    constructor(element) {
        this.element = element;
    }

    get html() {
        return this.element.innerHTML;
    }

    set html(value) {
        this.element.innerHTML = value;
    }
}

var descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype, 'html'
);

console.log('get' in descriptor);
console.log('set' in descriptor);

const MyClass1 = class Me {
    getClassName() {
        return Me.name;
    }
}

class Foo1 {
    constructor(...args) {
        this.args = args;
    }

    *[Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }
    }

    static classMethod() {
        return 'hello world!';
    }

    static bar() {
        this.baz();
    }

    static baz() {
        console.log('hello');
    }

    baz() {
        console.log('world');
    }
}
for (let x of new Foo1('hello', 'world')) {
    console.log(x);
}

console.log(Foo1.classMethod());

var foo1 = new Foo1();
// foo1.classMethod();
Foo1.bar();

class IncreasingCounter {
    constructor() {
        this._count = 0;
    }
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}

class IncreasingCounter1 {
    _count = 0;
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}

class MyClass2 {
    static myStaticProp = 42;

    constructor() {
        console.log(MyClass2.myStaticProp);
    }
}

var myclass2 = new MyClass2();

class Widget {
    // 公有方法
    foo(baz) {
        this._bar(baz);
    }
    // 私有方法
    _bar(baz) {
        return this.snaf = baz;
    }
}

class Widget1 {
    foo(baz) {
        bar.call(this, baz);
    }
    //...
}

function bar(baz) {
    return this.snaf = baz;
}

const a1 = Symbol('bar');
const a2 = Symbol('snaf');

class A1 {
    // 公有方法
    foo(baz) {
        this[bar](baz);
    }

    // 私有方法
    [bar](baz) {
        return this[snaf] = baz;
    }
}

const inst1 = new MyClass();
console.log(Reflect.ownKeys(Foo1.prototype));

function Person(name) {
    if (new.target !== undefined) {
        this.name = name
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}

function Person1(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}
var person = new Person('张三');
// var noteAPerson = Person.call(person, '张三');

class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
        this.length = length;
        this.width = width;
    }
}

var obj = new Rectangle(3, 4);

class Point {}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x,y)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}