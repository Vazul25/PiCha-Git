///<summary>
///Controller for changing a group's name dialog window
///</summary>
var GroupChangeNameDialogController = (function () {
    function GroupChangeNameDialogController($scope, $mdDialog) {
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
        ///Hides the dialog window and returns with the new name
        ///</summary>
        this.changeName = function () {
            $('#groupChangeNameFormName').blur();
            if (_this.newName != undefined && _this.newName.length > 0) {
                _this.$mdDialog.hide(_this.newName);
            }
        };
    }
    GroupChangeNameDialogController.$inject = ["$scope", "$mdDialog"];
    return GroupChangeNameDialogController;
})();
//# sourceMappingURL=GroupChangeNameDialogController.js.map