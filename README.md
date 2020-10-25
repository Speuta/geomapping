# GeoMapping

[![npm version](https://badge.fury.io/js/geomapping.svg)](https://badge.fury.io/js/geomapping)

## Get started:
Installation:  
`npm install geomapping`

Include GeoMapping script, you can also load a config file.
``` html
<script src="myPath/geomapping.js"></script>
<script src="myPath/geomap-config.js"></script>
```

Init geoMapping:
``` javascript
var geoMap = new GeoMapping(geomapConfig);
```

[See example of config](./demo/geomap-config.js)

## Methods:
*  **getPoints():** Return all points with x and y position.
*  **getPointById(id):** Return the point object.
*  **filterPointsByData(key, value):** Return points object filtered by your params.
*  **addPoint(lat, lng, id, data):** Add it to the list of points.
*  **removePoint(id):** Remove it from the list of points.
*  **getLatLngOnMap(x, y):** Get lat and lng of a point in the map.
*  **getPointXYOnMap(lat, lng):** Get x and y of a coord in the map.
*  **trackPosition(errorCallback):** Track user GPS position, use "UPDATE_POSITION" event to get map point coords.
*  **stopTrackPosition():** Stop tracking position.

Example:
``` javascript
var points = geoMap.getPoints();
var myPoint = geoMap.addPoint(43.604652, 1.444209, "Toulouse", {
    dpt: "Haute Garonne",
    postal: 31000
});
if(!myPoint.isOutOfMap){
    createHotspot(myPoint.x, myPoint.y);
}
geoMap.getPointById("Toulouse");
geoMap.filterPointsByData("postal", 31000);
geoMap.trackPosition(function(errorMessage){
    // Error code here
});
```

## Events:
*  READY : when the lib is ready.
*  ADD : when a point is added.
*  REMOVE : when a point is removed.
*  UPDATE_POSITION : when the user move when tracking position is activated.
*  STOP_POSITION : when tracking is stopped.

Example:
``` javascript
geoMap.on(GeoMapping.EVENTS.READY, function(){
    console.log('READY !!');
});

geoMap.on(GeoMapping.EVENTS.ADD, function(data){
    console.log('NEW POINT ADDED !!', data);
    updatePoints();
});
```

## Library Dev:

Compil via rollup:
- Dev live reload: `npm run watch`
- Build: `npm run build`

Test: Open `./test/index.html`

> `npm run test` do not work for the moment (No DOM to load Image)

