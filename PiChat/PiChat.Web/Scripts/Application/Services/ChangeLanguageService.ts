///<summary>
///A service which can be used to 
///change the actual used language of the site
///</summary>
class ChangeLanguageService implements IChangeLanguageService {
    static $inject = ["$window", "$translate"];
    constructor(private $window: ng.IWindowService, private $translate: angular.translate.ITranslateService) {
    }

    ///<summary>
    ///Changes the actually used language to the one 
    ///which has been specified by the parameter
    ///</summary>
    ///<param name="key">The key of the choosen language</param>
    changeLanguage(key: string) {
        this.$translate.use(key);
        this.$window.localStorage.setItem("language", key);
    }
}