function Y(f) {
    return (function (g) {
        return g(g);
    })(function (g) {
        return f(function (x) {
            return g(g)(x);
        })
    })
}

let fact = Y(function (rec) {
    return function (n) {
        return n === 0 ? 1 : n * rec(n - 1);
    }
});
console.log(fact(10));

b = (function () {
    let a = 1;
    return (function () {
        return a
    }())
});
console.log(b());

// 普通递归
let factorial = n => n ? factorial(n - 1) * n : 1;
console.log(factorial(4));
let f1 = p => judge(p) ? f(step(p)) : value;

let f2 = p => judge(p) ? calc(f(step(p)), p) : value;

// 匿名函数递归
let fn = f => p => f(f)(p);

function foo(f) {
    return function (p) {
        return f(f)(p);
    }
}

let func = f => n => n ? f(f)(n - 1) * n : 1;
console.log(func(func)(4));

func = (f => n => n ? f(f)(n - 1) * n : 1)(f => n => n ? f(f)(n - 1) * n : 1);
console.log(func(4));

func = n => {
    return (f => n => n ? f(f)(n - 1) * n : 1)(f => n => n ? f(f)(n - 1) * n : 1);
};

func = n => {
    let fa = f => n => n ? f(f)(n - 1) * n : 1;
    return fa(fa);
};

func = n => {
    let fa = f => {
        return n => n ? f(f)(n - 1) * n : 1;
    };
    return fa(fa);
};

func = n => {
    let fa = f => {
        let fb = n => f(f)(n);
        return n => n ? fb(n - 1) * n : 1;
    };
    return fa(fa);
};

func = n => {
    let fa = f => {
        let fb = n => f(f)(n);
        let fc = n => n ? fb(n - 1) * n : 1;
        return fc;
    };
    return fa(fa);
};
func = n => {
    let fa = f => {
        let fb = n => f(f)(n);
        let fc = fb => n => n ? fb(n - 1) * n : 1;
        return fc(fb);
    };
    return fa(fa);
}

func = n => {
    let fa = fc => f => {
        let fb = n => f(f)(n);
        return fc(fb);
    };
    let fc = fb => n => n ? fb(n - 1) * n : 1;
    return fa(fc)(fa(fc));
};

func = n => {
    let fa = fc => f => {
        let fb = n => f(f)(n);
        return fc(fb);
    };
    let fc = fb => n => n ? fb(n - 1) * n : 1;
    let fd = fa => fc => {
        return fa(fc)(fa(fc));
    }
    return fd(fa)(fc);
};
func = n => {
    var fc = fb => n => n ? fb(n - 1) * n : 1;
    var fd = fc => {
        var fa = fc => f => {
            var fb = n => f(f)(n);
            return fc(fb);
        };
        return fa(fc)(fa(fc));
    }
    return fd(fc);
};

//化简fd
func = n => {
    var fc = fb => n => n ? fb(n - 1) * n : 1;
    var fd = fc => {
        var fa = f => {
            var fb = n => f(f)(n);
            return fc(fb);
        };
        return fa(fa);
    }
    return fd(fc);
};

//化简fd
func = n => {
    var fc = fb => n => n ? fb(n - 1) * n : 1;
    var fd = fc => (f => fc(n => f(f)(n)))(f => fc(n => f(f)(n)));
    return fd(fc);
};

// 计算逻辑fn，Y组合子
fn = f => n => n ? f(n - 1) * n : 1;
Y = y => (x => y(n => x(x)(n)))(x => y(n => x(x)(n)));

console.log(Y(fn)(10));

// n => x(x)(n) 应化为 x(x)，将左边部分替换
Y = y => (x => y(x(x))(x => y(n => x(x)(n))));
console.log(Y(fn)(10));