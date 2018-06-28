///<summary>
///Controller for changing a user's name dialog window
///</summary>
class ProfileChangeNameDialogController {
    newName: string;

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
    ///Hides the dialog window and returns with the new name string
    ///</summary>
    changeName = () => {
        $('#profileChangeNameFormName').blur();
        if (this.newName != undefined && this.newName.length > 0) {
            this.$mdDialog.hide(this.newName);
        }
    }
}