(function () {
    function getXhr() {
        let xhr = null,
            ary = [
                function () {
                    return new XMLHttpRequest();
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP')
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP')
                },
                function () {
                    return new ActiveXObject('Msxml.XMLHTTP')
                }
            ];
        for (let i = 0; i < ary.length; i++) {
            let cur = ary[i];
            try {
                xhr = cur();
                getXhr = cur;
                break;
            } catch (e) {

            }
        }
        if (!xhr) {
            throw Error('Error')
        }
        return xhr;
    }

    function ajax(options) {
        let _defaultOptions = {
            url: '',
            type: 'get',
            dataType: JSON,
            async: false,
            cache: true,
            success: null,
            data: null
        };
        for (let attr in options) {
            if (options.hasOwnProperty(attr)) {
                _defaultOptions[attr] = options[attr];
            }
        }
        if (_defaultOptions.type.toUpperCase() == 'GET' && _defaultOptions.async) {
            if (_defaultOptions.url.indexOf('?') > -1) {
                _defaultOptions.url += 'ran=' + Math.random()
            } else {
                _defaultOptions.url += '?ran=' + Math.random();
            }
        }
        let xhr = getXhr();
        xhr.open(_defaultOptions.type, _defaultOptions.url, _defaultOptions.async);
        xhr.responseType = _defaultOptions.dataType;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                _defaultOptions.success.call(this, this.response)
            }
        };
        xhr.send(_defaultOptions.data);
    }

    window.ajax = ajax;
})();