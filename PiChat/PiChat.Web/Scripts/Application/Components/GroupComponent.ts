///<summary>
///Component for the Group page, that handles operations concerning groups,
///displaying my groups and other groups separetly, handling subscription and unsubscribtion, showing popup dialogs
///</summary>
class GroupComponent implements ng.IComponentOptions {
    templateUrl = '/View/Groups';
    controller = GroupController;
    controllerAs = 'groupCtrl';
}