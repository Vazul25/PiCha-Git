///<summary>
///Component for the Registration page, that handles operations concerning registration
///</summary>
var RegisterComponent = (function () {
    function RegisterComponent() {
        this.templateUrl = '/View/Register';
        this.controller = RegisterController;
        this.controllerAs = 'registerCtrl';
        this.bindings = { value: '<' };
        // TODO: pontosítsátok
        // if the user is logged in, then he gets to the Home page, and cannot see the Registration page
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
    return RegisterComponent;
})();
//# sourceMappingURL=RegisterComponent.js.map