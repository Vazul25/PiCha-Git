///<summary>
///Component for the Group page, that handles operations concerning groups,
///displaying my groups and other groups separetly, handling subscription and unsubscribtion, showing popup dialogs
///</summary>
var GroupComponent = (function () {
    function GroupComponent() {
        this.templateUrl = '/View/Groups';
        this.controller = GroupController;
        this.controllerAs = 'groupCtrl';
    }
    return GroupComponent;
})();
//# sourceMappingURL=GroupComponent.js.map