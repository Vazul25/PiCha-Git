///<summary>
///Component for the Uploading page, that handles operations concerning the uploading of pictures into groups
///</summary>
var UploadComponent = (function () {
    function UploadComponent() {
        this.templateUrl = '/View/UploadImages';
        this.controller = FileUploadController;
        this.controllerAs = 'fileUploadCtrl';
    }
    return UploadComponent;
})();
//# sourceMappingURL=UploadComponent.js.map