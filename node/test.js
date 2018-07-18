function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    // 若监听器不是函数对象，则抛出异常
    if (typeof listener !== 'function') {
        const errors = lazyErrors();
        throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'listener', 'Function');
    }

    events = target._events;
    // 若target._events对象未定义，则使用Object.create创建一个新的对象
    if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
    } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
            target.emit('newListener', type,
                listener.listener ? listener.listener : listener);

            // Re-assign `events` because a newListener handler could have caused the
            // this._events to be assigned to a new object
            events = target._events;
        }
        existing = events[type]; // 获取type类型保存的对象
    }

    if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        // 优化单个监听器的场景，不需使用额外的数组对象。
        existing = events[type] = listener;
        ++target._eventsCount;
    } else {
        if (typeof existing === 'function') { // 添加type前已有绑定监听器
            // Adding the second element, need to change to array.
            existing = events[type] =
                prepend ? [listener, existing] : [existing, listener];
            // If we've already got an array, just append.
        } else if (prepend) { // 添加到前面
            existing.unshift(listener);
        } else { // 添加到后面
            existing.push(listener);
        }
    }
    return target;
}