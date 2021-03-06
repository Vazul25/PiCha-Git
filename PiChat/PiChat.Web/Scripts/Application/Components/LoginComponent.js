///<summary>
///Component for the Login page, that handles operations concerning loging in to the site
///</summary>
var LoginComponent = (function () {
    function LoginComponent() {
        this.templateUrl = '/View/Login';
        this.controller = LoginController;
        this.controllerAs = 'loginCtrl';
        this.bindings = { value: '<' };
        // TODO: pontosítsátok
        // if the user is logged in, then he gets to the Home page, and cannot see the login page
        this.$canActivate = function () {
            var rootRouter = angular.element(document.body).injector().get("$rootRouter");
            var sharedProperties = angular.element(document.body).injector().get("SharedProperties");
            if (sharedProperties.isUserLoggedIn()) {
                rootRouter.navigate(['Home']);
                return false;
            }
            else {
                return true;
            }
        };
    }
    return LoginComponent;
})();
//# sourceMappingURL=LoginComponent.js.map