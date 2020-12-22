// 发布订阅模式
function E() { }
E.prototype = {
    on: function (name, callback, ctx) {
        // 一个EventName可以绑定多个事件
        var e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn: callback,
            ctx: ctx
        });
        return this;
    },

    once: function (name, callback, ctx) {
        var self = this;
        function listener() {
            self.off(name, listener);
            callback.apply(ctx, arguments);
        };
        // listener是在callback上封装了一层，所以要规定一个可以找到callback的规则，以便在off时，易于查找
        listener._ = callback;
        return this.on(name, listener, ctx)
    },

    emit: function (name) {
        var data = [].slice().call(arguments, 1);
        var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for (let i = 0; i < evtArr.length; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }

        return this;
    },

    off: function (name, callback) {
        var e = this.e || (this.e = {});
        var evts = e[name];
        var liveEvents = [];
        // 如果没有callback，就删掉整个eventName对象，带有callback就只删除掉callback
        if (evts && callback) {
            liveEvents = evts.filters(ele => ele.fn !== callback && ele.fn._ !== callbak);
        }
        liveEvents.length ? e[name] = liveEvents : delete e[name];
        return this;
    }
}
module.exports = E;
module.exports.TinyEmitter = E;

// ES6
class Emitter {
    constructor() {
        this.e = {};
    }

    on(name, callback, ctx) {
        (this.e[name] || (this.e[name] = [])).push({
            fn: callback,
            ctx: ctx
        })
        return this;
    }

    once(name, callback, ctx) {
        var self = this;
        function listener() {
            self.off(name, listener);
            callback.apply(ctx, arguments);
        }
        listener._ = callback;
        return this.on(name, listener, ctx);
    }

    emit(name, ...args) {
        let evtArrs = (this.e[name] || (this.e[name] = [])).slice();
        evtArrs.forEach(ele => ele.fn.apply(ele.ctx, args));
        return this;
    }

    off(name, callback) {
        let e = this.e;
        let evtArrs = e[name], liveEvts = [];
        if (evtArrs && callback) {
            liveEvts = evtArrs.filter(ele => ele.fn !== callback && ele.fn._ !== callback);
        }
        liveEvts.length ? e[name] = liveEvts : delete e[name];
        return this;
    }
}

