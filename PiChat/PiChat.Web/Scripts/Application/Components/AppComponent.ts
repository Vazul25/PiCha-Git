///<summary>
///Component for the whole app and helps in the routing of the app
///</summary>
class AppComponent implements ng.IComponentOptions {
    template = '<ng-outlet></ng-outlet>';
    controller = AppController;
    controllerAs = 'appCtrl';

    $routeConfig = [
        {
            path: '/login',
            name: 'Login',
            component: 'loginComponent',
            useAsDefault: true
        },
        {
            path: '/register',
            name: 'Register',
            component: 'registerComponent'
        },
        {
            path: '/home/...',
            name: 'Home',
            component: 'homeComponent'
        }
    ];
}