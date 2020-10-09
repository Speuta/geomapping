var geoMapping = /** @class */ (function () {
    function geoMapping(_config) {
        var _this = this;
        this._config = _config;
        this._events = {};
        this._eventsOnce = [];
        this._bbox = undefined;
        this._points = [];
        this._img = undefined;
        this._watchPositionId = undefined;
        this._generateEvents = function () {
            Object.keys(geoMapping.EVENTS).forEach(function (_key) {
                _this._events[geoMapping.EVENTS[_key]] = [];
            });
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
        if (!this._config.boundingBox) {
            console.error("geoMapping :: boundingBox is mandatory.");
            return;
        }
        /*if(!this._config.imgSrc){
            console.error(`geoMapping :: imgSrc is mandatory.`);
            return;
        }*/
        this._init();
        return this;
    }
    /** PRIVATE **/
    geoMapping.prototype._init = function () {
        var _this = this;
        this._generateEvents();
        var _initBboxAndPoints = function () {
            _this._bbox = _this._getStaticMapBoundingBoxFromTwoPoints(_this._config.boundingBox[0], _this._config.boundingBox[1]);
            if (_this._config.points && _this._config.points.length > 0) {
                _this._config.points.forEach(function (_pt) {
                    _this._addPoint(_pt.lat, _pt.lng, _pt.name);
                });
            }
            _this.trigger(geoMapping.EVENTS.READY);
        };
        if (typeof this._config.imgSrc === 'string') {
            this._preloadImg(this._config.imgSrc, function (img) {
                _this._img = img;
                _initBboxAndPoints();
            }, function (err) {
                console.error("geoMapping :: error on preloading " + _this._config.imgSrc, err);
            });
        }
        else if (this._config.imgSrc) {
            this._img = this._config.imgSrc;
            _initBboxAndPoints();
        }
        else {
            _initBboxAndPoints();
        }
    };
    ;
    geoMapping.prototype._preloadImg = function (src, success, error) {
        var image = new Image();
        image.onload = function () {
            if (typeof success === 'function') {
                success(image);
            }
        };
        image.onerror = function (err) {
            if (typeof error === 'function') {
                error(err);
            }
        };
        image.src = src;
    };
    ;
    geoMapping.prototype._lngToX = function (lng) {
        return Math.round(geoMapping.PIXELS_OFFSET + geoMapping.PIXELS_RADIUS * lng * Math.PI / 180);
    };
    ;
    geoMapping.prototype._latToY = function (lat) {
        return Math.round(geoMapping.PIXELS_OFFSET - geoMapping.PIXELS_RADIUS *
            Math.log((1 + Math.sin(lat * Math.PI / 180)) /
                (1 - Math.sin(lat * Math.PI / 180))) / 2);
    };
    ;
    geoMapping.prototype._XToLon = function (x) {
        return ((Math.round(x) - geoMapping.PIXELS_OFFSET) / geoMapping.PIXELS_RADIUS) * 180 / Math.PI;
    };
    ;
    geoMapping.prototype._YToLat = function (y) {
        return (Math.PI / 2 - 2 * Math.atan(Math.exp((Math.round(y) - geoMapping.PIXELS_OFFSET) / geoMapping.PIXELS_RADIUS))) * 180 / Math.PI;
    };
    ;
    geoMapping.prototype._getStaticMapBoundingBoxFromTwoPoints = function (point1, point2) {
        // Coordinates of the inner bounding box containing the two points
        var box = {
            tl: undefined,
            br: undefined,
            width: undefined,
            height: undefined
        };
        var map = {
            v_scale: undefined,
            h_scale: undefined,
            topLeft: undefined,
            bottomRight: undefined
        };
        // Top left, with lat/longitude as pixel coordinates on full-size Mercator projection
        box.tl = {
            lat: this._latToY(Math.max(point1.lat, point2.lat)),
            lng: this._lngToX(Math.min(point1.lng, point2.lng)),
            x: Math.min(point1.x, point2.x),
            y: Math.min(point1.y, point2.y)
        };
        // Bottom right, with lat/longitude as pixel coordinates on full-size Mercator projection
        box.br = {
            lat: this._latToY(Math.min(point1.lat, point2.lat)),
            lng: this._lngToX(Math.max(point1.lng, point2.lng)),
            x: Math.max(point1.x, point2.x),
            y: Math.max(point1.y, point2.y)
        };
        // Box width and height
        box.width = box.br.x - box.tl.x;
        box.height = box.br.y - box.tl.y;
        // Horizontal and vertical distance in pixels on full-size projection
        var v_delta = box.br.lat - box.tl.lat;
        var h_delta = box.br.lng - box.tl.lng;
        // Get scale from the distance applied to map size
        map.v_scale = v_delta / box.height;
        map.h_scale = h_delta / box.width;
        // Get map top left
        map.topLeft = {
            x: box.tl.lng - (box.tl.x * map.h_scale),
            y: box.tl.lat - (box.tl.y * map.v_scale)
        };
        map.topLeft.lat = this._YToLat(map.topLeft.y);
        map.topLeft.lng = this._XToLon(map.topLeft.x);
        map.bottomRight = {
            x: box.br.lng + ((box.width - box.br.x) * map.h_scale),
            y: box.br.lat + ((box.height - box.br.y) * map.v_scale)
        };
        map.bottomRight.lat = this._YToLat(map.bottomRight.y);
        map.bottomRight.lng = this._XToLon(map.bottomRight.x);
        return map;
    };
    ;
    geoMapping.prototype._getPointXYOnStaticMap = function (lat, lng, map) {
        return {
            lat: lat,
            lng: lng,
            x: (this._lngToX(lng) - map.topLeft.x) / map.h_scale,
            y: (this._latToY(lat) - map.topLeft.y) / map.v_scale
        };
    };
    ;
    geoMapping.prototype._getPointLatLongOnStaticMap = function (x, y, map) {
        return {
            lat: this._YToLat(map.topLeft.y + (y * map.v_scale)),
            lng: this._XToLon(map.topLeft.x + (x * map.h_scale))
        };
    };
    ;
    geoMapping.prototype._addPoint = function (lat, lng, name) {
        var _point = this._getPointXYOnStaticMap(lat, lng, this._bbox);
        _point.name = name;
        _point.isOutOfMap = this._isOutOfImage(_point.x, _point.y);
        this._points.push(_point);
        return _point;
    };
    ;
    geoMapping.prototype._isOutOfImage = function (x, y) {
        if (this._img) {
            return !((x >= 0) && (x <= this._img.width) && (y >= 0) && (y <= this._img.height));
        }
        else {
            return false;
        }
    };
    ;
    /** PUBLIC **/
    geoMapping.prototype.getPoints = function () {
        return this._points;
    };
    ;
    geoMapping.prototype.addPoint = function (lat, lng, name) {
        var point = this._addPoint(lat, lng, name);
        this.trigger(geoMapping.EVENTS.ADD, point);
        return point;
    };
    ;
    geoMapping.prototype.removePoint = function (pointName) {
        var _this = this;
        this._points.forEach(function (_pt, _index) {
            if (_pt.name === pointName) {
                _this._points.splice(_index, 1);
                _this.trigger(geoMapping.EVENTS.REMOVE, _pt);
            }
        });
    };
    ;
    geoMapping.prototype.getLatLngOnMap = function (x, y) {
        //FIXME :: set in config if test isOutOfImage mandatory
        if (this._isOutOfImage(x, y)) {
            console.error("geoMapping :: this point is out of map.");
            return;
        }
        return this._getPointLatLongOnStaticMap(x, y, this._bbox);
    };
    ;
    geoMapping.prototype.getPointXYOnMap = function (lat, lng) {
        return this._getPointXYOnStaticMap(lat, lng, this._bbox);
    };
    ;
    geoMapping.prototype.trackPosition = function (_error) {
        var _this = this;
        if ((!window.navigator) || (!window.navigator.geolocation)) {
            console.error("geoMapping :: error on trackPosition :: geolocation unavailable");
            if (typeof _error === 'function') {
                _error("geoMapping :: error on trackPosition :: geolocation unavailable");
            }
            return;
        }
        if (!this._watchPositionId) {
            this._watchPositionId = navigator.geolocation.watchPosition(function (_pos) {
                _this.trigger(geoMapping.EVENTS.UPDATE_POSITION, _this._getPointXYOnStaticMap(_pos.coords.latitude, _pos.coords.longitude, _this._bbox));
            }, function (err) {
                console.error("geoMapping :: error on trackPosition", err);
                if (typeof _error === 'function') {
                    _error("geoMapping :: error on trackPosition", err);
                }
            });
        }
        else {
            console.warn("geoMapping :: already tracking position");
        }
    };
    ;
    geoMapping.prototype.stopTrackPosition = function () {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
            this._watchPositionId = undefined;
            this.trigger(geoMapping.EVENTS.STOP_POSITION);
        }
        else {
            console.warn("geoMapping :: tracking position is not activated");
        }
    };
    ;
    geoMapping.PIXELS_OFFSET = 268435456;
    geoMapping.PIXELS_RADIUS = 85445659.4471; /* PIXELS_OFFSET / pi() */
    geoMapping.EARTH_RADIUS = 6378.1; // Average radius of earth (in kilometers)
    geoMapping.EVENTS = {
        READY: 'ready',
        ADD: 'add',
        REMOVE: 'remove',
        UPDATE_POSITION: 'update_position',
        STOP_POSITION: 'stop_position'
    };
    return geoMapping;
}());
