///<summary>
///Component that handles operations concerning the profile page,
///displaying owned groups and groups where im a member or admin separetly, handling join requests, displaying the profile data etc.
///</summary>
var ProfileComponent = (function () {
    function ProfileComponent() {
        this.templateUrl = '/View/Profile';
        this.controller = ProfileController;
        this.controllerAs = 'profileCtrl';
    }
    return ProfileComponent;
})();
//# sourceMappingURL=ProfileComponent.js.map