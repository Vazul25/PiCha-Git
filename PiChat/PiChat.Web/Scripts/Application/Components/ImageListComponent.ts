///<summary>
///Component for the Image page, that handles operations concerning the listing of images,
///showing images, filtering by groups, changeing their descriptions, deleting them ...
///</summary>
class ImageListComponent implements ng.IComponentOptions {
    templateUrl = '/View/Images';
    controller = ImageListController;
    controllerAs = 'imageListCtrl';
}