(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.RequestAJAX = factory();
    }
})(this, function() {
    function RequestAJAX(options) {
        var xhr = new XMLHttpRequest(),
            timeoutTimer,
            data;

        if (options.timeout > 0) {
            timeoutTimer = setTimeout(function() {
                options.error('timeout');
                xhr.abort();
            }, options.timeout);
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {

                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                if (xhr.status === 200) {
                    data = xhr.responseText;
                    options.success(data);
                } else {
                    options.error({
                        response: xhr.responseText,
                        status: xhr.status,
                        statusText: xhr.statusText
                    }, xhr.statusText);
                }
            }
        };

        xhr.open(options.type, options.url);

        if (options.headers) {
            var key;
            for (key in options.headers) {
                if (!options.headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }

        xhr.send(options.data);
    }



    return RequestAJAX;
});