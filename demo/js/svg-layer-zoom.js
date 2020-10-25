var svgLayerZoom = /** @class */ (function () {
    function svgLayerZoom(_config) {
        var _this = this;
        this._config = _config;
        this._events = {};
        this._eventsOnce = [];
        this._enabled = true;
        this._isZoomed = false;
        this._isAnimating = false;
        this._generateEvents = function () {
            Object.keys(svgLayerZoom.EVENTS).forEach(function (_key) {
                _this._events[svgLayerZoom.EVENTS[_key]] = [];
            });
        };
        this._boxZoom = function (box, centroid) {
            var zoomMidX = centroid[0];
            var zoomMidY = centroid[1];
            var zoomScale = Math.min(_this._width / box[1][0], _this._height / box[1][1], _this._config.zoomMax);
            var ratioX = _this._containerElt.offsetWidth / _this._width;
            var ratioY = _this._containerElt.offsetHeight / _this._height;
            var ratio = Math.min(ratioX, ratioY);
            _this._isZoomed = true;
            var evtData = {
                tX: zoomMidX * ratio,
                tY: zoomMidY * ratio,
                box: box,
                scale: zoomScale * ratio,
                ratio: ratio,
                ratioX: ratioX,
                ratioY: ratioY
            };
            _this.trigger(svgLayerZoom.EVENTS.BEFORE_ZOOM, evtData);
            _this._containerElt.classList.add(svgLayerZoom._containerZoomedClass);
            _this._isAnimating = true;
            _this.imgMap.zoomable.zoomable.zoomAt(evtData.tX, evtData.tY, evtData.scale, true, true);
            _this.imgMap.zoomable.zoomable.apply(_this._config.animDuration > 0, _this._config.animDuration);
            setTimeout(function () {
                _this._isAnimating = false;
                _this.trigger(svgLayerZoom.EVENTS.AFTER_ZOOM, evtData);
            }, (_this._config.animDuration * 1000));
        };
        this._getBoundingBox = function (selection) {
            /* get x,y co-ordinates of top-left of bounding box and width and height */
            var bbox = selection.node().getBBox();
            var cx = bbox.x + bbox.width / 2;
            var cy = bbox.y + bbox.height / 2;
            return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
        };
        /** EVENTS **/
        this.on = function (eventName, handler) {
            if (_this._events[eventName]) {
                _this._events[eventName].push(handler);
            }
        };
        this.one = function (eventName, handler) {
            if (_this._events[eventName]) {
                _this._events[eventName].push(handler);
                _this._eventsOnce.push(handler);
            }
        };
        this.off = function (eventName, handler) {
            if (_this._events[eventName] && (_this._events[eventName].indexOf(handler) !== -1)) {
                _this._events[eventName].splice(_this._events[eventName].indexOf(handler), 1);
            }
            if (_this._eventsOnce.indexOf(handler) !== -1) {
                _this._eventsOnce.splice(_this._eventsOnce.indexOf(handler), 1);
            }
        };
        this.trigger = function (eventName, data) {
            if (_this._events[eventName]) {
                _this._events[eventName].forEach(function (_handler, _index) {
                    _handler(data);
                    if (_this._eventsOnce.indexOf(_handler) !== -1) {
                        _this._events[eventName].splice(_index, 1);
                        _this._eventsOnce.splice(_this._eventsOnce.indexOf(_handler), 1);
                    }
                });
            }
        };
        if (typeof d3 === 'undefined') {
            console.error("svgLayerZoom :: d3.js dependency not found.");
            return;
        }
        if (typeof Zoomable === 'undefined') {
            console.error("svgLayerZoom :: zoomable.js dependency not found.");
            return;
        }
        if (typeof ImageMap === 'undefined') {
            console.error("svgLayerZoom :: ImageMap.js dependency not found.");
            return;
        }
        if (!this._config.containerSelector) {
            console.error("svgLayerZoom :: containerSelector option is mandatory.");
            return;
        }
        if (!this._config.svgSelector) {
            console.error("svgLayerZoom :: svgSelector option is mandatory.");
            return;
        }
        if (!this._config.svgLayersSelector) {
            console.error("svgLayerZoom :: svgLayersSelector option is mandatory.");
            return;
        }
        this._config.zoomMax = (typeof this._config.zoomMax === 'number') ? this._config.zoomMax : 30;
        this._config.animDuration = (typeof this._config.animDuration === 'number') ? this._config.animDuration : 0.75;
        this._config.classActive = (typeof this._config.classActive === 'string') ? this._config.classActive : 'active-zone';
        this._config.changeLayerWhenZoomed = (typeof this._config.changeLayerWhenZoomed === 'boolean') ? this._config.changeLayerWhenZoomed : true;
        this._config.autoZoom = (typeof this._config.autoZoom === 'boolean') ? this._config.autoZoom : true;
        this._config.autoUnzoom = (typeof this._config.autoUnzoom === 'boolean') ? this._config.autoUnzoom : true;
        this._init();
        return this;
    }
    /** PRIVATE **/
    svgLayerZoom.prototype._init = function () {
        var _this = this;
        this._generateEvents();
        this._containerElt = document.querySelector(this._config.containerSelector);
        this._containerElt.setAttribute('touch-action', 'none');
        this._svgElt = document.querySelector(this._config.svgSelector);
        this.imgMap = new ImageMap(this._containerElt, this._svgElt, {
            gestures: {
                doubleTap: true,
                onDoubleTap: function () {
                    if (_this._isZoomed) {
                        _this.resetZoom();
                    }
                    return false;
                },
                pan: false,
                zoom: false
            }
        });
        this._width = this._svgElt.width.baseVal.value;
        this._height = this._svgElt.height.baseVal.value;
        this._svgD3 = d3.select(this._config.svgSelector);
        window.addEventListener('resize', function () {
            _this._svgD3.selectAll('*').classed(self._config.classActive, false);
            _this.resetZoom(_this._isZoomed);
        });
        var self = this;
        this._svgD3.selectAll(this._config.svgLayersSelector).on("pointerdown", function () {
            if (self._isAnimating || (!self._enabled)) {
                return false;
            }
            var currentPath = d3.select(this);
            if (currentPath.classed(self._config.classActive)) {
                if (self._config.autoUnzoom) {
                    self._svgD3.selectAll(this.tagName).classed(self._config.classActive, false);
                    self.resetZoom();
                }
            }
            else {
                if (((!self._config.changeLayerWhenZoomed) && (self._isZoomed)) || (!self._config.autoZoom)) {
                    return false;
                }
                self._svgD3.selectAll(this.tagName).classed(self._config.classActive, false);
                currentPath.classed(self._config.classActive, true);
                var bbox = self._getBoundingBox(currentPath);
                self._boxZoom([[bbox[0], bbox[2]], [bbox[1], bbox[3]]], [bbox[4], bbox[5]]);
            }
        });
    };
    ;
    /** PUBLIC **/
    svgLayerZoom.prototype.isZoomed = function () {
        return this._isZoomed;
    };
    ;
    svgLayerZoom.prototype.isEnabled = function () {
        return this._enabled;
    };
    ;
    svgLayerZoom.prototype.enable = function () {
        this._enabled = true;
    };
    ;
    svgLayerZoom.prototype.disable = function () {
        this._enabled = false;
    };
    ;
    svgLayerZoom.prototype.zoomOnSelector = function (selector) {
        if (this._isAnimating) {
            return false;
        }
        var domElt = this._svgD3.select(selector)._groups[0][0];
        if (!domElt) {
            return false;
        }
        var layer = d3.select(domElt);
        this._svgD3.selectAll(domElt.tagName).classed(this._config.classActive, false);
        layer.classed(this._config.classActive, true);
        var bbox = this._getBoundingBox(layer);
        this._boxZoom([[bbox[0], bbox[2]], [bbox[1], bbox[3]]], [bbox[4], bbox[5]]);
        return true;
    };
    ;
    svgLayerZoom.prototype.getSelectorBBox = function (selector) {
        if (this._isAnimating) {
            return false;
        }
        var domElt = this._svgD3.select(selector)._groups[0][0];
        if (!domElt) {
            return false;
        }
        var layer = d3.select(domElt);
        var _bbox = this._getBoundingBox(layer);
        return (_bbox) ? {
            bbox: {
                x: _bbox[0],
                y: _bbox[2],
                width: _bbox[1],
                height: _bbox[3]
            },
            center: {
                x: _bbox[4],
                y: _bbox[5]
            }
        } : false;
    };
    svgLayerZoom.prototype.resetZoom = function (triggerEvent) {
        var _this = this;
        if (triggerEvent === void 0) { triggerEvent = true; }
        this._isZoomed = false;
        var evtData = {
            scale: this.imgMap.zoomable.initialScale
        };
        if (triggerEvent) {
            this.trigger(svgLayerZoom.EVENTS.BEFORE_UNZOOM, evtData);
        }
        this._containerElt.classList.remove(svgLayerZoom._containerZoomedClass);
        this._isAnimating = true;
        //TODO :: get zoom and translate values for evtData
        this.imgMap.resetZoom(this._config.animDuration > 0, this._config.animDuration);
        setTimeout(function () {
            _this._isAnimating = false;
            if (triggerEvent) {
                _this.trigger(svgLayerZoom.EVENTS.AFTER_UNZOOM, evtData);
            }
        }, (this._config.animDuration * 1000));
    };
    ;
    svgLayerZoom.EVENTS = {
        BEFORE_ZOOM: 'before_zoom',
        AFTER_ZOOM: 'after_zoom',
        BEFORE_UNZOOM: 'before_unzoom',
        AFTER_UNZOOM: 'after_unzoom'
    };
    svgLayerZoom._containerZoomedClass = 'zoomed';
    return svgLayerZoom;
}());
