///<summary>
///Component that handles operations concerning the profile page,
///displaying owned groups and groups where im a member or admin separetly, handling join requests, displaying the profile data etc.
///</summary>
class ProfileComponent implements ng.IComponentOptions {
    templateUrl = '/View/Profile';
    controller = ProfileController;
    controllerAs = 'profileCtrl';
}