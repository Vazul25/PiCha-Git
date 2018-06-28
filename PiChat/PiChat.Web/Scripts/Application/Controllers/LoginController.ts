/// <reference path="../../typings/jquery/jquery.d.ts" />

///<summary>
/// Controller that handles loging in 
///</summary>
class LoginController {
    email: string = "testuser1@pichat.hu"; ///login email
    password: string = "Password1";//login password
    badLogin: boolean = false;//bool signaling wether the loging in was a sucess or not, if its true then an error message will be displayed

    static $inject = ["$scope", "$http", "$rootRouter", "SharedProperties", "SignalRService", "ChangeLanguageService"]
    constructor(private $scope: ng.IScope,
        private $http: ng.IHttpService,
        private $rootRouter: angular.Router,
        private SharedProperties: ISharedProperties,
        private SignalRService: ISignalRService,
        private ChangeLanguageService: IChangeLanguageService) {
    }

    ///<summary>
    ///Calls a http post to login if the login is a sucess then reroutes and initializes the shared properties 
    ///</summary>
    login() {
        this.$http({
            method: 'POST',
            url: this.SharedProperties.getServerUrl() + "Token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: "grant_type=password&username=" + this.email + "&password=" + this.password
        }).then((resp: any) => {
            this.SharedProperties.login(resp.data.access_token, resp.data.email, resp.data.name);
            this.SignalRService.startPiChat().done(() => {
                console.log("SignalR connection started!");
                this.SignalRService.setConnectionStatus(SignalRStatus.Connected);
                this.$rootRouter.navigate(['Home']);
            }).fail(() => {
                this.SignalRService.setConnectionStatus(SignalRStatus.Disconnected);
                console.error("SignalR error");
            });
        }, (error: any) => {
            this.badLogin = true;
            console.error("LoginController login() error: ", error.status);
        });
    }
    ///<summary>
    ///Calls the change language service with the given parameter
    ///</summary>
    changeLanguage(key: string) {
        this.ChangeLanguageService.changeLanguage(key);
    }
}