///<summary>
///Component for the whole app and helps in the routing of the app
///</summary>
var AppComponent = (function () {
    function AppComponent() {
        this.template = '<ng-outlet></ng-outlet>';
        this.controller = AppController;
        this.controllerAs = 'appCtrl';
        this.$routeConfig = [
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
    return AppComponent;
})();
//# sourceMappingURL=AppComponent.js.map