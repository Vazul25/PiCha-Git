/// <reference path="../../typings/jquery/jquery.d.ts" />

///<summary>
///Handles the registration of a user
///</summary>
class RegisterController {
    name: string = "RegisterTest";
    email: string = "registerTest@pichat.hu";
    password: string = "Password1";
    passwordConfirm: string = "Password1";//must match password 

    static $inject = ["$scope", "$http", "$rootRouter", "SharedProperties", "PopupDialogService", "ChangeLanguageService", "$translate"]
    constructor(private $scope: ng.IScope,
        private $http: ng.IHttpService,
        private $rootRouter: angular.Router,
        private SharedProperties: ISharedProperties,
        private PopupDialogService: IPopupDialogService,
        private ChangeLanguageService: IChangeLanguageService,
        private $translate: angular.translate.ITranslateService) {
    }
        
    ///<summary>
    ///Sends a http post to the accountApi to register, if it succeeds then it reroutes to home, if fails a popup dialog will be shown 
    ///</summary>
    register() {
        this.$http({
            method: 'POST',
            url: this.SharedProperties.getServerUrl() + "api/Account/Register",
            data: {
                Name: this.name,
                Email: this.email,
                Password: this.password,
                PasswordConfirm: this.passwordConfirm
            }
        }).then((resp: IResponse) => {

            this.$rootRouter.navigate(['Login']);
            }, (error: IResponse) => {
                if (error.status == 400) this.PopupDialogService.showErrorAlert(this.$translate.instant('regerr1'), this.$translate.instant('regerr2'));
                    
            console.error("RegisterController register() error: ", error.status);
        });
    }

    ///<summary>
    ///Changes the language trough the change language services
    ///</summary>
    changeLanguage(key: string) {
        this.ChangeLanguageService.changeLanguage(key);
    }
}