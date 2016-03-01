var UILanguage = require(appRoot + '/models/uiLanguage');

module.exports = function(language, req, callback){
    if (language != null){
        UILanguage.findById(language, null, {columns:["code"]}, function(err, language) {
            callback(locateTranslation(language.code));
        });
    } else {
        language = req.headers["accept-language"].toLowerCase();
        callback(locateTranslation(language));
    }

};

function locateTranslation(language){
    switch (true){
        case language == null:
            return require('./../translate/en');
            break;
        case language.indexOf("fr") == 0:
            return require('./../translate/fr');
            break;
        case language.indexOf("en") == 0:
            return require('./../translate/en');
            break;
        default:
            return require('./../translate/en');
            break;
    }
}