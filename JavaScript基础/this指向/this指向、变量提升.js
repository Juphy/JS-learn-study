function Foo() {
    getName = function () {
        console.log(1)
    };

    return this;
}

Foo.getName = function () {
    console.log(2)
}

Foo.prototype.getName = function () {
    console.log(3)
}

var getName = function () {
    console.log(4)
}

function getName() {
    console.log(5)
}

Foo.getName(); // 2
getName(); // 4
// Foo().getName(); // 1
getName() // 1
new Foo.getName(); // 2
new Foo().getName() // 3
new new Foo().getName(); // 3

var name = "name";
var a = {
    name: "Cherry",
    fn: function () {
        console.log(this.name);
    }
}
a.fn();
var f = a.fn;
f();

var foo = function(){
    console.log(this);
}
foo();

console.log(this);
this.num = 10;
console.log(module.exports);
console.log(module.exports.num);