using System.Web.Optimization;

namespace PiChat.Web
{
    public class BundleConfig
    {
        // REVIEW: túl sok a bundle. Mivel az összes JS-t úgyis letöltjük a Layoutból, ezért össze lehet őket fűzni teljesen egybe.
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.css",
                        "~/Content/Site.css",
                        "~/Content/lightbox.min.css",
                        "~/Content/tabs.css",
                        "~/Content/dialog.css",
                        "~/Content/angular-material.css",
                        "~/Content/angular-loading-bar.min.css",
                        "~/Content/fonts-roboto.css",
                        "~/Content/fonts-material-icons.css",
                        "~/Content/toastr.min.css",
                        "~/Content/select2.min.css"
            ));

            bundles.Add(new ScriptBundle("~/bundles/javascript").Include(
                        "~/Scripts/Libraries/es6-shim.min.js",
                        "~/Scripts/Libraries/system-polyfills.js",
                        "~/Scripts/Libraries/shims_for_IE.js",
                        "~/Scripts/Libraries/JQuery/jquery-{version}.js",
                        "~/Scripts/Libraries/JQuery/jquery.validate*",
                        "~/Scripts/Libraries/JQuery/jquery.signalR-2.2.0.min.js",
                        "~/Scripts/Libraries/modernizr-*",
                        "~/Scripts/Libraries/bootstrap/bootstrap.js",
                        "~/Scripts/Libraries/respond/respond.js",
                        "~/Scripts/Libraries/imagesloaded.pkgd.min.js",
                        "~/Scripts/Libraries/JQuery/jquery.pinto.min.js",
                        "~/Scripts/Libraries/lightbox.min.js",
                        "~/Scripts/Libraries/Angular/angular.js",
                        "~/Scripts/Libraries/angular-animate/angular-animate.js",
                        "~/Scripts/Libraries/angular-aria/angular-aria.js",
                        "~/Scripts/Libraries/Angular/angular-messages.js",
                        "~/Scripts/Libraries/Angular/angular-component-router.js",
                        "~/Scripts/Libraries/Angular/angular-img-http-src.js",
                        "~/Scripts/Libraries/Angular/angular-loading-bar.min.js",
                        "~/Scripts/Libraries/Angular/angular-md5.js",
                        "~/Scripts/Libraries/Angular/angular-validation-match.js",
                        "~/Scripts/Libraries/Angular/angular-translate.js",
                        "~/Scripts/Libraries/Angular/angular-translate-loader-url.min.js",
                        "~/Scripts/Libraries/angular-material/angular-material.js",
                        "~/Scripts/Libraries/svg-assets-cache.js",
                        "~/Scripts/Application/Models/SignalRStatus.js",
                        "~/Scripts/Application/Models/GroupMembershipRole.js",
                        "~/Scripts/Application/Directives/InputEnterHandlerDirective.js",
                        "~/Scripts/Application/Directives/PopularGroupDirective.js",
                        "~/Scripts/Application/Factories/HttpInterceptorFactory.js",
                        "~/Scripts/Application/Services/SharedProperties.js",
                        "~/Scripts/Application/Services/GroupService.js",
                        "~/Scripts/Application/Services/ImageService.js",
                        "~/Scripts/Application/Services/SignalRService.js",
                        "~/Scripts/Application/Services/MembershipService.js",
                        "~/Scripts/Application/Services/ProfileService.js",
                        "~/Scripts/Application/Services/PopupDialogService.js",
                        "~/Scripts/Application/Services/GroupMemberService.js",
                        "~/Scripts/Application/Services/ChangeLanguageService.js",
                        "~/Scripts/Application/DialogControllers/GroupChangeDescriptionDialogController.js",
                        "~/Scripts/Application/DialogControllers/GroupChangeNameDialogController.js",
                        "~/Scripts/Application/DialogControllers/GroupCreateDialogController.js",
                        "~/Scripts/Application/DialogControllers/ImageChangeDescriptionDialogController.js",
                        "~/Scripts/Application/DialogControllers/ProfileChangeNameDialogController.js",
                        "~/Scripts/Application/DialogControllers/ProfileChangePasswordDialogController.js",
                        "~/Scripts/Application/Controllers/LanguageSelectController.js",
                        "~/Scripts/Application/Controllers/GroupController.js",
                        "~/Scripts/Application/Controllers/LoginController.js",
                        "~/Scripts/Application/Controllers/ProfileController.js",
                        "~/Scripts/Application/Controllers/RegisterController.js",
                        "~/Scripts/Application/Controllers/HomeController.js",
                        "~/Scripts/Application/Controllers/ImageListController.js",
                        "~/Scripts/Application/Controllers/MemberListController.js",
                        "~/Scripts/Libraries/ng-file-upload/ng-file-upload-shim.js",
                        "~/Scripts/Libraries/ng-file-upload/ng-file-upload.js",
                        "~/Scripts/Application/Controllers/FileUploadController.js",
                        "~/Scripts/Application/Controllers/AppController.js",
                        "~/Scripts/Application/Components/LanguageSelectComponent.js",
                        "~/Scripts/Application/Components/LoginComponent.js",
                        "~/Scripts/Application/Components/ProfileComponent.js",
                        "~/Scripts/Application/Components/RegisterComponent.js",
                        "~/Scripts/Application/Components/ImageListComponent.js",
                        "~/Scripts/Application/Components/GroupComponent.js",
                        "~/Scripts/Application/Components/UploadComponent.js",
                        "~/Scripts/Application/Components/HomeComponent.js",
                        "~/Scripts/Application/Components/AppComponent.js",
                        "~/Scripts/Application/PiChatApp.js",
                        "~/Scripts/Application/Directives/tumbnailDirective.js"
            ));
        }
    }
}
