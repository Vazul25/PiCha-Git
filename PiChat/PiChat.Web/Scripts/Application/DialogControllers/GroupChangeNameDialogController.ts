///<summary>
///Controller for changing a group's name dialog window
///</summary>
class GroupChangeNameDialogController {
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
    ///Hides the dialog window and returns with the new name
    ///</summary>
    changeName = () => {
        $('#groupChangeNameFormName').blur();
        if (this.newName != undefined && this.newName.length > 0) {
            this.$mdDialog.hide(this.newName);
        }
    }
}