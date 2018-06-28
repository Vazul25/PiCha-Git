///<summary>
///Component for the Registration page, that handles operations concerning registration
///</summary>
class RegisterComponent implements ng.IComponentOptions {
    templateUrl = '/View/Register';
    controller = RegisterController;
    controllerAs = 'registerCtrl';
    bindings: { [index: string]: string; } = { value: '<' };

    // TODO: pontosítsátok
    // if the user is logged in, then he gets to the Home page, and cannot see the Registration page
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