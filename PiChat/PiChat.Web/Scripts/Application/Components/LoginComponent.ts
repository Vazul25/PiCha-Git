///<summary>
///Component for the Login page, that handles operations concerning loging in to the site
///</summary>
class LoginComponent implements ng.IComponentOptions {
    templateUrl = '/View/Login';
    controller = LoginController;
    controllerAs = 'loginCtrl';
    bindings: { [index: string]: string; } = { value: '<' };

    // TODO: pontosítsátok
    // if the user is logged in, then he gets to the Home page, and cannot see the login page
    $canActivate = () => {
        var rootRouter = <angular.Router>angular.element(document.body).injector().get("$rootRouter");
        var sharedProperties = <ISharedProperties>angular.element(document.body).injector().get("SharedProperties");

        if (sharedProperties.isUserLoggedIn()) {
            rootRouter.navigate(['Home']);
            return false;
        } else {
            return true;
        }
    };
}