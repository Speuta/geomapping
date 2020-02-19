# geoMapping

## Get started:
Include geoMapping script, you can also load a config file.
``` html
<script src="myPath/geomapping.js"></script>
<script src="myPath/geomap-config.js"></script>
```

Init geoMapping:
``` javascript
var geoMap = new geoMapping(geomapConfig);
```

## Functions:
*  **getPoints():** Return all points with x and y position.
*  **addPoint(lat, lng, name):** Add it to the list of points.
*  **removePoint(pointName):** Remove it from the list of points.
*  **getLatLngOnMap(x, y):** Get lat and lng of a point in the map.
*  **trackPosition():** Track user GPS position, use "UPDATE_POSITION" event to get map point coords.
*  **stopTrackPosition():** Stop tracking position.

Example:
``` javascript
var points = geoMap.getPoints();
var myPoint = geoMap.addPoint(43.604652, 1.444209, "Toulouse");
if(!myPoint.isOutOfMap){
    createHotspot(myPoint.x, myPoint.y);
}
geoMap.trackPosition();
```

## Events:
*  READY
*  ADD
*  REMOVE
*  UPDATE_POSITION
*  STOP_POSITION

Example:
``` javascript
geoMap.on(geoMapping.EVENTS.READY, function(){
    console.log('READY !!');
});

geoMap.on(geoMapping.EVENTS.ADD, function(data){
    console.log('UPDATE !!', data);
    updatePoints();
});
```

## krPano plugin:
Test here: "./test-krPano/".  
You can find sources in: "./test-krPano/plugins/geoMapping/".  
