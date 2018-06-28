var DialogController = (function () {
    function DialogController($scope, $mdDialog) {
        var _this = this;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.hide = function () {
            _this.$mdDialog.hide();
        };
        this.cancel = function () {
            _this.$mdDialog.cancel();
        };
        this.answer = function (answer) {
            _this.$mdDialog.hide(answer);
        };
    }
    return DialogController;
})();
;
//# sourceMappingURL=DialogController.js.map