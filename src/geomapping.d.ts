interface geoMappingConfigInterface {
    boundingBox: any[];
    imgSrc?: any;
    points?: any[];
}
declare class geoMapping {
    private _config;
    static readonly PIXELS_OFFSET = 268435456;
    static readonly PIXELS_RADIUS = 85445659.4471;
    static readonly EARTH_RADIUS = 6378.1;
    static EVENTS: {
        READY: string;
        ADD: string;
        REMOVE: string;
        UPDATE_POSITION: string;
        STOP_POSITION: string;
    };
    private _events;
    private _eventsOnce;
    private _bbox;
    private _points;
    private _img;
    private _watchPositionId;
    constructor(_config: geoMappingConfigInterface);
    /** PRIVATE **/
    private _init;
    private _generateEvents;
    private _preloadImg;
    private _lngToX;
    private _latToY;
    private _XToLon;
    private _YToLat;
    private _getStaticMapBoundingBoxFromTwoPoints;
    private _getPointXYOnStaticMap;
    private _getPointLatLongOnStaticMap;
    private _addPoint;
    private _isOutOfImage;
    /** PUBLIC **/
    getPoints(): any[];
    addPoint(lat: number, lng: number, name: string): any;
    removePoint(pointName: string): void;
    getLatLngOnMap(x: number, y: number): any;
    getPointXYOnMap(lat: number, lng: number): any;
    trackPosition(_error: any): void;
    stopTrackPosition(): void;
    /** EVENTS **/
    on: (eventName: string, handler: any) => void;
    one: (eventName: string, handler: any) => void;
    off: (eventName: string, handler: any) => void;
    trigger: (eventName: string, data?: any) => void;
}
