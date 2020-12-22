function E() { }
E.prototype = {
    on: function (name, callback, ctx) {
        var e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn: callback,
            ctx: ctx
        })
        return this;
    },
    once: function (name, callback, ctx) {
        var self = this;
        function listener() {
            self.off(name, istener);
            callback.apply(ctx, arguments)
        }
        listener._ = callback;
        return this.on(name, listener, ctx);
    },
    emit: function (name) {
        var data = [].slice().call(arguments, 1);
        var evts = ((this.e || (this.e = {})) || []).slice();
        evts.forEach(evts => {
            evts.fn.apply(evts.ctx, data)
        })
        return this;
    },
    off: function (name, callback) {
        var e = this.e || (this.e = {});
        var evts = e[name], liveEvts = [];
        if (evts && callback) {
            liveEvts = evts.filter(ele => ele.fn !== callback && ele.fn._ !== callback)
        }
        liveEvts.length ? e[name] = liveEvts : delete e[name];
        return this;
    }
}
module.exports = E;
