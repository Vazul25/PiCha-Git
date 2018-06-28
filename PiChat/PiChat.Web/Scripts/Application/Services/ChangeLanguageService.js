///<summary>
///A service which can be used to 
///change the actual used language of the site
///</summary>
var ChangeLanguageService = (function () {
    function ChangeLanguageService($window, $translate) {
        this.$window = $window;
        this.$translate = $translate;
    }
    ///<summary>
    ///Changes the actually used language to the one 
    ///which has been specified by the parameter
    ///</summary>
    ///<param name="key">The key of the choosen language</param>
    ChangeLanguageService.prototype.changeLanguage = function (key) {
        this.$translate.use(key);
        this.$window.localStorage.setItem("language", key);
    };
    ChangeLanguageService.$inject = ["$window", "$translate"];
    return ChangeLanguageService;
})();
//# sourceMappingURL=ChangeLanguageService.js.map