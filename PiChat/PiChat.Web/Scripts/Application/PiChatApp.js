angular.module('PiChatApp', ['ngComponentRouter', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngFileUpload', 'angular.img', 'angular-loading-bar', 'angular-md5', 'validation.match', 'pascalprecht.translate'])
    .factory('HttpInterceptor', HttpInterceptorFactory)
    .config(function ($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
})
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = 'body';
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner" style="margin-left: 47%;margin-top: -4px;zoom: 2;"><div class="spinner-icon"></div></div>';
    }])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useUrlLoader('/api/Translation/GetTranslation'); //Automatikusan hozzáfűzi a preferredLanguage-ben megadott paramétert a kéréshez
    }])
    .directive('myEnter', InputEnterHandlerDirective.instance)
    .directive('popularGroupDirective', PopularGroupDirective.instance)
    .service("PopupDialogService", PopupDialogService)
    .service("SharedProperties", SharedProperties)
    .service("GroupService", GroupService)
    .service("ImageService", ImageService)
    .service("SignalRService", SignalRService)
    .service("ProfileService", ProfileService)
    .service("MembershipService", MembershipService)
    .service("GroupMemberService", GroupMemberService)
    .service("ChangeLanguageService", ChangeLanguageService)
    .value('$routerRootComponent', 'app')
    .component('languageSelect', new LanguageSelectComponent())
    .component('loginComponent', new LoginComponent())
    .component('registerComponent', new RegisterComponent())
    .component('imageListComponent', new ImageListComponent())
    .component('groupComponent', new GroupComponent())
    .component('uploadComponent', new UploadComponent())
    .component('profileComponent', new ProfileComponent())
    .component('homeComponent', new HomeComponent())
    .component('app', new AppComponent());
//# sourceMappingURL=PiChatApp.js.map