/// Controller of the common things in the app
///<summary>
///Controller for the appComponent
///</summary>
var AppController = (function () {
    function AppController($window, ChangeLanguageService) {
        var language = $window.localStorage.getItem("language") || "en";
        // change the language of the app
        ChangeLanguageService.changeLanguage(language);
    }
    AppController.$inject = ["$window", "ChangeLanguageService"];
    return AppController;
})();
//# sourceMappingURL=AppController.js.map