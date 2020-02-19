var Lang = "";
var defautLang = "FR";
//execute la function qui retourne la variable dans l'url
checkLANG();

//function qui sert a lire url
function _getUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return (results == null) ? null : (decodeURI(results[1]) || 0);
};

// la deuxieme variable s'ecrit ex : index.html?var=valeur&variable2=valeur
function checkLANG() {
    var urllang = _getUrlParam("lang");
    if (urllang != null) {
        lang = urllang;
        textLang = lang;
    } else {
        lang = defautLang;
        textLang = "pas de langue, la langue par defaut est de " + defautLang;
    }
    console.log(lang);
    //document.getElementById("yourLANG").innerHTML = textLang;
}
