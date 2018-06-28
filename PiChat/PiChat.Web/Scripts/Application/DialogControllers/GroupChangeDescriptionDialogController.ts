///<summary>
///Controller for changing a group's description dialog window
///</summary>
class GroupChangeDescriptionDialogController {
    newDescription: string;

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
    ///Hides the dialog window and returns with the new description
    ///</summary>
    changeDescription = () => {
        $('#groupChangeDescriptionFormDescription').blur();
        if (this.newDescription != undefined && this.newDescription.length > 0) {
            this.$mdDialog.hide(this.newDescription);
        }
    }
}