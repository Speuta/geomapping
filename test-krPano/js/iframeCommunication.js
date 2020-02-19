var _triggerEvent = function(el, eventName, options) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, options);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, options);
    }
    el.dispatchEvent(event);
};

function _getId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var _parentWindow = null;

var _sendMessage = function(action, data, callback){
    if(_parentWindow){
        if(callback && (typeof callback === "function")){
            data._id = _getId();
            window.addEventListener("message", function(evt) {
                if(evt.data._id === data._id){
                    callback(evt);
                }
            }, false);
        }
        _parentWindow.postMessage({
            action: action,
            data: data
        }, '*');
    } else {
        console.error("iframeCommunication is not ready");
    }
};

var _sendResponse = function(event, data) {
    if(_parentWindow){
        data['_id'] = event.data.data._id;
        _sendMessage("response", data);
    } else {
        console.error("iframeCommunication is not ready");
    }
};

var _receiveMessage = function(event){
    switch(event.data.action){
        case "firstCall":
            _parentWindow = event.source;
            _triggerEvent(document, "iframeCommunicationIsReady");
            break;
        case "hideInfos":
            $("#infoFrame").hide();
            break;
    }
};

//Listener general
window.addEventListener("message", _receiveMessage, false);

window.iframeCommunication = {
    isReady: function(){
        return _parentWindow !== null;
    },
    hideInfos: function(){
        console.log('ok')
        _sendMessage("hideInfos", null);
    },
    showInfos: function(){
        _sendMessage("showInfos", null);
    },
    selectHotspot: function(data){
        _sendMessage("selectHotspot", data);
    }
};