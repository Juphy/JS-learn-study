function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn);
    } else {
        if (!ele['AAA' + type]) {
            ele['AAA' + type] = [];
            ele.attachEvent('on' + type, function () {
                run.call(ele);
            })
        }
        var a = ele['AAA' + type];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === fn) {
                    return
                }
            }
        }
        a.push(fn);
    }
}

function run(e) {
    e = e || window.event;
    e.target = e.target || e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function () {
        e.returnValue = false;
    };
    e.stopPropagation = function () {
        e.cancelBubble = true;
    };
    var a = this['AAA' + e.type];
    if (a) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] === 'function') {
                a[i].call(this, e);
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
}

function off(ele, type, fn) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn)
    } else {
        var a = ele['AAA' + type];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === fn) {
                    a[i] = null;
                    break;
                }
            }
        }
    }
}

function processThis(fn, context) {
    return function (e) {
        fn.call(context, e);
    }
}

function addWheelEventListener(ele, fn) {
    if (window.navigator.userAgent.toLocaleLowerCase().indexOf('firefox') === -1) {
        ele.mousewheel = handler;
    } else {
        ele.addEventListener('DOMMouseScroll', handler);
    }

    function handler(e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        var isDown = null;
        if (e.wheelDelta) {
            isDown = e.wheelDelta < 0;
        } else {
            isDown = e.detail > 0;
        }
        fn.call(ele, isDown, e);
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }
}