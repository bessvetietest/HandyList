(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.HandyList = factory();
    }
})(this, function() {
    var HandyList = function(options) {
        var orientation;
        var items;
        Object.defineProperties(this, {
            orientation: {
                get: function() {
                    return orientation;
                },
                set: function(value) {
                    if (!scrollByType.hasOwnProperty(value)) {
                        throw new PropertyError('orientation');
                    }
                    orientation = value;
                },
                enumerable: true
            },
            items: {
                get: function() {
                    return items;
                },
                set: function(value) {
                    if (!Array.isArray(value)) {
                        throw new PropertyError('items');
                    }
                    items = value;
                },
                enumerable: true
            },
            id: {
                value: HandyList.id,
                enumerable: true
            },
            _elemList: {
                writable: true
            },
            _activeGroup: {
                writable: true
            },
            _mouseStart: {
                value: null,
                writable: true
            },
            _positionStart: {
                value: null,
                writable: true
            },
            _moveAll: {
                value: null,
                writable: true
            },
            _borderSize: {
                value: options.borderSize || 2
            },
            _sizeHead: {
                writable: true
            },
            _sizeGroup: {
                writable: true
            },
            _units: {
                value: options._units || 'px',
                writable: true,
            },
            _sort: {
                writable: true
            }
        });
        try {
            this.orientation = options.orientation || 'vertical';
            this.items = options.items;
        } catch (err) {
            throw err;
        }

        this.setStyle(options.style);
        this.setSort(options.sort);

        HandyList.id++;
    };
    HandyList.id = 0;

    HandyList.prototype.setStyle = function(options) {
        options = options || {};

        var _this = this;
        this.style = {};
        Object.defineProperties(this.style, {
            minWidth: {
                enumerable: true,
                value: (options.minWidth || 262) + _this._units
            },
            maxWidth: {
                enumerable: true,
                value: (options.maxWidth || 350) + _this._units
            },
            minHeight: {
                enumerable: true,
                value: (options.minHeight || 350) + _this._units
            },
            maxHeight: {
                enumerable: true,
                value: (options.maxHeight || 500) + _this._units
            },
            width: {
                enumerable: true,
                value: (options.width || 350) + _this._units
            },
            height: {
                enumerable: true,
                value: (options.height || 500) + _this._units
            },
            fontFamily: {
                enumerable: true,
                value: options.fontFamily || 'Arial'
            },
            fontSize: {
                enumerable: true,
                value: (options.fontSize || 24) + _this._units
            }
        });
    };
    HandyList.prototype.setSort = function(options) {
        options = options || {};
        this._sort = Object.create({});

        var type;
        Object.defineProperties(this._sort, {
            type: {
                get: function() {
                    return type;
                },
                set: function(value) {
                    if (!setSortType.hasOwnProperty(value)) {
                        throw new PropertyError('type');
                    }
                    type = value;
                }
            },
            index: {
                value: options.index || null
            },
            map: {
                value: [],
                writable: true
            }
        });
        try {
            this._sort.type = options.type || 'string';
        } catch (err) {
            throw err;
        }

        setSortType[this._sort.type].call(this, options);

        if (options.method)
            this._sort.method = options.method;
    };
    HandyList.prototype.getElem = function() {
        if (!this._elemList) renderElemList.call(this);
        return this._elemList;
    };
    HandyList.prototype.addEvent = function(event, handler) {
        var self = this;
        this._elemList.addEventListener(event, function(e) {
            handler.call(self, e);
        }, false);
    }

    var setSortType = {
        string: function(options) {
            var head;
            var method;

            Object.defineProperties(this._sort, {
                head: {
                    get: function() {
                        return head;
                    },
                    set: function(value) {
                        if (typeof value === 'number' && value < 1) {
                            throw new PropertyError('head');
                        }
                        head = value;
                    }
                },
                method: {
                    get: function() {
                        return method;
                    },
                    set: function(value) {
                        if (typeof value !== 'function') {
                            throw new PropertyError('method');
                        }
                        method = value;
                    }
                }
            });

            try {
                this._sort.head = options.head || 1;
                this._sort.method = returnSortMapByType['string'];
            } catch (err) {
                throw err;
            }
        },
        date: function(options) {
            var head;
            var monthType;
            var monthFormat;
            var dateType;
            var dateFormat;
            var method;

            Object.defineProperties(this._sort, {
                head: {
                    get: function() {
                        return head;
                    },
                    set: function(value) {
                        if (value !== 'day' && value !== 'month' && value !== 'year') {
                            throw new PropertyError('head');
                        }
                        head = value;
                    }
                },
                dateType: {
                    get: function() {
                        return dateType;
                    },
                    set: function(value) {
                        if (value !== 'string' && value !== 'number') {
                            throw new PropertyError('dateType');
                        }
                        dateType = value;
                    }
                },
                dateFormat: {
                    get: function() {
                        return dateFormat;
                    },
                    set: function(value) {
                        if (value !== 'short' && value !== 'long') {
                            throw new PropertyError('dateFormat');
                        }
                        dateFormat = value;
                    }
                },
                method: {
                    get: function() {
                        return method;
                    },
                    set: function(value) {
                        if (typeof value !== 'function') {
                            throw new PropertyError('method');
                        }
                        method = value;
                    }
                },
                formatInput: {
                    value: options.formatInput || true,
                    writable: true
                }
            });

            try {
                this._sort.head = options.head || 'month';
                this._sort.dateType = options.dateType || 'number';
                this._sort.dateFormat = options.dateFormat || 'short';
                this._sort.method = returnSortMapByType['date'];
            } catch (err) {
                throw err;
            }
        }
    };

    function renderElemList() {
        var units = this._units;

        this._elemList = document.createElement('div');
        this._elemList.className = 'handyList';
        this._elemList.id = 'handyList__id' + this.id;

        this._elemList.style.minWidth = this.style.minWidth;
        this._elemList.style.maxWidth = this.style.maxWidth;
        this._elemList.style.minHeight = this.style.minHeight;
        this._elemList.style.maxHeight = this.style.maxHeight;
        this._elemList.style.width = this.style.width;
        this._elemList.style.height = this.style.height;
        this._elemList.style.fontFamily = this.style.fontFamily;
        this._elemList.style.fontSize = this.style.fontSize;

        var contentElem = document.createElement('div');
        contentElem.className = 'content';
        contentElem.style.marginTop = '0' + units;
        contentElem.style.top = '0' + units;
        contentElem.style.left = '0' + units;

        sortAndRenderItems.call(this, contentElem);
        addListners.call(this);

        this._elemList.appendChild(contentElem);
    }

    function sortAndRenderItems(contentElem) {
        this._sort.map = this._sort.method.call(this);

        var groupElem;

        var headIndex, headIndexNew;

        var item, itemElem, itemContent;

        var _this = this;
        this._sort.map.forEach(function(e, i) {
            headIndexNew = e.value;
            if (headIndex == null || headIndexNew > headIndex) {
                headIndex = headIndexNew;

                groupElem = returnNewGroupItem.call(_this, returnHeadByType[_this._sort.type].call(_this, e));
                contentElem.appendChild(groupElem);
            }

            itemElem = document.createElement('li');
            itemContent = returnItemElemContent.call(_this, e, i);
            itemElem.appendChild(itemContent);

            groupElem.appendChild(itemElem);
        });
    }

    function returnNewGroupItem(headIndex) {
        var units = this._units;

        var groupElem = document.createElement('ul');
        groupElem.className = 'group';

        var itemElem = document.createElement('li');
        itemElem.className = 'header';
        itemElem.innerHTML = headIndex.toUpperCase();
        itemElem.style.marginTop = '0' + units;
        itemElem.style.top = '0' + units;
        itemElem.style.left = '0' + units;

        groupElem.appendChild(itemElem);
        return groupElem;
    }

    function returnItemElemContent(mapItem, id) {
        var aElem = document.createElement('a');
        aElem.setAttribute('href', '#handyList__id' + this.id + '_' + id);

        var itemStr = '';
        var indexSort = this._sort.index;

        var i, item = this.items[mapItem.index];
        for (i in item) {
            if (i === indexSort) {
                itemStr += returnItemByType[this._sort.type].call(this, mapItem, i);
            } else {
                if (typeof item[i] !== 'object' && !Array.isArray(item[i]))
                    itemStr += item[i] + ' ';
            }
        }

        aElem.innerHTML = itemStr;
        return aElem;
    }

    function returnSortMap(map) {
        map.sort(function(a, b) {
            return +(a.value > b.value) || +(a.value === b.value) - 1;
        });

        return map;
    }

    function addListners() {
        this.addEvent('mousedown', mouseDown);
        this.addEvent('mousemove', mouseMove);
        this.addEvent('wheel', mouseWheel);
        this.addEvent('mouseup', mouseUpOrLeave);
        this.addEvent('mouseleave', mouseUpOrLeave);

        this.addEvent('click', mouseClick);
    }

    function mouseDown(event) {
        event.preventDefault();

        var contentElem = this._elemList.firstChild;

        this._mouseStart = getMousePosition(event, this._elemList);
        this._positionStart = {
            x: parseInt(contentElem.style.left),
            y: parseInt(contentElem.style.top)
        };
    }

    function mouseMove(event) {
        if (this._mouseStart) {
            var coords = getMousePosition(event, this._elemList);
            var scroll = scrollHandyList.call(this, {
                x: coords.x - this._mouseStart.x,
                y: coords.y - this._mouseStart.y
            });
            if (!scroll)
                this._mouseStart = coords;
        }
    }

    function mouseWheel(event) {
        var contentElem = this._elemList.firstChild;
        this._positionStart = {
            x: parseInt(contentElem.style.left),
            y: parseInt(contentElem.style.top)
        };

        scrollHandyList.call(this, {
            x: event.deltaX,
            y: event.deltaY
        });

        mouseUpOrLeave.call(this, event);
    }

    function scrollHandyList(scroll) {
        var contentElem = this._elemList.firstChild;
        if (!this._sizeHead) {
            var group = contentElem.firstChild;
            var list = group.children;

            this._sizeHead = list[0].offsetHeight;

            var units = this._units;
            contentElem.style.marginTop = this._sizeHead + units;

            setActiveGroup.call(this, group);
        }

        var scroll = scrollByType[this.orientation].call(this, scroll);
        return scroll;
    }

    var scrollByType = {
        vertical: function(coords) {
            var units = this._units;

            var contentElem = this._elemList.firstChild;
            var head = this._activeGroup.firstElementChild;

            var oldPosition = parseInt(contentElem.style.top);
            var position = this._positionStart.y + coords.y;
            var offset = position - oldPosition;

            var allHeight = contentElem.offsetHeight + this._sizeHead;
            var styleHeight = parseInt(this.style.height);
            if (allHeight + position < styleHeight) {
                setGroupPosition.call(this, allHeight - styleHeight);
                correctGroupPosition.call(this);
                return false;
            }

            contentElem.style.top = position + units;
            var sizeGroup = this._sizeGroup + this._borderSize;

            if (offset < 0) {
                if (!this._moveAll) {
                    if (Math.abs(position) <= sizeGroup) {
                        head.style.top = -position + units;
                    } else {
                        setGroupPosition.call(this, sizeGroup + this._borderSize);
                        this._moveAll = true;
                        return false;
                    }
                } else {
                    if (Math.abs(position) > this._sizeGroup + this._sizeHead) {
                        setGroupPosition.call(this, 0);

                        head.classList.remove('active');
                        this._activeGroup.classList.add('hide');

                        var nextGroup = this._activeGroup.nextElementSibling;
                        setActiveGroup.call(this, nextGroup);

                        this._moveAll = false;
                        return false;
                    }
                }
            } else if (offset > 0) {
                if (!this._moveAll) {
                    if (position < 0) {
                        head.style.top = -position + units;
                    } else {
                        var previousGroup = this._activeGroup.previousElementSibling;
                        if (previousGroup) {
                            previousGroup.classList.remove('hide');

                            head.classList.remove('active');
                            head.style.marginTop = '0' + units;

                            setActiveGroup.call(this, previousGroup);
                            setGroupPosition.call(this, this._sizeGroup + this._sizeHead);

                            var head = this._activeGroup.firstElementChild;
                            head.style.top = this._sizeGroup + this._borderSize + units;

                            this._moveAll = true;
                        } else {
                            setGroupPosition.call(this, 0);
                        }
                        return false;
                    }
                } else {
                    if (Math.abs(position) < this._sizeGroup + this._borderSize * 2) {
                        this._moveAll = false;
                    }
                }
            }

            return true;
        },
        horizontal: function() {}
    }

    function correctGroupPosition() {
        var units = this._units;

        var group = this._activeGroup;
        var contentElem = this._elemList.firstChild;
        var positionContent = parseInt(contentElem.style.top);
        var head = group.firstElementChild;

        var positionElem = getTegPosition(this._elemList).top;
        var positionHead = getTegPosition(head).top - positionElem;
        if (positionHeadNext)
            var positionHeadNext = getTegPosition(group.nextElementSibling).top - positionElem;

        var sizeGroup = this._sizeGroup + this._borderSize;
        if (positionContent > 0 && positionHead > 0) {
            setGroupPosition.call(this, sizeGroup);
        } else if (positionContent <= 0 && positionHead > 0 && (-positionHead) !== positionContent) {
            head.style.top = -positionContent + units;
        } else if (positionHeadNext && positionHeadNext < positionHead + this._sizeHead) {
            head.style.top = sizeGroup + units;
        }
    }

    function setGroupPosition(position) {
        var units = this._units;

        var contentElem = this._elemList.firstChild;
        var head = this._activeGroup.firstElementChild;

        this._positionStart.y = -position;
        contentElem.style.top = this._positionStart.y + units;
        head.style.top = position + units;
    }

    function setActiveGroup(group) {
        var units = this._units;

        var sizeGroup = group.offsetHeight;
        this._activeGroup = group;

        var head = group.firstElementChild;
        head.classList.add('active');

        head.style.marginTop = -this._sizeHead + units;
        head.style.top = '0' + units;
        head.style.left = '0' + units;

        this._sizeGroup = sizeGroup - this._sizeHead;

        return head;
    }

    function mouseUpOrLeave(event) {
        if (this._activeGroup) {
            correctGroupPosition.call(this);
        }

        this._mouseStart = null;
        this._positionStart = null;
    }

    function mouseClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
        }
    }

    function getMousePosition(event, target) {
        var rect = target || event.target;
        rect = rect.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function getTegPosition(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    (function(e) {
        e.matches || (e.matches = e.matchesSelector || function(selector) {
            var matches = document.querySelectorAll(selector),
                th = this;
            return Array.prototype.some.call(matches, function(e) {
                return e === th;
            });
        });

        e.closest = e.closest || function(css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        }
    })(Element.prototype);

    function PropertyError(property) {
        this.name = 'PropertyError';

        this.property = property;
        this.message = 'Error in property "' + property + '"';

        switch (property) {
            case 'items':
                this.message += '. It should be an Array';
                break;
            case 'orientation':
                this.message += '. It should be "vertical" or "horizontal"';
                break;
            case 'type':
                var keys = Object.keys(setSortType).join('" or "');
                this.message += '. It should be "' + keys + '"';
                break;
            case 'head':
                this.message += '. It should be "day" or "month" or "year" for sort type "date"' +
                    'or Number > 0 for sort type "string"';
                break;
            case 'dateType':
                this.message += '. It should be "string" or "number"';
                break;
            case 'dateFormat':
                this.message += '. It should be "short" or "long"';
                break;
            case 'method':
                this.message += '. It should be function';
                break;
            default:
                break;
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PropertyError);
        } else {
            this.stack = (new Error()).stack;
        }
    }
    PropertyError.prototype = Object.create(Error.prototype);

    var returnHeadByType = {
        string: function(mapItem) {
            return mapItem.value;
        },
        date: function(mapItem) {
            var head = mapItem.value;
            if (this._sort.head === 'month') {
                return getMonthIntToString('ru', head);
            }

            return head;
        }
    };

    var returnItemByType = {
        string: function(mapItem, i) {
            var item = this.items[mapItem.index];
            return '<b>' + item[i] + '</b> ';
        },
        date: function(mapItem, i) {
            var str = '- ';
            if (!this._sort.formatInput) {
                var item = cloneObject(this.items[mapItem.index][i]);
                if (this._sort.head === 'month' && isNumber(item.month)) {
                    item.month++;
                }
            } else {
                var item = getDateComponents(mapItem.date);
                if (this._sort.dateType === 'number') {
                    if (this._sort.dateFormat === 'short')
                        item.year = (item.year.toString()).slice(-2);
                } else if (this._sort.dateType === 'string') {
                    var month = getMonthIntToString('ru', mapItem.date.getMonth());
                    if (this._sort.dateFormat === 'long')
                        item.month = month;
                    else if (this._sort.dateFormat === 'short')
                        item.month = month.slice(0, 3);
                }
            }

            var j;
            for (j in item) {
                if (j === this._sort.head) {
                    str += '<b>' + item[j] + '</b>';
                } else {
                    str += item[j];
                }
                if (this._sort.dateType === 'string' || !this._sort.formatInput) {
                    str += ' ';
                } else {
                    str += '.';
                }
            }
            return str.slice(0, -1);
        }
    };

    function cloneObject(obj) {
        var clone = {};
        for (var key in obj) {
            clone[key] = obj[key];
        }
        return clone;
    }

    function getDateComponents(date) {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();

        return {
            day: day < 10 ? '0' + day : day,
            month: month < 10 ? '0' + month : month,
            year: year
        };
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var returnSortMapByType = {
        string: function() {
            var index = this._sort.index;
            var list = this.items;
            var len = this._sort.head;

            var map = list.map(function(e, i) {
                var value = e[index].toLowerCase();
                return {
                    index: i,
                    value: value.slice(0, len)
                };
            });

            return returnSortMap(map);
        },
        date: function() {
            var index = this._sort.index;
            var list = this.items;
            var _this = this;

            var map = list.map(function(e, i) {
                var value = e[index];
                var month = getMonthStringToInt(value.month);

                var head;
                if (_this._sort.head === 'day') {
                    head = value.day;
                } else if (_this._sort.head === 'month') {
                    head = month;
                } else if (_this._sort.head === 'year') {
                    head = value.year;
                }
                return {
                    index: i,
                    value: head,
                    date: new Date(parseInt(value.year), month, parseInt(value.day))
                };
            });

            return returnSortMap(map);
        }
    };

    function getMonthStringToInt(month) {
        if (typeof month === 'string') {
            var str = month.slice(0, 3).toLowerCase();
            switch (str) {
                case 'jan':
                case 'янв':
                    return 0;
                    break;
                case 'feb':
                case 'фев':
                    return 1;
                    break;
                case 'mar':
                case 'мар':
                    return 2;
                    break;
                case 'apr':
                case 'апр':
                    return 3;
                    break;
                case 'may':
                case 'май':
                    return 4;
                    break;
                case 'jun':
                case 'июн':
                    return 5;
                    break;
                case 'jul':
                case 'июл':
                    return 6;
                    break;
                case 'aug':
                case 'авг':
                    return 7;
                    break;
                case 'sep':
                case 'сен':
                    return 8;
                    break;
                case 'oct':
                case 'окт':
                    return 9;
                    break;
                case 'nov':
                case 'ноя':
                    return 10;
                    break;
                case 'dec':
                case 'дек':
                    return 11;
                    break;
            }

            return parseInt(month);
        } else if (typeof month === 'number')
            return month;
    }

    function getMonthIntToString(loc, month) {
        if (typeof month !== 'number')
            return;

        if (loc === 'ru') {
            switch (month) {
                case 0:
                    return 'Январь';
                    break;
                case 1:
                    return 'Февраль';
                    break;
                case 2:
                    return 'Март';
                    break;
                case 3:
                    return 'Апрель';
                    break;
                case 4:
                    return 'Май';
                    break;
                case 5:
                    return 'Июнь';
                    break;
                case 6:
                    return 'Июль';
                    break;
                case 7:
                    return 'Август';
                    break;
                case 8:
                    return 'Сентябрь';
                    break;
                case 9:
                    return 'Октябрь';
                    break;
                case 10:
                    return 'Ноябрь';
                    break;
                case 11:
                    return 'Декабрь';
                    break;
            }
        } else if (loc === 'en') {
            switch (month) {
                case 0:
                    return 'January';
                    break;
                case 1:
                    return 'February';
                    break;
                case 2:
                    return 'March';
                    break;
                case 3:
                    return 'April';
                    break;
                case 4:
                    return 'May';
                    break;
                case 5:
                    return 'June';
                    break;
                case 6:
                    return 'July';
                    break;
                case 7:
                    return 'August';
                    break;
                case 8:
                    return 'September';
                    break;
                case 9:
                    return 'October';
                    break;
                case 10:
                    return 'November';
                    break;
                case 11:
                    return 'December';
                    break;
            }
        }
    }

    return HandyList;
});