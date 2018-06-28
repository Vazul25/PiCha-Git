///<summary>
///Controller for creating a new group  dialog window
///</summary>
var GroupCreateDialogController = (function () {
    function GroupCreateDialogController($scope, $mdDialog) {
        var _this = this;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.isPrivate = false;
        ///<summary>
        ///Hides the dialog window
        ///</summary>
        this.hide = function () {
            _this.$mdDialog.hide();
        };
        ///<summary>
        ///cancels the dialog window
        ///</summary>
        this.cancel = function () {
            _this.$mdDialog.cancel();
        };
        ///<summary>
        ///Hides the dialog window and returns with an object containing the new groups name and wether its private or not
        ///</summary>
        this.createGroup = function () {
            $('#groupCreateFormName').blur();
            if (_this.groupName != undefined && _this.groupName.length > 0) {
                _this.$mdDialog.hide({ groupName: _this.groupName, isPrivate: _this.isPrivate });
            }
        };
    }
    GroupCreateDialogController.$inject = ["$scope", "$mdDialog"];
    return GroupCreateDialogController;
})();
//# sourceMappingURL=GroupCreateDialogController.js.map