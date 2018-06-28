var ImageDetailsController = (function () {
    function ImageDetailsController($scope, $rootScope, $mdDialog, $mdMedia, ImageService) {
        var _this = this;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdMedia = $mdMedia;
        this.ImageService = ImageService;
        this.mycustomFullscreen = this.$mdMedia('xs') || this.$mdMedia('sm');
        this.image = this.image;
        this.customFullScreen = $mdMedia('xs') || this.$mdMedia('sm');
        $rootScope.$on('signalRChangeImageDescription', function (event, args) {
            if (_this.image.ImageID == args.imageId) {
                $scope.$applyAsync(function (a) {
                    _this.image.Description = args.newDescription;
                });
            }
        });
    }
    ImageDetailsController.prototype.showChangeDescriptionDialog = function (event, imageId) {
        var _this = this;
        var confirm = this.$mdDialog.prompt()
            .title('Change Description')
            .placeholder('Type new Description')
            .ariaLabel('Description')
            .targetEvent(event)
            .ok('Change')
            .cancel('Cancel');
        this.$mdDialog.show(confirm).then(function (result) {
            _this.changeDescription(imageId, result);
        }, function () {
            this.status = "The description didn't change.";
            console.log(this.status);
        });
    };
    ImageDetailsController.prototype.changeDescription = function (imageID, newDescription) {
        this.ImageService.changeDescription(imageID, newDescription);
    };
    ImageDetailsController.prototype.showDeleteImageDialog = function (event, imageID) {
        var _this = this;
        var confirm = this.$mdDialog.confirm()
            .title('Are you sure?')
            .textContent('This image will be deleted permanently.')
            .ariaLabel('Delete Image')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        this.$mdDialog.show(confirm).then(function () {
            _this.deleteImage(imageID);
        }, function () {
            this.status = 'No image was deleted.';
            console.log(this.status);
        });
    };
    ImageDetailsController.prototype.deleteImage = function (imageId) {
        this.ImageService.deleteImage(imageId);
    };
    ImageDetailsController.prototype.hide = function () {
        this.$mdDialog.hide();
    };
    ImageDetailsController.prototype.cancel = function () {
        this.$mdDialog.cancel();
    };
    ImageDetailsController.prototype.answer = function (answer) {
        this.$mdDialog.hide(answer);
    };
    ImageDetailsController.prototype.showSuccessAlert = function (ev) {
        this.$mdDialog.show(this.$mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Success')
            .textContent('Your files uploaded successfully')
            .ariaLabel('Success')
            .ok('Got it!'));
    };
    ImageDetailsController.prototype.showAdvanced = function (ev) {
        var _this = this;
        var useFullScreen = (this.$mdMedia('xs') || this.$mdMedia('sm') || this.$mdMedia('md') || this.$mdMedia('lg'));
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: 'dialogCtrl',
            templateUrl: '/Home/Popup',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                image: this.image
            },
            bindToController: true,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
            .then(function (answer) {
            this.status = 'You said the information was "' + answer + '".';
        }, function () {
            this.status = 'You cancelled the dialog.';
        });
        this.$scope.$watch(function () {
            return _this.$mdMedia('xs') || _this.$mdMedia('sm') || _this.$mdMedia('md') || _this.$mdMedia('lg');
        }, function (wantsFullScreen) {
            _this.mycustomFullscreen = (wantsFullScreen === true);
        });
    };
    ;
    ImageDetailsController.$inject = ["$scope", "$rootScope", "$mdDialog", "$mdMedia", "ImageService"];
    return ImageDetailsController;
})();
//# sourceMappingURL=ImageDetailsController.js.map