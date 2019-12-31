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

class Foo {
    constructor(...args) {
        this.args = args;
    }

    *[Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }
    }
}

for (let x of new Foo('hello', 'world')) {
    console.log(x);
}

class Logger {
    constructor() {
        this.printName = this.printName.bind(this);
        this._printName = (name = "there") => {
            this.print(`hello ${name}`)
        }
    }
    printName(name = 'there') {
        this.print(`hello ${name}`);
    }
    print(text) {
        console.log(text);
    }
    printName1(name = "there") {
        this.print(`hello ${name}`);
    }
}
const logger = new Logger();
const {
    printName,
    _printName
} = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
_printName();

function selfish(target) {
    const cache = new WeakMap();
    const handler = {
        get(target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    }
    const proxy = new Proxy(target, handler);
    return proxy;
}

const logger1 = selfish(new Logger());
const {
    printName1
} = logger1;
printName1();

class A {
    constructor() {
        console.log(new.target.name)
    }
}

class B extends A {
    constructor() {
        super();
    }
}
new A();
new B();

class C {
    p() {
        return 2;
    }
}

class D extends C {
    constructor() {
        super();
        console.log(super.p());
    }
}
let d = new D();