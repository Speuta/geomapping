// GEOMAPPING - krpano HTML5 Javascript Plugin
// By Axeon Software

function krpanoplugin() {
    var local = this;
    var krpano = null;
    var plugin = null;

    local.registerplugin = function(krpanointerface, pluginpath, pluginobject) {
        krpano = krpanointerface;
        plugin = pluginobject;

        var _createHotspot = function(name, url, ath, atv, scale, text, onclick, ondown, onup){
            krpano.call("addhotspot(" + name + ");");
            krpano.call("set(hotspot[" + name + "].url, '" + url + "');");
            krpano.call("set(hotspot[" + name + "].ath, " + ath + ");");
            krpano.call("set(hotspot[" + name + "].atv, " + atv + ");");
            krpano.call("set(hotspot[" + name + "].scale, " + scale + ");");
            krpano.call("set(hotspot[" + name + "].text, " + text + ");");
            if(onclick){
                krpano.call("set(hotspot[" + name + "].onclick, " + onclick + ");");
            }
            if(ondown){
                krpano.call("set(hotspot[" + name + "].ondown, " + ondown + ");");
            }
            if(onup){
                krpano.call("set(hotspot[" + name + "].onup, " + onup + ");");
            }
        };

        var geoReperes = krpano.get("georepere").getArray();
        if((!geoReperes) || (geoReperes.length !== 2)){
            console.error('krPano :: GEOMAPPING :: need two <georepere/>');
        }

        var tracker = krpano.get("tracker");
        if(!tracker){
            console.error('krPano :: GEOMAPPING :: need <tracker/>');
        }

        var geomapConfig = {
            boundingBox: [
                {
                    name: geoReperes[0].name,
                    lat: geoReperes[0].lat,
                    lng: geoReperes[0].lng,
                    x: geoReperes[0].ath,
                    y: geoReperes[0].atv
                }, {
                    name: geoReperes[1].name,
                    lat: geoReperes[1].lat,
                    lng: geoReperes[1].lng,
                    x: geoReperes[1].ath,
                    y: geoReperes[1].atv
                }
            ],
            imgSrc: {
                width: krpano.area.pixelwidth,
                height: krpano.area.pixelheight
            }
        };
        var geoMap = new geoMapping(geomapConfig);
        geoMap.trackPosition();

        var geohotspots = krpano.get("geohotspot").getArray();
        if(geohotspots && geohotspots.length > 0){
            geohotspots.forEach(function(_gh){
                var _coords = geoMap.addPoint(_gh.lat, _gh.lng, _gh.name);
                _createHotspot(_gh.name, _gh.url, _coords.x, _coords.y, _gh.scale, _gh.text, _gh.onclick, _gh.ondown, _gh.onup);
            });
        }

        geoMap.on(geoMapping.EVENTS.UPDATE_POSITION, function(data){
            _createHotspot(tracker.name || 'tracker', tracker.url, data.x, data.y, tracker.scale, tracker.text, tracker.onclick, tracker.ondown, tracker.onup);
        });
    };

    local.unloadplugin = function() {
        plugin = null;
        krpano = null;
    };

    local.onresize = function(width,height) {
        return false;
    };
}