///<summary>
///Controller for changing an image's description dialog window
///</summary>
var ImageChangeDescriptionDialogController = (function () {
    function ImageChangeDescriptionDialogController($scope, $mdDialog) {
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
            $('#imageChangeDescriptionFormDescription').blur();
            if (_this.newDescription != undefined && _this.newDescription.length > 0) {
                _this.$mdDialog.hide(_this.newDescription);
            }
        };
    }
    ImageChangeDescriptionDialogController.$inject = ["$scope", "$mdDialog"];
    return ImageChangeDescriptionDialogController;
})();
//# sourceMappingURL=ImageChangeDescriptionDialogController.js.map