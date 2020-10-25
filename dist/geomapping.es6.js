console.log("geomapping v0.0.2")

class GeoMapping {
    static PIXELS_OFFSET = 268435456;
    static PIXELS_RADIUS = 85445659.4471; /* PIXELS_OFFSET / pi() */

    static EVENTS = {
        READY: 'ready',
        ADD: 'add',
        REMOVE: 'remove',
        UPDATE_POSITION: 'update_position',
        STOP_POSITION: 'stop_position'
    };
    _events = {};
    _eventsOnce = [];

    _bbox = undefined;
    _points = [];
    _img = undefined;
    _watchPositionId = undefined;

    constructor(_config) {
        this._config = _config;
        if(!this._config.boundingBox){
            console.error(`GeoMapping :: boundingBox is mandatory.`);
            return;
        }
        if(typeof this._config.testOutOfImage !== 'boolean'){
            this._config.testOutOfImage = false;
        }
        this._init();
        return this;
    }


    _init() {
        this._generateEvents();
        let _initBboxAndPoints = () => {
            this._bbox = this._getStaticMapBoundingBoxFromTwoPoints(
                this._config.boundingBox[0],
                this._config.boundingBox[1]
            );
            if(this._config.points && this._config.points.length > 0){
                this._config.points.forEach((_pt) => {
                    this._addPoint(_pt.lat, _pt.lng, _pt.id, _pt.data);
                });
            }
            this.trigger(GeoMapping.EVENTS.READY);
        };
        if(typeof this._config.imgSrc === 'string'){
            this._preloadImg(this._config.imgSrc, (img) => {
                this._img = img;
                _initBboxAndPoints();
            }, (err) => {
                console.error(`GeoMapping :: error on preloading ${this._config.imgSrc}`, err);
            });
        } else if(this._config.imgSrc) {
            this._img = this._config.imgSrc;
            _initBboxAndPoints();
        } else {
            _initBboxAndPoints();
        }
    };

    _generateEvents = () => {
        Object.keys(GeoMapping.EVENTS).forEach((_key) => {
            this._events[GeoMapping.EVENTS[_key]] = [];
        });
    };

    _preloadImg(src, success, error){
        let image = new Image();
        image.onload = () => {
            if(typeof success === 'function'){
                success(image);
            }
        };
        image.onerror = (err) => {
            if(typeof error === 'function'){
                error(err);
            }
        };
        image.src = src;
    };

    _lngToX(lng) {
        return Math.round(GeoMapping.PIXELS_OFFSET + GeoMapping.PIXELS_RADIUS * lng * Math.PI / 180);
    };

    _latToY(lat) {
        return Math.round(GeoMapping.PIXELS_OFFSET - GeoMapping.PIXELS_RADIUS *
            Math.log((1 + Math.sin(lat * Math.PI / 180)) /
                (1 - Math.sin(lat * Math.PI / 180))) / 2);
    };

    _XToLon(x) {
        return ((Math.round(x) - GeoMapping.PIXELS_OFFSET) / GeoMapping.PIXELS_RADIUS) * 180 / Math.PI;
    };

    _YToLat(y) {
        return (Math.PI / 2 - 2 * Math.atan(Math.exp((Math.round(y) - GeoMapping.PIXELS_OFFSET) / GeoMapping.PIXELS_RADIUS))) * 180 / Math.PI;
    };

    _getStaticMapBoundingBoxFromTwoPoints(point1, point2) {
        // Coordinates of the inner bounding box containing the two points
        let box = {
            tl: undefined,
            br: undefined,
            width: undefined,
            height: undefined
        };
        let map = {
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
        let v_delta = box.br.lat - box.tl.lat;
        let h_delta = box.br.lng - box.tl.lng;

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

    _getPointXYOnStaticMap(lat, lng, map) {
        return {
            lat: lat,
            lng: lng,
            x: (this._lngToX(lng) - map.topLeft.x) / map.h_scale,
            y: (this._latToY(lat) - map.topLeft.y) / map.v_scale
        };
    };

    _getPointLatLongOnStaticMap(x, y, map) {
        return {
            lat: this._YToLat(map.topLeft.y + (y * map.v_scale)),
            lng: this._XToLon(map.topLeft.x + (x * map.h_scale))
        };
    };

    _addPoint(lat, lng, id, data) {
        let _point = this._getPointXYOnStaticMap(lat, lng, this._bbox);
        _point.id = id;
        _point.data = data;
        _point.isOutOfMap = this._isOutOfImage(_point.x, _point.y);
        this._points.push(_point);
        return _point;
    };

    _isOutOfImage(x, y) {
        if(this._img){
            return !((x >= 0) && (x <= this._img.width) && (y >= 0) && (y <= this._img.height));
        } else {
            return false;
        }
    };

    getPoints() {
        return this._points;
    };

    getPointById(id) {
        return this._points.find((_p) => {
            return _p.id === id;
        });
    };

    filterPointsByData(key, value) {
        return this._points.filter((_p) => {
            return (_p.data) && (_p.data[key]) && (_p.data[key] == value);
        });
    };

    addPoint(lat, lng, id, data) {
        let point = this._addPoint(lat, lng, id, data);
        this.trigger(GeoMapping.EVENTS.ADD, point);
        return point;
    };

    removePoint(pointId){
        this._points.forEach((_pt, _index) => {
            if(_pt.id === pointId){
                this._points.splice(_index, 1);
                this.trigger(GeoMapping.EVENTS.REMOVE, _pt);
            }
        });
    };

    getLatLngOnMap(x, y) {
        if((this._config.testOutOfImage) && (this._isOutOfImage(x, y))){
            console.error(`GeoMapping :: this point is out of map.`);
            return;
        }
        return this._getPointLatLongOnStaticMap(x, y, this._bbox);
    };

    getPointXYOnMap(lat, lng) {
        return this._getPointXYOnStaticMap(lat, lng, this._bbox);
    };

    trackPosition(_error){
        if ((!window.navigator) || (!window.navigator.geolocation)) {
            console.error(`GeoMapping :: error on trackPosition :: geolocation unavailable`);
            if(typeof _error === 'function'){
                _error(`GeoMapping :: error on trackPosition :: geolocation unavailable`);
            }
            return;
        }
        if(!this._watchPositionId){
            this._watchPositionId = navigator.geolocation.watchPosition((_pos) => {
                this.trigger(GeoMapping.EVENTS.UPDATE_POSITION,
                    this._getPointXYOnStaticMap(_pos.coords.latitude, _pos.coords.longitude, this._bbox)
                );
            }, (err) => {
                console.error(`GeoMapping :: error on trackPosition`, err);
                if(typeof _error === 'function'){
                    _error(`GeoMapping :: error on trackPosition`, err);
                }
            });
        } else {
            console.warn(`GeoMapping :: already tracking position`);
        }
    };

    stopTrackPosition(){
        if(this._watchPositionId){
            navigator.geolocation.clearWatch(this._watchPositionId);
            this._watchPositionId = undefined;
            this.trigger(GeoMapping.EVENTS.STOP_POSITION);
        } else {
            console.warn(`GeoMapping :: tracking position is not activated`);
        }
    };


    /** EVENTS **/
    on = (eventName, handler) => {
        if(this._events[eventName]){
            this._events[eventName].push(handler);
        }
    };

    one = (eventName, handler) => {
        if(this._events[eventName]){
            this._events[eventName].push(handler);
            this._eventsOnce.push(handler);
        }
    };

    off = (eventName, handler) => {
        if(this._events[eventName] && (this._events[eventName].indexOf(handler) !== -1)){
            this._events[eventName].splice(this._events[eventName].indexOf(handler), 1);
        }
        if(this._eventsOnce.indexOf(handler) !== -1){
            this._eventsOnce.splice(this._eventsOnce.indexOf(handler), 1);
        }
    };

    trigger = (eventName, data) => {
        if(this._events[eventName]){
            this._events[eventName].forEach((_handler, _index) => {
                _handler(data);
                if(this._eventsOnce.indexOf(_handler) !== -1){
                    this._events[eventName].splice(_index, 1);
                    this._eventsOnce.splice(this._eventsOnce.indexOf(_handler), 1);
                }
            });
        }
    };
}

export default GeoMapping;
//# sourceMappingURL=geomapping.es6.js.map
