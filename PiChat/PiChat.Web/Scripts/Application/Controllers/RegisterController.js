/// <reference path="../../typings/jquery/jquery.d.ts" />
///<summary>
///Handles the registration of a user
///</summary>
var RegisterController = (function () {
    function RegisterController($scope, $http, $rootRouter, SharedProperties, PopupDialogService, ChangeLanguageService, $translate) {
        this.$scope = $scope;
        this.$http = $http;
        this.$rootRouter = $rootRouter;
        this.SharedProperties = SharedProperties;
        this.PopupDialogService = PopupDialogService;
        this.ChangeLanguageService = ChangeLanguageService;
        this.$translate = $translate;
        this.name = "RegisterTest";
        this.email = "registerTest@pichat.hu";
        this.password = "Password1";
        this.passwordConfirm = "Password1"; //must match password 
    }
    ///<summary>
    ///Sends a http post to the accountApi to register, if it succeeds then it reroutes to home, if fails a popup dialog will be shown 
    ///</summary>
    RegisterController.prototype.register = function () {
        var _this = this;
        this.$http({
            method: 'POST',
            url: this.SharedProperties.getServerUrl() + "api/Account/Register",
            data: {
                Name: this.name,
                Email: this.email,
                Password: this.password,
                PasswordConfirm: this.passwordConfirm
            }
        }).then(function (resp) {
            _this.$rootRouter.navigate(['Login']);
        }, function (error) {
            if (error.status == 400)
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('regerr1'), _this.$translate.instant('regerr2'));
            console.error("RegisterController register() error: ", error.status);
        });
    };
    ///<summary>
    ///Changes the language trough the change language services
    ///</summary>
    RegisterController.prototype.changeLanguage = function (key) {
        this.ChangeLanguageService.changeLanguage(key);
    };
    RegisterController.$inject = ["$scope", "$http", "$rootRouter", "SharedProperties", "PopupDialogService", "ChangeLanguageService", "$translate"];
    return RegisterController;
})();
//# sourceMappingURL=RegisterController.js.map