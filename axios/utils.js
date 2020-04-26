'use strict';
const bind = function (fn, thisArg) {
    return function wrap() {
        // var args = new Array(arguments.length);
        // for (var i = 0; i < args.length; i++) {
        //     args[i] = arguments[i];
        // }
        var args = new Array(arguments);
        return fn.apply(thisArg, args);
    }
}

const toString = Object.prototype.toString;

function isArray(val) {
    return toString.call(val) === '[object Array]';
    return Array.isArray(val);
}

function isUndefined(val) {
    return typeof val === 'undefined';
}

function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
}

function isFormData(val) {
    return (typeof FormData !== undefined) && (val instanceof FormData);
}

function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
    } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
}

function isString(val) {
    return typeof val === 'string';
}

function isNumber(val) {
    return typeof val === 'number';
}

function isObject(val) {
    return val !== null && typeof val === 'object';
}

function isDate(val) {
    return toString.call(val) === '[object Date]';
}

function isFile(val) {
    return toString.call(val) === '[object File]';
}

function isBlob(val) {
    return toString.call(val) === '[object Function]';
}

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}

function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function isStandardBrowserEnv() {
    if (typeof navigator !== undefined && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
        return false;
    }
    return (
        typeof window !== 'undefined' && typeof document !== 'undefined'
    );
}

function ForEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

function merge( /*obj1, obj2, obj3*/ ) {
    var result = {};

    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
        } else {
            result[key] = val;
        }
    }

    for (var i = 0; i < arguments.length; i++) {
        forEach(arguments[i], assignValue);
    }

    return result;
}

function deepMerge() {
    var result = {};

    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = deepMerge(result[ket], val);
        } else if (typeof val === 'object') {
            result[key] = deepMerge({}, val);
        } else {
            result[key] = val;
        }
    }

    for (var i = 0; i < arguments.length; i++) {
        forEach(arguments[i], assignValue);
    }
    return result;
}

function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    });
    return a;
}

module.exports = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBuffer,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    deepMerge,
    extend,
    trim,
    bind
};