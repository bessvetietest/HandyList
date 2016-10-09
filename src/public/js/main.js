(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'HandyList',
            'RequestAJAX'
        ], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('HandyList'),
            require('RequestAJAX')
        );
    } else {
        factory(
            root.HandyList,
            root.RequestAJAX
        );
    }
})(this, function(HandyList, RequestAJAX) {
    RequestAJAX({
        url: 'persons2.json',
        type: 'GET',
        success: function(data) {
            createHandyList({
                items: JSON.parse(data),
                sort: {
                    index: 'surname'
                }
            }, '#handyList1');
        },
        error: function(xhr, textStatus) {
            alert(textStatus);
        }
    });

    RequestAJAX({
        url: 'persons2.json',
        type: 'GET',
        success: function(data) {
            createHandyList({
                items: JSON.parse(data),
                style: {
                    maxWidth: '700',
                    width: '400'
                },
                sort: {
                    type: 'date',
                    index: 'birthday'
                }
            }, '#handyList2');
        },
        error: function(xhr, textStatus) {
            alert(textStatus);
        }
    });

    function createHandyList(options, parent) {
        var handyList = new HandyList(options);

        var elem = handyList.getElem();
        var handyListTeg = document.querySelector(parent);
        handyListTeg.appendChild(elem);
    }
});