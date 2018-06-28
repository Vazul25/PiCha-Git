/// <reference path="../../typings/jquery/jquery.d.ts" />
///<summary>
/// Controller that handles loging in 
///</summary>
var LoginController = (function () {
    function LoginController($scope, $http, $rootRouter, SharedProperties, SignalRService, ChangeLanguageService) {
        this.$scope = $scope;
        this.$http = $http;
        this.$rootRouter = $rootRouter;
        this.SharedProperties = SharedProperties;
        this.SignalRService = SignalRService;
        this.ChangeLanguageService = ChangeLanguageService;
        this.email = "testuser1@pichat.hu"; ///login email
        this.password = "Password1"; //login password
        this.badLogin = false; //bool signaling wether the loging in was a sucess or not, if its true then an error message will be displayed
    }
    ///<summary>
    ///Calls a http post to login if the login is a sucess then reroutes and initializes the shared properties 
    ///</summary>
    LoginController.prototype.login = function () {
        var _this = this;
        this.$http({
            method: 'POST',
            url: this.SharedProperties.getServerUrl() + "Token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: "grant_type=password&username=" + this.email + "&password=" + this.password
        }).then(function (resp) {
            _this.SharedProperties.login(resp.data.access_token, resp.data.email, resp.data.name);
            _this.SignalRService.startPiChat().done(function () {
                console.log("SignalR connection started!");
                _this.SignalRService.setConnectionStatus(SignalRStatus.Connected);
                _this.$rootRouter.navigate(['Home']);
            }).fail(function () {
                _this.SignalRService.setConnectionStatus(SignalRStatus.Disconnected);
                console.error("SignalR error");
            });
        }, function (error) {
            _this.badLogin = true;
            console.error("LoginController login() error: ", error.status);
        });
    };
    ///<summary>
    ///Calls the change language service with the given parameter
    ///</summary>
    LoginController.prototype.changeLanguage = function (key) {
        this.ChangeLanguageService.changeLanguage(key);
    };
    LoginController.$inject = ["$scope", "$http", "$rootRouter", "SharedProperties", "SignalRService", "ChangeLanguageService"];
    return LoginController;
})();
//# sourceMappingURL=LoginController.js.map