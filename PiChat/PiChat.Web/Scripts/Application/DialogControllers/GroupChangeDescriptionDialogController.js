///<summary>
///Controller for changing a group's description dialog window
///</summary>
var GroupChangeDescriptionDialogController = (function () {
    function GroupChangeDescriptionDialogController($scope, $mdDialog) {
        var _this = this;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
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
        ///Hides the dialog window and returns with the new description
        ///</summary>
        this.changeDescription = function () {
            $('#groupChangeDescriptionFormDescription').blur();
            if (_this.newDescription != undefined && _this.newDescription.length > 0) {
                _this.$mdDialog.hide(_this.newDescription);
            }
        };
    }
    GroupChangeDescriptionDialogController.$inject = ["$scope", "$mdDialog"];
    return GroupChangeDescriptionDialogController;
})();
//# sourceMappingURL=GroupChangeDescriptionDialogController.js.map