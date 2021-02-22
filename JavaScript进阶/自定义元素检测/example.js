class HTMLEllElement extends HTMLElement {
    // 指定观察的属性，这样attributeChangedCallback才会起作用
    static get observedAttributes() { return ['rows'] }

    constructor() {
        // constructor中首先第一件事情就是调用super
        // super指代整个prototype或者__proto__指向的对象
        super();

        // 创建shadow元素，直接元素上设置也可以，CSS要放在外部，且目前火狐浏览器并不支持shadow，dom可以不用
        var shadow = this.attachShadow({
            // open
        })
    }

    // 下面4个方法为常用生命周期
    connectedCallback() {
        console.log('自定义元素加入页面');
        // 执行渲染更新
        this._updateRendering();
    }
    disconnectedCallback() {
        // 该生命周期未使用，占位示意
        console.log('自定义元素从页面移除');
    }
    adoptedCallback() {
        // 该生命周期未使用，占位示意
        console.log('自定义元素转移到新页面');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('自定义元素属性发生变化');
        this._rows = newValue;
        // 执行渲染更新
        this._updateRendering();
    }
    // 设置直接get/set rows属性的方法
    get_rows() {
        return this._rows;
    }
    set_rows(v) {
        this.setAttribute('rows', v);
    }

    _updateRendering() {
        // 根据变化的属性，改变组建的UI
        // 
    }
}

// 定义ex-ell标签元素为多行打点元素
customElements.define('x-ell', HTMLEllElement);