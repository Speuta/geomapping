// USER Interface
//scene UI

var SCListing = [""];
var SCListSelected = 0;
var SCtext = "";
var nbHS = 0;
var HSnewName = "";
var txtscid = "";
var HSIsavaible = false;

function InitSceneUI() {
    document.getElementById("nbSceneBadge").innerHTML = 0;
    document.getElementById("scIndex").innerHTML = 0;
    document.getElementById("scName").innerHTML = "unknow name";
}

function updateSceneUI() {
    console.log("Scene UI update");

    document.getElementById("nbSceneBadge").innerHTML = scenes.count;
    document.getElementById("scIndex").innerHTML = scenes.current.index;
    console.log(scenes.current.name);
    document.getElementById("scName").innerHTML = scenes.current.name;

    updateSClist();
    
}

//vérifie quelle est la scene actuel est met a jour la la selection de la list
function updateSClist() {
    SCListing = [""];
    for (i = 0; i < scenes.count ; i++) {
        var SCdiv = '<option class="panel-body">' + scenes.scene[i].name + '</option>';
        SCListing.push(SCdiv);
    }
    document.getElementById("SCList").innerHTML = SCListing;
    document.getElementById("SCList").selectedIndex = scenes.current.index;
}

// load la scene selectionne dans la liste
function selectScene() {
    SCListSelected = document.getElementById("SCList").selectedIndex;
    SCtext = document.getElementById("SCList").options[SCListSelected].text;
    console.log("load scene " + SCListSelected + " : " + SCtext);
    scenes.load(SCListSelected);
    updateView();
}

function updateViewUI() {
    
    document.getElementById("UIhlookat").value = Number(krpano.get("view.hlookat")).toFixed(1);
    document.getElementById("UIvlookat").value = Number(krpano.get("view.vlookat")).toFixed(1);
    document.getElementById("UIfov").value = Number(krpano.get("view.fov")).toFixed(0);
   
}
function updateView() {
    krpano.set("view.hlookat", document.getElementById("UIhlookat").value);
    krpano.set("view.vlookat", document.getElementById("UIvlookat").value);
    krpano.set("view.fov", document.getElementById("UIfov").value);
}

function SetView() {
    scenes.scene[scenes.current.index].view.hlookat = Number(krpano.get("view.hlookat"));
    scenes.scene[scenes.current.index].view.vlookat = Number(krpano.get("view.vlookat"));
    scenes.scene[scenes.current.index].view.fov = Number(krpano.get("view.fov"));
}

function ResetView() {
    scenes.scene[scenes.current.index].view.hlookat = 0;
    scenes.scene[scenes.current.index].view.vlookat = 0;
    scenes.scene[scenes.current.index].view.fov = 110;
    krpano.set("view.hlookat", scenes.scene[scenes.current.index].view.hlookat);
    krpano.set("view.vlookat", scenes.scene[scenes.current.index].view.vlookat);
    krpano.set("view.fov", scenes.scene[scenes.current.index].view.fov);
    updateViewUI();
}

function SetFirstView() {
    firstScene = currentSceneIndex;
    console.log("firstScene est "+firstScene);
}

function updateHostspotUI() {
    console.log("updateHostspotUI()")
    nbHS = KRsceneList[scenes.current.index].HSlist.length;
    document.getElementById("NbHSBadge").innerHTML = nbHS;
    if (hotspotSelected != "" && hotspotSelected != undefined) {
    var HSnewName = document.getElementById("HSnameArea").value = krpano.get('currentSelSpot');
    //console.log("le Hostspot KRPano selectionne est " + hotspotSelectedName + " son index est " +  krpano.get("hotspot['"+hotspotSelectedName+"'].index"));
    //console.log("le Hostspot Editeur selectionne est " + hotspotSelected + " son index est " + KRsceneList[scenes.current.index].HSlist[HSindex - 2].index);
    document.getElementById("scLinked").innerHTML = HSLinkedscene;
    }
    else {

        document.getElementById("scLinked").innerText = "";
        document.getElementById("SClinkedsceneList").selectedIndex = 0;
        document.getElementById("HSnameArea").value = "enter New Name";
    }
}


function resetHostspotUI() {
    console.log("resetHostspotUI()");
    document.getElementById("NbHSBadge").innerHTML = KRsceneList[scenes.current.index].HSlist.length;
    var HSnewName = document.getElementById("HSnameArea").value = "enter New Name";
    document.getElementById("scLinked").innerHTML = "";
}

function HSNameCheck() {
    console.log("Verification du nom");
    for (f = 0; f < KRsceneList[txtscid].HSlist.length; f++) {
        console.log("newHSName est " + HSnewName);
        var HS = KRsceneList[txtscid].HSlist[f];
        if (HS.name != hotspotSelected) {
            if (HS.name == HSnewName) {
                console.log("le nom " + HSnewName + " existe deja");
                alert("le nom " + HSnewName + " existe deja");
                document.getElementById("HSnameArea").value = hotspotSelected;
                f = KRsceneList[txtscid].HSlist.length+1;
                HSIsavaible = false;
            } else {
                console.log(HSnewName + " n'a pas le nom que " + HS.name);
                HSIsavaible = true;
            }
        }
    

        //SelHS();
    }
    
}

function HSNameChange() {
    console.log("HSNameChange()");
    if (hotspotSelected != "" && hotspotSelected != undefined) {
        txtscid = krpano.get("scene[" + currentSceneName + "].index");
        HSnewName = document.getElementById("HSnameArea").value;
        var MyFirstChar =HSnewName.substr(0, 1);
        if (isNaN(MyFirstChar) != true) { HSnewName = "Hotspot_" + HSnewName; }
        HSNameCheck();
        if (HSIsavaible == true) {
            krpano.set('hotspot[' + hotspotSelected + '].name', HSnewName);
            hotspotSelected = HSnewName;
            krpano.call("set(currentSelSpot,"+ hotspotSelected +");");
        }
        //    if (HS.name == HSnewName) {
        //        alert("Un hotspot porte deja le meme nom");
        //        console.log("Un hotspot porte deja le meme nom");
        //        f = KRsceneList[txtscid].HSlist.length + 1;
        //        document.getElementById("HSnameArea").value = "enter New Name";
        //        updateHostspotUI();
                
        //    }else{

        //    //alert(HSnewName.substr(0, 1));
        
        //    //hotspotSelected = krpano.get('currentSelSpot');

        //    //alert('le hotspot ' + hotspotSelectedName + ' a ete Renommer : ' + HSnewName);
        //    krpano.set('hotspot[' + hotspotSelectedName + '].name', HSnewName);
        //    console.log("Nom change");
        //    hotspotSelected = "";
        //    hotspotSelectedName = "";
        //    HSnewName = "";
        //    krpano.call("set(currentSelSpot,  );");
        //    //KRsceneList[scenes.current.index].HSlist[HSindex].name = HSnewName;
        //    document.getElementById("HSnameArea").value = "enter New Name";

        //    updateHostspotUI();
        //}
        //}
    }
    else {
        alert("Selectionner un Hotspot");
        document.getElementById("HSnameArea").value = "enter New Name";
    }

}
