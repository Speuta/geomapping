// KRPANO Scene
var HSListing = [""];

var serial = 1;
var hotspotSelected = "";
var HSListindex = 0;
var hotspotSelectedName = "";
var HSindex = 0;
var HSLinkedscene = "null";
var newHSName = "";

var KRHS = {
    index: null,
    name: null,
    style: null,
    OLDstyle: null,
    url: null,
    ath: null,
    atv: null,
    scale: 1,
    mytext: null,
    zorder: 50,
    edge: null,
    keep: null,
    ondown: null,
    onup: null,
    onout: null,
    onover: null,
    onclick: null,
    OLDondown: null,
    OLDonup: null,
    OLDonout: null,
    OLDonover: null,
    OLDonclick: null,
    linkedscene: null,
    listindex: 0,
}
var nbHS = 0;
var KRHSList = [];

function read_Start_hotspot() {
    var krpano = document.getElementById("krpanoSWFObject");
    console.log("----read_Start_hotspot()----");
    var Initialcount = krpano.get("hotspot.count");
    var KRHSList = [];
    var currentSceneName = krpano.get("xml.scene");
    var currentSceneIndex = krpano.get("scene[" + currentSceneName + "].index");
    console.log("Initialcount is: " + Initialcount)
    console.log("la scene est " + currentSceneName);
    console.log("la scene index est " + currentSceneIndex);

    if (Initialcount > 0) {
        var i;
        nbHS = 0
        HSListing = [""];
        tabtHS = [""];
        

        
        for (i = 0; i < Initialcount; i++) {
            //krpano.call("set(hotspot[" + i + "].ondown, set(dragging,true); set ( currentSelSpot,get(name) );js ( draghotspot(); );)");
            //krpano.call("set(hotspot[" + i + "].onup, set(dragging,false); set ( currentSelSpot,get(name) );js ( draghotspot(); );)");
            //krpano.call("set(hotspot[" + i + "].onout,set(currentSelSpot,'null')");

           

            var hsname = krpano.get("hotspot[" + i + "].name");
            if (hsname != "webvr_prev_scene" && hsname != "webvr_next_scene" && hsname != "vr_cursor") {
                nbHS += 1

                //krpano.call("set(hotspot[" + i + "].style,'null')");

                var myHS = Object.create(KRHS);
                myHS.index = krpano.get("hotspot[" + i + "].index");
                myHS.name = krpano.get("hotspot[" + i + "].name");
                myHS.style = krpano.get("hotspot[" + i + "].style");
                myHS.OLDstyle = krpano.get("hotspot[" + i + "].style");
                myHS.url = krpano.get("hotspot[" + i + "].url");
                myHS.ath = krpano.get("hotspot[" + i + "].ath");
                myHS.atv = krpano.get("hotspot[" + i + "].atv");
                myHS.mytext = krpano.get("hotspot[" + i + "].mytext");
                myHS.zorder = krpano.get("hotspot[" + i + "].zorder");
                myHS.scale = krpano.get("hotspot[" + i + "].scale");
                myHS.edge = krpano.get("hotspot[" + i + "].edge");
                myHS.keep = krpano.get("hotspot[" + i + "].keep");
                myHS.ondown = krpano.get("hotspot[" + i + "].ondown");
                myHS.onup = krpano.get("hotspot[" + i + "].onup");
                myHS.onout = krpano.get("hotspot[" + i + "].onout");
                myHS.onout = krpano.get("hotspot[" + i + "].onover");
                myHS.onclick = krpano.get("hotspot[" + i + "].onclick");
                myHS.OLDondown = krpano.get("hotspot[" + i + "].ondown");
                myHS.OLDonup = krpano.get("hotspot[" + i + "].onup");
                myHS.OLDonout = krpano.get("hotspot[" + i + "].onout");
                myHS.OLDonover = krpano.get("hotspot[" + i + "].onover");
                myHS.OLDonclick = krpano.get("hotspot[" + i + "].onclick");
                myHS.linkedscene = krpano.get("hotspot[" + i + "].linkedscene");

                KRHSList.push(myHS);
                console.log(KRHSList);


            }

        }
        KRsceneList[currentSceneIndex].HSlist = KRHSList;

    }


   
}

function Remove_all_hotspot() {
    console.log("----Remove_all_hotspot()----");
    var krpano = document.getElementById("krpanoSWFObject");
    var Initialcount = krpano.get("hotspot.count");
    document.getElementById("NbHSBadge").innerHTML = 0;
    var nbHS = KRsceneList[scenes.current.index].HSlist.length;
    if (Initialcount > 0) {
        var i;
        for (i = Initialcount; i > 0; i--) {

            var hsname = krpano.get("hotspot[" + i + "].name");
            if (hsname != "webvr_prev_scene" && hsname != "webvr_next_scene" && hsname != "vr_cursor") {
                krpano.call("removehotspot(" + hsname + ")");
            }

        }

    }
    //Set_Scene_info();
}

function Restore_all_hotspot() {
    console.log("----Restore_all_hotspot()----");
    var krpano = document.getElementById("krpanoSWFObject");
    var Initialcount = krpano.get("hotspot.count");
    krpano.call("set(dragging,false);");
    krpano.call("set(delSpot, false);");

    if (Initialcount > 0) {
        var i;
        for (i = Initialcount; i >= 0; i--) {

            var hsname = krpano.get("hotspot[" + i + "].name");
            if (hsname != "webvr_prev_scene" && hsname != "webvr_next_scene" && hsname != "vr_cursor") {
                krpano.call("removehotspot(" + hsname + ")");
            }

        }

    }
    console.log("nombre de HS a recreer est de " + KRsceneList[scenes.current.index].HSlist.length);
    if (KRsceneList[scenes.current.index].HSlist.length > 0) {
        for (f = 0; f < KRsceneList[scenes.current.index].HSlist.length; f++) {

            var HS = KRsceneList[scenes.current.index].HSlist[f];
            console.log( HS.name );
            krpano.call("set(lastCreatedHotspotName," + HS.name + ");");
            krpano.call("addhotspot(get(lastCreatedHotspotName));");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].style, 'skin_hotspotstyle' );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].url, '" + HS.url + "');");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].ath, " + HS.ath + ");");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].atv, " + HS.atv + ");");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].listindex, " + f + ");");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].scale, " + HS.scale + ");");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].mytext, '" + HS.mytext + "' );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].zorder, " + HS.zorder + " );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].edge, 'center' );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].keep, " + HS.keep + " );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].ondown, set(dragging,true); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].onup, set(dragging,false); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].onout, tween(scale,0.5); js ( read_Start_hotspot(); );js( updateHostspotUI(); ); );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].onover, tween(scale,0.6); );");
            krpano.call("set(hotspot[get(lastCreatedHotspotName)].linkedscene, " + HS.linkedscene + ");");
        }
    }
    //alert(krpano.get("hotspot.count"));
    hotspotSelected = "";
    krpano.call("set(currentSelSpot, );");
    resetHostspotUI();
}

function Hsinfo() {

    console.log(krpano.get('get(name)'));

}

function HSselect() {
    oldOndown = krpano.get('hotspot[get(currentSelSpot)].ondown');
    oldOnup = krpano.get('hotspot[get(currentSelSpot)].onup');
    oldOnout = krpano.get('hotspot[get(currentSelSpot)].onout');
    oldOnover = krpano.get('hotspot[get(currentSelSpot)].onover');

    krpano.call("set(hotspot[get(currentSelSpot)].ondown, set(dragging,true); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    krpano.call("set(hotspot[get(currentSelSpot)].onup, set(dragging,false); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    krpano.call("set(hotspot[get(currentSelSpot)].onout,tween(scale,0.5);set(dragging,false); js ( read_Start_hotspot(); );js( updateHostspotUI(); ); );");
    krpano.call("set(hotspot[get(currentSelSpot)].onover, js( updateHostspotUI(); );tween(scale,0.6); );");
}

function HSdeselect() {

    krpano.call("set(hotspot[get(currentSelSpot)].ondown, " + oldOndown + " );");
    krpano.call("set(hotspot[get(currentSelSpot)].onup, " + oldOnup + " );");
    krpano.call("set(hotspot[get(currentSelSpot)].onout, " + oldOnout + " );");
    krpano.call("set(hotspot[get(currentSelSpot)].onover, " + oldOnover + " );");
}

function draghotspot() {

    var krpano = document.getElementById("krpanoSWFObject");

    var mouse_at_x = krpano.get("mouse.x");
    var mouse_at_y = krpano.get("mouse.y");
    var mouse_at_h = krpano.get("mouseath");
    var mouse_at_v = krpano.get("mouseatv");

    currentSceneName = krpano.get("xml.scene");
    document.getElementById("SClinkedsceneList").selectedIndex = 0;

    
    hotspotSelectedName = krpano.get('currentSelSpot');
    HSindex = krpano.get("hotspot[" + hotspotSelectedName + "].index");
    hotspotSelected = KRsceneList[scenes.current.index].HSlist[HSindex-2].name;
    

    HSListindex = krpano.get('hotspot[get(currentSelSpot)].listindex');
    HSLinkedscene = krpano.get('hotspot[get(currentSelSpot)].linkedscene');



    //krpano.call("set(hotspot[get(currentSelSpot)].ondown, set(dragging,true); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    //krpano.call("set(hotspot[get(currentSelSpot)].onup, set(dragging,false); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    //krpano.call("set(hotspot[get(currentSelSpot)].onout,tween(scale,0.5);set(dragging,false); js ( read_Start_hotspot(); );js( updateHostspotUI(); ); );");
    //krpano.call("set(hotspot[get(currentSelSpot)].onover, js( updateHostspotUI(); );tween(scale,0.6); );");

    krpano.call("if(dragging,screentosphere(mouse.x,mouse.y,tmp_h,tmp_v);set(hotspot[get(currentSelSpot)].ath,get(tmp_h));set(hotspot[get(currentSelSpot)].atv,get(tmp_v));delayedcall(0, js ( draghotspot() ););,trace ('shit'));");


    //document.getElementById("HSList").selectedIndex = HSListindex;
    //HSnewName = document.getElementById("HSnameArea").value = hotspotSelectedName;
    //document.getElementById("scLinked").innerHTML = HSLinkedscene;

}

function SetHSNewName() {

    var txtscid = krpano.get("scene[" + currentSceneName + "].index");
    newHSName = "hotspot" + serial;
    
    for (f = 0; f < KRsceneList[txtscid].HSlist.length; f++) {
        console.log("newHSName est " + newHSName);
        var HS = KRsceneList[txtscid].HSlist[f];
        console.log("HS.name est " + HS.name);
        if (HS.name == newHSName) {
            console.log("le HS.name est identique au newHSName");
            serial += 1;
            SetHSNewName();   
        };
        
    }
}

function KRaddhotspot() {
    // <![CDATA[
    HSLinkedscene = "null";
    var hlookat = Number(krpano.get("view.hlookat"));
    var vlookat = Number(krpano.get("view.vlookat"));
    krpano.call("set(currentSelSpot, );");
    krpano.call("set(dragging,false);");
    krpano.call("set(delSpot, false);");
    serial = 1;
    SetHSNewName();
   
    krpano.call("set(lastCreatedHotspotName, " + newHSName + ");");
    krpano.call("addhotspot(get(lastCreatedHotspotName));");
    krpano.call("trace(get(lastCreatedHotspotName));");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].style, 'skin_hotspotstyle' );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].url, 'skin/Hotspot.png');");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].ath, " + hlookat + ");");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].atv, " + vlookat + ");");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].scale, 0.5);");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].mytext, '' );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].zorder, 50 );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].edge, 'center' );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].keep, false );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].ondown, set(dragging,true); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].onup, set(dragging,false); set ( currentSelSpot,get(name) );js ( draghotspot(); ); );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].onout,tween(scale,0.5);set(dragging,false); js ( read_Start_hotspot(); );js( updateHostspotUI(); ); );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].onover, js( updateHostspotUI(); );tween(scale,0.6); );");
    krpano.call("set(hotspot[get(lastCreatedHotspotName)].linkedscene, null);");
    console.log(krpano.get('hotspot.count'));
    console.log("NEW HS");
    console.log(krpano.get('hotspot[get(lastCreatedHotspotName)].name'));

    var NewHS = krpano.get('hotspot[get(lastCreatedHotspotName)].name');
    console.log("le nouveau Hotospot est " + NewHS)
    
    theHS = krpano.get('hotspot[get(lastCreatedHotspotName)].name');
    krpano.call("set(currentSelSpot," + theHS + " );");
    hotspotSelected = theHS;

    hotspotSelectedName = krpano.get('currentSelSpot');
    HSindex = krpano.get("hotspot[" + hotspotSelectedName + "].index");
    //hotspotSelected = KRsceneList[scenes.current.index].HSlist[HSindex - 2].name;

    HSListindex = krpano.get('hotspot[get(currentSelSpot)].listindex');
    HSLinkedscene = krpano.get('hotspot[get(currentSelSpot)].linkedscene');

    //nbHS += 1;

    

    //read_Start_hotspot();

    
    //krpano.call("set(currentSelSpot, " + NewHS + " );");

   // hotspotSelectedName = krpano.get('currentSelSpot');
    //HSindex = krpano.get("hotspot[" + NewHS + "].index");
   // console.log("L'index est de " + HSindex);
   // hotspotSelected = KRsceneList[scenes.current.index].HSlist[HSindex - 2].name;
    //updateAddHostspotUI();

    read_Start_hotspot();
    //Remove_all_hotspot();
    //Restore_all_hotspot();
    document.getElementById("SClinkedsceneList").selectedIndex = 0;
    updateHostspotUI();

    // ]]>
}

function removeHotspot() {
    // <![CDATA[
    if (hotspotSelected != "" && hotspotSelected != undefined && hotspotSelected != null) {
    var krpano = document.getElementById("krpanoSWFObject");

    console.log("removeHotspot()");
    console.log(hotspotSelected);
    krpano.call("removehotspot(get('currentSelSpot'))");
    //delete KRsceneList[scenes.current.index].HSlist[HSindex - 2];

    hotspotSelected = "";
    krpano.call("set(currentSelSpot, );");
    read_Start_hotspot();
    updateHostspotUI();  
    }
    else {
        alert("Selectionner un Hotspot");

    }
    // ]]>
}

function loadNewIcon() {
    
    if (hotspotSelected != "" && hotspotSelected != undefined && hotspotSelected != null) {
    var urlHSfile = document.getElementById("Fileinput").value.substr(12, 10000);
    var NewHS1 = krpano.call("set(hotspot[get(currentSelSpot)].url, 'skin/" + urlHSfile + "');");
    read_Start_hotspot();
    }
    else {
        alert("Selectionner un Hotspot");
        
    }
}
function loadIcon(urlHSfile) {
    
    if (hotspotSelected != "" && hotspotSelected != undefined && hotspotSelected != null) {
    console.log(urlHSfile);

    var NewHS1 = krpano.call("set(hotspot[get(currentSelSpot)].url, 'skin/" + urlHSfile + "');");
    read_Start_hotspot();
    }
    else {
        alert("Selectionner un Hotspot");

    }
}

function SelectLinkedscene() {
    if (hotspotSelected != "" && hotspotSelected != undefined && hotspotSelected != null) {
    var SCListLinkedSelected = document.getElementById("SClinkedsceneList").selectedIndex;
    var SCLinkedtext = document.getElementById("SClinkedsceneList").options[SCListLinkedSelected].text;
    krpano.set('hotspot[' + hotspotSelected + '].linkedscene', SCLinkedtext);
    HSLinkedscene = krpano.get('hotspot[get(currentSelSpot)].linkedscene');
    read_Start_hotspot();
    updateHostspotUI();
    //alert(hotspotSelected);
    }
    else {
        alert("Selectionner un Hotspot");
        document.getElementById("scLinked").innerText = "";
        document.getElementById("SClinkedsceneList").selectedIndex = 0;
    }
}

function deselect() {
    console.log("deselect()");
    if (hotspotSelected != "" && hotspotSelected != undefined && hotspotSelected != null) {
        hotspotSelected = "";
        document.getElementById("scLinked").innerText = "";
        document.getElementById("SClinkedsceneList").selectedIndex = 0;
        krpano.call("set(currentSelSpot, );");
        document.getElementById("HSnameArea").value = "enter New Name";
        //updateHostspotUI();
    }
}