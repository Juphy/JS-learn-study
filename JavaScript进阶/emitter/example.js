export class Emitter {
    constructor() {
        this.e = {};
    }

    on(name, callback, ctx) {
        (this.e[name] || (this.e[name] = [])).push({
            fn: callback,
            ctx: ctx
        });
        return this;
    }

    once(name, callback, ctx) {
        let listener = () => {
            this.off(name, listener);
            callback.apply(ctx, arguments);
        };
        listener._ = callback;
        return this.on(name, listener, ctx);
    }

    emit(name, ...args) {
        let evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for (let i = 0; i < evtArr.length; i++) {
            evtArr[i].fn.apply(evtArr[i].fn, args);
        }
        return this;
    }

    off(name, callback) {
        let evts = this.e[name], liveEvents = [];
        if (evts && callback) {
            liveEvents = evts.filters(ele => ele.fn !== callback && ele.fn._ !== callback);
        }
        liveEvents.length? this.e[name] = liveEvents: delete this.e[name];
        return this;
    }
}