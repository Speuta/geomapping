// KRPANO Scene

var scene = null;
var KRview = {
    hlookat:0.0,
    vlookat:0.0,
    camroll:0.0,
    fovtype:"VFOV",
    fov:90.0,
    fovmin:1.0,
    fovmax:179.0,
    maxpixelzoom:2,
    mfovratio:1.333333,
    distortion:0.0,
    distortionfovlink:0.5,
    stereographic:true,
    pannini:0.0,
    architectural:0.0,
    architecturalonlymiddle:true,
    limitview:"auto",
    hlookatmin:null,
    hlookatmax:null,
    vlookatmin:null,
    vlookatmax: null
};
var Myview = null;
var KRscene = { index: 0, name: "", HSlist: [null], view: KRview };
var propGeneralXML = { name: "", index: 0 };
var currentSceneName = "";
var currentSceneIndex = 0;
var currentSceneCount = 0;
var loadid = null;
var sceneHSList = [];
var KRsceneList = [];
var scenes = { current: null, count: 0, scene: KRsceneList, load: function (loadid) { krpano.call("loadscene(" + scenes.scene[loadid].name + ", null,MERGE, OPENBLEND(0.5, 0.0, 0.75, 0.05, linear))"); } };
var firstScene = 0;

function read_Start_scene() {
    console.log("read_Start_scene");
    InitSceneUI();
    InitScene();
    //creer un Object scene
    scenes.current = propGeneralXML;
    scenes.count = currentSceneCount;
    var SClinkedscene = [];
    document.getElementById("SCList").innerHTML = SCListing;
    SClinkedscene.push('<option class="panel-body">Null</option>');

    for (j = 0; j < scenes.count ; j++) {
        console.log("----read_Start_scene()----");
        //console.log(j);
        var Myscene = Object.create(KRscene);
        Myscene.HSlist = [];
        Myscene.name = krpano.get("scene[" + j + "].name");
        Myscene.index = krpano.get("scene[" + Myscene.name + "].index");

        scenes.scene.push(Myscene);
        scenes.scene = KRsceneList;

        Myview = Object.create(KRview);
        InitSceneView();
        scenes.scene[j].view = Myview;

        console.log(KRsceneList[j].name);
       

        SClinkedscene.push('<option class="panel-body">' + Myscene.name + '</option>');
        document.getElementById("SClinkedsceneList").innerHTML = SClinkedscene;

        krpano.call("loadscene(" + Myscene.name + ")");

        read_Start_hotspot();
    }
    krpano.set("events.onloadcomplete", "js(updateScene())");
    krpano.set("events.onviewchange", "js(updateViewUI())");
    krpano.set("events.ondoubleclick", "js(deselect())");
    
    //krpano.set("events.onmousedown", "js(HSselect())");
    //krpano.set("events.onclick", "js(HSinfo())");
    //krpano.set("events.onmouseup", "js(HSdeselect())");
    //updateViewUI();
    //updateScene();
}
function InitScene() {
    currentSceneName = krpano.get("xml.scene");
    currentSceneIndex = krpano.get("scene[" + currentSceneName + "].index");
    currentSceneCount = krpano.get("scene.count");
    currentSceneOnstart = krpano.get("scene[" + currentSceneName + "].onstart");
    propGeneralXML = { name: currentSceneName, index: currentSceneIndex };
    scenes.current = propGeneralXML;
}
function updateScene() {
    currentSceneName = krpano.get("xml.scene");
    currentSceneIndex = krpano.get("scene[" + currentSceneName + "].index");
    currentSceneCount = krpano.get("scene.count");
    currentSceneOnstart = krpano.get("scene[" + currentSceneName + "].onstart");
    propGeneralXML = { name: currentSceneName, index: currentSceneIndex };
    scenes.current = propGeneralXML;
    updateSceneUI();
    updateViewUI();
    krpano.set("view.hlookat", scenes.scene[scenes.current.index].view.hlookat);
    krpano.set("view.vlookat", scenes.scene[scenes.current.index].view.vlookat);
    krpano.set("view.fov", scenes.scene[scenes.current.index].view.fov);
    

    Remove_all_hotspot();
    Restore_all_hotspot();
}

function InitSceneView() {
    Myview.hlookat = Number(krpano.get("view.hlookat"));
    Myview.vlookat = Number(krpano.get("view.vlookat"));
    Myview.camroll = Number(krpano.get("view.camroll"));
    Myview.fovtype = String(krpano.get("view.fovtype"));
    Myview.fov = Number(krpano.get("view.fov"));
    Myview.fovmin = Number(krpano.get("view.fovmin"));
    Myview.fovmax = Number(krpano.get("view.fovmax"));
    Myview.maxpixelzoom = Number(krpano.get("view.maxpixelzoom"));
    Myview.mfovratio = Number(krpano.get("view.mfovratio"));
    Myview.distortion = Number(krpano.get("view.distortion"));
    Myview.distortionfovlink = Number(krpano.get("view.distortionfovlink"));
    Myview.stereographic = Number(krpano.get("view.stereographic"));
    Myview.pannini = Number(krpano.get("view.pannini"));
    Myview.architectural = Number(krpano.get("view.architectural"));
    Myview.architecturalonlymiddle = Number(krpano.get("view.architecturalonlymiddle"));
    Myview.limitview = Number(krpano.get("view.limitview"));
    Myview.hlookatmin = Number(krpano.get("view.hlookatmin"));
    Myview.hlookatmax = Number(krpano.get("view.hlookatmin"));
    Myview.vlookatmin = Number(krpano.get("view.vlookatmin"));
    Myview.vlookatmax = Number(krpano.get("view.vlookatmax"));

}



