/// Controller of the common things in the app
///<summary>
///Controller for the appComponent
///</summary>
class AppController {
    static $inject = ["$window", "ChangeLanguageService"]
    constructor($window: ng.IWindowService, ChangeLanguageService: IChangeLanguageService) {
        var language: string = $window.localStorage.getItem("language") || "en";
        // change the language of the app
        ChangeLanguageService.changeLanguage(language);
    }
}