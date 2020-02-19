//creer un tableau 
var myJson = [];

//ajouter les fichier *.json a lire
var tabJSON = [lang+".json"];
// les données sont stocker dans le tableau myJson est sont accessible avec la commane myJson[1].valeur myJson[2].valeur...


var fileCount = tabJSON.length;
var fileLoaded = 0;
for (var i = 0; i < tabJSON.length ; i++) { load("lang/"+tabJSON[i]) }


//fonction qui execute le résultat, ici change le txt
function changeTxt() {
    document.getElementById("info-title").innerHTML = myJson[0].title;
    document.getElementById("topInfo").innerHTML = myJson[0].text1;
};


function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function load(jsonfile) {
    
    loadJSON(jsonfile, function (response) {
        myJson.push(JSON.parse(response));
        console.log(myJson);
        fileLoaded++;
        if (fileLoaded == fileCount)
        { /*changeTxt();*/ }
    });
}
