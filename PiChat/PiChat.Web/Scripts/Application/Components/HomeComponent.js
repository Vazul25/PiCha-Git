///<summary>
/// Component of the Home page, that is
/// responsible for routing in this site between tabs
///</summary>
var HomeComponent = (function () {
    function HomeComponent() {
        this.templateUrl = '/View/Home';
        this.controller = HomeController;
        this.controllerAs = 'homeCtrl';
        // routes
        this.$routeConfig = [
            {
                path: '/images',
                name: 'Images',
                component: 'imageListComponent',
                useAsDefault: true
            },
            {
                path: '/groups',
                name: 'Groups',
                component: 'groupComponent'
            },
            {
                path: '/upload',
                name: 'Upload',
                component: 'uploadComponent'
            },
            {
                path: '/profile',
                name: 'Profile',
                component: 'profileComponent'
            }
        ];
        // TODO: pontosítsátok
        // if the user isn't logged in, then he gets to the login site, and cannot see home
        this.$canActivate = function () {
            var rootRouter = angular.element(document.body).injector().get("$rootRouter");
            var sharedProperties = angular.element(document.body).injector().get("SharedProperties");
            if (sharedProperties.isUserLoggedIn()) {
                return true;
            }
            else {
                rootRouter.navigate(['Login']);
                return false;
            }
        };
    }
    return HomeComponent;
})();
//# sourceMappingURL=HomeComponent.js.map