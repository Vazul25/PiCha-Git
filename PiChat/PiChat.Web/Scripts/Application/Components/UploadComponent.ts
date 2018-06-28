///<summary>
///Component for the Uploading page, that handles operations concerning the uploading of pictures into groups
///</summary>
class UploadComponent implements ng.IComponentOptions {
    templateUrl = '/View/UploadImages';
    controller = FileUploadController;
    controllerAs = 'fileUploadCtrl';
}