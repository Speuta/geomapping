var _country = "France";
var _prefix = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var _suffix = "&key=AIzaSyDLdRCnMxJOLc_4qZbVP9U84JrkO3Eqiy4";

var _hotspots = [];
var gpsElt;

_suffix = (_country) ? ',' + _country + _suffix : _suffix;

function search(){
    var _search = $('#search-input').val();
    if(_search){
        var _url = _prefix + _search + _suffix;
        $.ajax({
            url: _url,
            method: 'GET',
            success: function(data){
                if(data.status === 'OK'){
                    var result = {
                        name: _search,
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng
                    };
                    var point = geoMap.addPoint(result.lat, result.lng, result.name);
                    console.info(point);
                    $('#logs').html('Result for: ' + point.name + ', ' + _country + ':\n lat:' + point.lat + ', lng: ' + point.lng);
                    if(point.isOutOfMap){
                        $('#logs').append('<span style="color:red;"> OUT OF MAP</span>');
                    }
                    $('#search-input').val("");
                } else {
                    $('#logs').html('Error searching: ' + _search + ' in ' + _country + '.');
                }
            }
        });
    } else {
        $('#logs').html('Search empty.');
    }
}

$(document).ready(function(){
    // SEARCH ON ENTER
    $('#search-input').keyup(function(e){
        if(e.keyCode == 13){
            search();
        }
    });


    geoMap.on(geoMapping.EVENTS.READY, function(){
        $('#container img:not(.hotspot), #container svg').on('click', function(e){
            var coords = geoMap.getLatLngOnMap(e.offsetX, e.offsetY);
            if(coords){
                $('#logs').html('Coords of point clicked => lat: ' + coords.lat + ', lng: ' + coords.lng + ', x: ' + e.offsetX + ', y: ' + e.offsetY);
            }
        });
    });
});

var activated = false;
function toggleTrackPosition() {
    activated = !activated;
    if(activated){
        geoMap.trackPosition(0.5);
        $('#track-btn').html('STOP TRACKING');
    } else {
        geoMap.stopTrackPosition();
        $('#track-btn').html('TRACK POSITION');
    }
}

function addMarker(point, isGps) {
    if(point && (!point.isOutOfMap)){
        if(isGps){
            if(!gpsElt){
                var hotspot = svg.imgMap.addHotspot(point.x, point.y, 'img/localisation.png');
                hotspot.geoMap = point;
                $(hotspot.element).attr('id', 'track-position');
                gpsElt = hotspot;
            }
        } else {
            var hotspot = svg.imgMap.addHotspot(point.x, point.y, 'img/hotspot.png');
            hotspot.geoMap = point;
            _hotspots.push(hotspot);
        }
    }
}

function updatePoints(){
    $('#container img.hotspot').remove();
    var points = geoMap.getPoints();
    points.forEach(function(_pt){
        addMarker(_pt);
    });
}