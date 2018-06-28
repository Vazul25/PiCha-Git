var ImageDetailsComponent = (function () {
    function ImageDetailsComponent() {
        this.templateUrl = '/Home/GetImageView';
        this.controller = ImageDetailsController;
        this.controllerAs = 'imageDetailsCtrl';
        this.bindings = { image: '<' };
    }
    return ImageDetailsComponent;
})();
//# sourceMappingURL=ImageDetailsComponent.js.map