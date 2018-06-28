///<summary>
///Component for the Image page, that handles operations concerning the listing of images,
///showing images, filtering by groups, changeing their descriptions, deleting them ...
///</summary>
var ImageListComponent = (function () {
    function ImageListComponent() {
        this.templateUrl = '/View/Images';
        this.controller = ImageListController;
        this.controllerAs = 'imageListCtrl';
    }
    return ImageListComponent;
})();
//# sourceMappingURL=ImageListComponent.js.map