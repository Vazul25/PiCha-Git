///<summary>
/// Controller that handles language selection 
///</summary>
var LanguageSelectController = (function () {
    function LanguageSelectController($window, ChangeLanguageService) {
        this.$window = $window;
        this.ChangeLanguageService = ChangeLanguageService;
        this.selectedLanguageFlag = ""; // the path of the flag svg file
        this.selectedLanguageTitle = ""; // the short country name
        this.setCurrentLanguage($window.localStorage.getItem("language"));
    }
    ///<summary>
    ///Sets the current language's display information 
    ///</summary>
    ///<param name="language">Specifies the choosen language <param>
    LanguageSelectController.prototype.setCurrentLanguage = function (language) {
        switch (language) {
            case 'hu':
                this.selectedLanguageFlag = "/Content/Images/hu.svg";
                this.selectedLanguageTitle = "HUN";
                break;
            default:
                this.selectedLanguageFlag = "/Content/Images/en.svg";
                this.selectedLanguageTitle = "ENG";
        }
    };
    ///<summary>
    ///Sets the language of the site trough ChangeLanguageService 
    ///</summary>
    ///<param name="language">Specifies the choosen language <param>
    LanguageSelectController.prototype.selectLanguage = function (language) {
        this.setCurrentLanguage(language);
        this.ChangeLanguageService.changeLanguage(language);
    };
    LanguageSelectController.$inject = ["$window", "ChangeLanguageService"];
    return LanguageSelectController;
})();
//# sourceMappingURL=LanguageSelectController.js.map