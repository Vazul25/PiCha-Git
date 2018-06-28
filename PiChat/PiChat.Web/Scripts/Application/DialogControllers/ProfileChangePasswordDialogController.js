///<summary>
///Controller for Changing the user's password dialog window
///</summary>
var ProfileChangePasswordDialogController = (function () {
    function ProfileChangePasswordDialogController($scope, $mdDialog) {
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
        ///Hides the dialog window and returns with an object containing the newPassword,oldPassword and newPasswordConfirm
        ///</summary>
        this.changePassword = function () {
            $('#profileChangePasswordFormOldPassword').blur();
            $('#profileChangePasswordFormNewPassword').blur();
            $('#profileChangePasswordFormNewPasswordConfirm').blur();
            if (_this.oldPassword != undefined && _this.oldPassword.length > 0
                && _this.newPassword != undefined && _this.newPassword.length > 0
                && _this.newPasswordConfirm != undefined && _this.newPasswordConfirm.length > 0) {
                _this.$mdDialog.hide({ oldPassword: _this.oldPassword, newPassword: _this.newPassword, newPasswordConfirm: _this.newPasswordConfirm });
            }
        };
    }
    ProfileChangePasswordDialogController.$inject = ["$scope", "$mdDialog"];
    return ProfileChangePasswordDialogController;
})();
//# sourceMappingURL=ProfileChangePasswordDialogController.js.map