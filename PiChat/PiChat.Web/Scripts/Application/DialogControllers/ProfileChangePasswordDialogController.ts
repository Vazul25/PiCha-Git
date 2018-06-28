///<summary>
///Controller for Changing the user's password dialog window
///</summary>
class ProfileChangePasswordDialogController {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;

    static $inject = ["$scope", "$mdDialog"]
    constructor(private $scope: ng.IScope,
        private $mdDialog: ng.material.IDialogService) {
    }

    ///<summary>
    ///Hides the dialog window
    ///</summary>
    hide = () => {
        this.$mdDialog.hide();
    };

    ///<summary>
    ///cancels the dialog window
    ///</summary>
    cancel = () => {
        this.$mdDialog.cancel();
    };

    ///<summary>
    ///Hides the dialog window and returns with an object containing the newPassword,oldPassword and newPasswordConfirm
    ///</summary>
    changePassword = () => {
        $('#profileChangePasswordFormOldPassword').blur();
        $('#profileChangePasswordFormNewPassword').blur();
        $('#profileChangePasswordFormNewPasswordConfirm').blur();
        if (this.oldPassword != undefined && this.oldPassword.length > 0
            && this.newPassword != undefined && this.newPassword.length > 0
            && this.newPasswordConfirm != undefined && this.newPasswordConfirm.length > 0) {
            this.$mdDialog.hide({ oldPassword: this.oldPassword, newPassword: this.newPassword, newPasswordConfirm: this.newPasswordConfirm });
        }
    }
}