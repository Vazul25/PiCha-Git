///<summary>
/// Controller of the home site which contains the subsites on tabs
/// This controller contains the common logic of the subsites,
/// the tabs, the routing and the toolbar
///</summary>
var HomeController = (function () {
    function HomeController($rootRouter, $rootScope, GroupService, SharedProperties, SignalRService, ChangeLanguageService) {
        var _this = this;
        this.$rootRouter = $rootRouter;
        this.$rootScope = $rootScope;
        this.GroupService = GroupService;
        this.SharedProperties = SharedProperties;
        this.SignalRService = SignalRService;
        this.ChangeLanguageService = ChangeLanguageService;
        this.isTabsHidden = false; // should tabs appear or not, it depends on if we are on profile page or not
        this.selectedTabIndex = 0; // the id of the selected tab from the navbar to return there again from profile page (image is the default)
        ///<summary>
        /// Routing on the home route, sets the selected tab
        ///</summary>
        this.$routerOnActivate = function () {
            var url = window.location.href;
            if (url.indexOf('/groups') > -1) {
                _this.selectedTabIndex = 1;
            }
            else if (url.indexOf('/upload') > -1) {
                _this.selectedTabIndex = 2;
            }
            else if (url.indexOf('/profile') > -1) {
                _this.isTabsHidden = true;
            }
            // calls the group initialization
            _this.getGroups();
        };
        // SignalR will be in real-time action if there's any change
        $rootScope.$on('signalRShowNewGroup', function (event, args) {
            _this.SharedProperties.addOtherGroup(args.group);
        });
        $rootScope.$on('signalRChangeGroupDescription', function (event, args) {
            _this.SharedProperties.changeGroupDescription(args.groupId, args.newDescription);
        });
        $rootScope.$on('signalRChangeGroupName', function (event, args) {
            _this.SharedProperties.changeGroupName(args.groupId, args.newName);
        });
        $rootScope.$on('signalRDeleteGroup', function (event, args) {
            _this.SharedProperties.removeGroup(args.groupId);
        });
    }
    ///<summary>
    /// Logout from the site, navigates to the login site
    ///</summary>
    HomeController.prototype.logout = function () {
        this.SharedProperties.logout();
        this.SignalRService.stopPiChat();
        this.$rootRouter.navigate(['Login']);
    };
    ///<summary>
    /// Sets the list of my groups and other groups
    /// by requesting them on HTTP through a service
    /// from the database
    ///</summary>
    HomeController.prototype.getGroups = function () {
        var _this = this;
        this.GroupService.getMyGroups().then(function (resp) {
            _this.SharedProperties.setMyGroups(resp.data);
        });
        this.GroupService.getGroups().then(function (resp) {
            _this.SharedProperties.setOtherGroups(resp.data);
        });
    };
    ///<summary>
    /// Navigates to the profile page
    ///</summary>
    HomeController.prototype.showProfilePage = function () {
        this.isTabsHidden = true;
        this.$rootRouter.navigateByUrl('home/profile');
    };
    ///<summary>
    /// Navigates to the home site and returns to the previously selected tab on it
    ///</summary>
    HomeController.prototype.hideProfilePage = function () {
        this.isTabsHidden = false;
        this.selectTab();
    };
    ///<summary>
    /// Changes the language of the site if we click on the language chooser buttons
    ///</summary>
    HomeController.prototype.changeLanguage = function (key) {
        this.ChangeLanguageService.changeLanguage(key);
    };
    ///<summary>
    /// Selects the tab from home page where we return from profile page
    ///</summary>
    HomeController.prototype.selectTab = function () {
        switch (this.selectedTabIndex) {
            case 1:
                this.$rootRouter.navigateByUrl('home/groups');
                break;
            case 2:
                this.$rootRouter.navigateByUrl('home/upload');
                break;
            default:
                this.$rootRouter.navigateByUrl('home/images');
        }
    };
    HomeController.$inject = ["$rootRouter", "$rootScope", "GroupService", "SharedProperties", "SignalRService", "ChangeLanguageService"];
    return HomeController;
})();
//# sourceMappingURL=HomeController.js.map