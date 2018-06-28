///<summary>
/// Controller of the home site which contains the subsites on tabs
/// This controller contains the common logic of the subsites,
/// the tabs, the routing and the toolbar
///</summary>
class HomeController {
    isTabsHidden: boolean = false;  // should tabs appear or not, it depends on if we are on profile page or not
    selectedTabIndex: number = 0;   // the id of the selected tab from the navbar to return there again from profile page (image is the default)

    static $inject = ["$rootRouter", "$rootScope", "GroupService", "SharedProperties", "SignalRService", "ChangeLanguageService"]
    constructor(private $rootRouter: angular.Router,
        private $rootScope: ng.IRootScopeService,
        private GroupService: IGroupService,
        private SharedProperties: ISharedProperties,
        private SignalRService: ISignalRService,
        private ChangeLanguageService: IChangeLanguageService) {

        // SignalR will be in real-time action if there's any change
        $rootScope.$on('signalRShowNewGroup', (event, args) => {
            this.SharedProperties.addOtherGroup(args.group);
        });

        $rootScope.$on('signalRChangeGroupDescription', (event, args) => {
            this.SharedProperties.changeGroupDescription(args.groupId, args.newDescription);
        });

        $rootScope.$on('signalRChangeGroupName', (event, args) => {
            this.SharedProperties.changeGroupName(args.groupId, args.newName);
        });

        $rootScope.$on('signalRDeleteGroup', (event, args) => {
            this.SharedProperties.removeGroup(args.groupId);
        });
    }

    ///<summary>
    /// Logout from the site, navigates to the login site
    ///</summary>
    logout() {
        this.SharedProperties.logout();
        this.SignalRService.stopPiChat();
        this.$rootRouter.navigate(['Login']);
    }

    ///<summary>
    /// Routing on the home route, sets the selected tab
    ///</summary>
    $routerOnActivate = () => {
        var url: string = window.location.href;
        if (url.indexOf('/groups') > -1) {
            this.selectedTabIndex = 1;
        } else if (url.indexOf('/upload') > -1) {
            this.selectedTabIndex = 2;
        } else if (url.indexOf('/profile') > -1) {
            this.isTabsHidden = true;
        }
        // calls the group initialization
        this.getGroups();
    }

    ///<summary>
    /// Sets the list of my groups and other groups
    /// by requesting them on HTTP through a service
    /// from the database
    ///</summary>
    getGroups() {
        this.GroupService.getMyGroups().then(resp => {
            this.SharedProperties.setMyGroups(resp.data);
        });

        this.GroupService.getGroups().then(resp => {
            this.SharedProperties.setOtherGroups(resp.data);
        });
    }

    ///<summary>
    /// Navigates to the profile page
    ///</summary>
    showProfilePage() {
        this.isTabsHidden = true;
        this.$rootRouter.navigateByUrl('home/profile');
    }

    ///<summary>
    /// Navigates to the home site and returns to the previously selected tab on it
    ///</summary>
    hideProfilePage() {
        this.isTabsHidden = false;
        this.selectTab();
    }

    ///<summary>
    /// Changes the language of the site if we click on the language chooser buttons
    ///</summary>
    changeLanguage(key: string) {
        this.ChangeLanguageService.changeLanguage(key);
    }

    ///<summary>
    /// Selects the tab from home page where we return from profile page
    ///</summary>
    selectTab() {
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
    }
}
