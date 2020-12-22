var a = "a", b = "b";
var obj = {
    a: 'aa',
    b: 'bb',
    fn: function (c, d) {
        console.log(this.a, this.b, c, d);
    }
}

var db = {
    a: 'aaa',
    b: 'bbb'
}

obj.fn.call(db, 'c', 'd');
obj.fn.apply(db, ['c', 'd']);
obj.fn.bind(db, 'c', 'd')();
obj.fn.bind(db, ['c', 'd'])();