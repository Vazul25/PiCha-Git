///<summary>
///Controller for creating a new group  dialog window
///</summary>
class GroupCreateDialogController {
    groupName: string;
    isPrivate: boolean = false;

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
    ///Hides the dialog window and returns with an object containing the new groups name and wether its private or not
    ///</summary>
    createGroup = () => {
        $('#groupCreateFormName').blur();
        if (this.groupName != undefined && this.groupName.length > 0) {
            this.$mdDialog.hide({ groupName: this.groupName, isPrivate: this.isPrivate });
        }
    }
}