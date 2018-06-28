var ImageController = (function () {
    function ImageController($scope, ImageService) {
        this.$scope = $scope;
        this.ImageService = ImageService;
    }
    ImageController.prototype.getImages = function (groupID) {
        var _this = this;
        this.ImageService.getImages(groupID).then(function (resp) { return _this.Images = resp.data; });
    };
    ImageController.$inject = ["$scope", "ImageService"];
    return ImageController;
})();
//# sourceMappingURL=ImageController.js.map