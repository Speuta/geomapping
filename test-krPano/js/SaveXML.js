// JavaScript source code
function WriteXml() {
    var krpano = document.getElementById("krpanoSWFObject");
    /// write to file
    var allScene = "";
    var allScene = KRsceneTxt(firstScene);
    var scid = 0;
    var i = 0;
    var scenecount = krpano.get('scene.count') - 1;
    for (i = 0; i <= scenecount; i++) {
        if (i != firstScene){ 
        var theScene = KRsceneTxt(i);
        scid += 1;
        allScene += theScene
        }
    }

    var txtFile = '<krpano version="1.19" title="Virtual Tour">' + '\n\n' +
         '<include url="skin/vtourskin.xml" />' + '\n\n' +
        '<action name="startup" autorun="onstart">' + '\n\n' +
        krpano.get("action['startup'].content") +
        '</action>' + '\n\n' +
           allScene + '\n\n' +
    '</krpano>';


    var blob = new Blob([txtFile], { type: "text/plain;charset=utf-8" });

    var txt2xml = krpano.get("scene[0]");
    console.log(txt2xml);
    saveAs(blob, "tour.xml");


}
function KRsceneTxt(sceneId) {
    var krpano = document.getElementById("krpanoSWFObject");
    krpano.call("loadscene(" + sceneId + ")");

    var parser = new DOMParser;
    var varKRxml = krpano.get("xml.content");
    var xmlDocu = parser.parseFromString(varKRxml, "text/xml");

    var sceneName = krpano.get("scene[" + sceneId + "].name");
    var txtscid = krpano.get("scene[" + sceneName + "].index");

    //alert(KRsceneList[txtscid].name);
    //alert(KRsceneList[txtscid].HSlist.length);
    var scenetitle = krpano.get("scene[" + sceneId + "].title");
    var sceneonstart = krpano.get("scene[" + sceneId + "].onstart");
    var scenethumburl = krpano.get("scene[" + sceneId + "].thumburl");
    var scenelat = krpano.get("scene[" + sceneId + "].lat");
    var scenelng = krpano.get("scene[" + sceneId + "].lng");
    var sceneheading = krpano.get("scene[" + sceneId + "].heading");
    var MysceneHead = '<scene name="' + sceneName + '" title="' + scenetitle + '" onstart="' + sceneonstart + '" thumburl="' + scenethumburl + '" lat="' + scenelat + '" lng="' + scenelng + '" heading="' + sceneheading + '" >';

    //var Mysceneview = (new XMLSerializer()).serializeToString(xmlDocu.getElementsByTagName("krpano")[0].childNodes[1]);
    //var Mysceneview = (new XMLSerializer()).serializeToString(xmlDocu.getElementsByTagName("view")[0]);
    var Actualview = scenes.scene[sceneId].view;
    var Mysceneview = '<view hlookat="' + Actualview.hlookat + '" vlookat="' + Actualview.vlookat + '" fovtype="' + Actualview.fovtype + '" fov="' + Actualview.fov + '" maxpixelzoom="' + Actualview.maxpixelzoom + '" fovmin="' + Actualview.fovmin + '" fovmax="' + Actualview.fovmax + '" limitview="auto" />'
    var Myscenepreview = (new XMLSerializer()).serializeToString(xmlDocu.getElementsByTagName("preview")[0]);
    var krbalise = (new XMLSerializer()).serializeToString(xmlDocu.getElementsByTagName("image")[0]);

    var Mysceneimage = krbalise;
    var MysceneHs = "";
    //alert(KRsceneList[0]);
    if (KRsceneList[txtscid].HSlist.length > 0) {
        for (f = 0; f < KRsceneList[txtscid].HSlist.length; f++) {
            //alert(KRsceneList[txtscid].HSlist[f].name)
            var HS = KRsceneList[txtscid].HSlist[f];
            var HSMouseEvent = "";
            //if (HS.style != null) { HSMouseEvent += '" style="skin_hotspotstyle""' };
            //if (HS.OLDondown != null) { HSMouseEvent += '" ondown="' + HS.OLDondown };
            //if (HS.OLDonup != null) { HSMouseEvent += '" onup="' + HS.OLDonup };
            //if (HS.OLDonover != null) { HSMouseEvent += '" onover="' + HS.OLDonover };
            //if (HS.OLDonout != null) { HSMouseEvent += '" onout="' + HS.OLDonout };
            //if (HS.OLDonclick != null) { HSMouseEvent += '" onclick="' + HS.OLDonclick };
           

            MysceneHs += '<hotspot name="' + HS.name + '" style="' + HS.style + '" url="' + HS.url + '" scale="' + HS.scale + '" ath="' + HS.ath + '" atv="' + HS.atv + '" mytext="' + HS.mytext + '" keep="' + HS.keep + '" edge="' + HS.edge + '" zorder="' + HS.zorder + '" linkedscene="' + HS.linkedscene + HSMouseEvent + '"/>' + '\n';
            ;
        }
    }

    var MysceneBody = Mysceneview + '\n\n' + Myscenepreview + '\n\n' + Mysceneimage + '\n\n' + MysceneHs;

    var Myscene = MysceneHead + '\n\n' + MysceneBody + '\n\n' + "</scene>" + '\n\n';


    return Myscene;
}