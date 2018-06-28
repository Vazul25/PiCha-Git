///<summary>
///Controller for changing a user's name dialog window
///</summary>
var ProfileChangeNameDialogController = (function () {
    function ProfileChangeNameDialogController($scope, $mdDialog) {
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
        ///Hides the dialog window and returns with the new name string
        ///</summary>
        this.changeName = function () {
            $('#profileChangeNameFormName').blur();
            if (_this.newName != undefined && _this.newName.length > 0) {
                _this.$mdDialog.hide(_this.newName);
            }
        };
    }
    ProfileChangeNameDialogController.$inject = ["$scope", "$mdDialog"];
    return ProfileChangeNameDialogController;
})();
//# sourceMappingURL=ProfileChangeNameDialogController.js.map