///<summary>
/// Controller that handles language selection 
///</summary>
class LanguageSelectController {
    selectedLanguageFlag: string = "";  // the path of the flag svg file
    selectedLanguageTitle: string = ""; // the short country name

    static $inject = ["$window", "ChangeLanguageService"];
    constructor(private $window: ng.IWindowService, private ChangeLanguageService: IChangeLanguageService) {
        this.setCurrentLanguage($window.localStorage.getItem("language"));
    }

    ///<summary>
    ///Sets the current language's display information 
    ///</summary>
    ///<param name="language">Specifies the choosen language <param>
    setCurrentLanguage(language: string) {
        switch (language) {
            case 'hu':
                this.selectedLanguageFlag = "/Content/Images/hu.svg";
                this.selectedLanguageTitle = "HUN";
                break;
            default:
                this.selectedLanguageFlag = "/Content/Images/en.svg";
                this.selectedLanguageTitle = "ENG";
        }
    }

    ///<summary>
    ///Sets the language of the site trough ChangeLanguageService 
    ///</summary>
    ///<param name="language">Specifies the choosen language <param>
    selectLanguage(language: string) {
        this.setCurrentLanguage(language);
        this.ChangeLanguageService.changeLanguage(language);
    }
}