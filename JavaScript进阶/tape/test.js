'use strict';
var test = require('tape');
test('timing test', function (t) {
    t.plan(7);

    t.equal(typeof Date.now, 'function');

    var start = Date.now();
    setTimeout(() => {
        t.equal(Date.now() - start, 102);
    }, 100);
    t.equal(typeof null, 'object', 'aa');
    t.equal(typeof undefined, 'undefined');
    t.equal(typeof '', 'string');
    t.equal(typeof NaN, 'number');
    t.equal(typeof true, 'boolean');
})