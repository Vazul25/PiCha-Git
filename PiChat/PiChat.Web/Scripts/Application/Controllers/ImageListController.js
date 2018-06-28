/// <reference path="../../typings/jquery/jquery.d.ts" />
///<summary>
/// The controller that handles the displaying, deleting, renameing,
/// filtering by groups, description changeing and magnification of the images
///</summary>
var ImageListController = (function () {
    function ImageListController($scope, $rootScope, $mdDialog, $mdMedia, SharedProperties, ImageService, GroupService, $translate, PopupDialogService) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$mdMedia = $mdMedia;
        this.SharedProperties = SharedProperties;
        this.ImageService = ImageService;
        this.GroupService = GroupService;
        this.$translate = $translate;
        this.PopupDialogService = PopupDialogService;
        this.selectedGroup = -1; // actually selected groups id for filtering purposes, -1 means "All"
        this.selectedImageSize = 'medium'; // actually selected size of the displaying images
        this.mycustomFullscreen = this.$mdMedia('xs') || this.$mdMedia('sm'); // dialog size config
        this.images = []; // the array which contains the information of the images that were loaded in
        this.myGroups = []; // the array which contains our groups in which we can view the images
        ///<summary>
        ///Gets the data on initialization 
        ///</summary>
        this.$onInit = function () {
            _this.getImages();
            _this.myGroups = _this.SharedProperties.getMyGroups();
        };
        //Subscribe to signalerr event, to display newly uploaded images in real time
        $rootScope.$on('signalRShowNewImages', function (event, args) {
            if (_this.selectedGroup == -1) {
                args.images.forEach(function (image, index) {
                    _this.$scope.$applyAsync(function () {
                        _this.images.unshift(image);
                    });
                });
            }
        });
        //Subscribe to signalerr event, to display newly updated image description in real time
        $rootScope.$on('signalRChangeImageDescription', function (event, args) {
            _this.images.forEach(function (image, index) {
                if (image.imageId == args.imageId) {
                    _this.$scope.$applyAsync(function () {
                        image.description = args.newDescription;
                        _this.refreshImagesGrid();
                    });
                }
            });
        });
        //Subscribe to signalerr event, to delete newly deleted images from our array in real time
        $rootScope.$on('signalRDeleteImage', function (event, args) {
            var imageIndex = -1;
            _this.images.forEach(function (image, index) {
                if (image.imageId == args.imageId) {
                    imageIndex = index;
                }
            });
            if (imageIndex > -1) {
                _this.$scope.$applyAsync(function () {
                    _this.images.splice(imageIndex, 1);
                    _this.refreshImagesGrid();
                });
            }
        });
        //Subscribe to signalerr event, to refresh images  
        $rootScope.$on('updateImages', function (event, args) {
            _this.selectedGroup = -1;
            _this.getImages();
        });
        //Subscribe to signalerr event, to refresh groups when there is any change in them 
        $rootScope.$on('sharedPropertiesGroupsChanged', function (event, args) {
            _this.myGroups = _this.SharedProperties.getMyGroups();
        });
        //Subscribe to signalerr event, to refresh images when they are finished downloading
        $rootScope.$on('sharedPropertiesImagesLoaded', function (event, args) {
            _this.refreshImagesGrid();
        });
    }
    ///<summary>
    /// Refreshes the image grid to display the images in an ordered manner
    ///</summary>
    ImageListController.prototype.refreshImagesGrid = function () {
        var scrollYPos = window.scrollY;
        setTimeout(function () {
            var itemWidth = $('.grid-sizer').width() - 10;
            $(".grid").pinto({
                itemWidth: itemWidth
            });
            window.scroll(0, scrollYPos);
        }, 100);
    };
    ///<summary>
    ///Gets the first 10 images without filter trough the image service, and sets the images,hasMore variables
    ///</summary>
    ImageListController.prototype.getImages = function () {
        var _this = this;
        this.ImageService.getFirstTenImagesOfAll().then(function (resp) {
            _this.images = resp.data;
            if (_this.images.length == 10)
                _this.hasMore = true;
        });
    };
    ///<summary>
    ///Gets the first 10 images of a group trough the image service, and sets the images,hasMore variables
    ///</summary>
    ImageListController.prototype.getImagesByGroup = function (groupId) {
        var _this = this;
        this.ImageService.getFirstTenImagesOfGroup(groupId).then(function (resp) {
            _this.images = resp.data;
            if (_this.images.length == 10)
                _this.hasMore = true;
        });
    };
    ///<summary>
    ///Gets the next 10 images, if the selectedGroup variable is not null then of a given group else from all groups
    ///trough the image service and concatanates it to the images variable also sets hasMore variable
    ///</summary>
    ImageListController.prototype.showMore = function () {
        var _this = this;
        console.log(this.selectedGroup);
        // if we want all the pictures to show
        if (this.selectedGroup == -1) {
            if (this.images != null && this.images.length > 0) {
                this.ImageService.getNextTenImagesOfAll(this.images[this.images.length - 1].imageId).then(function (resp) {
                    _this.$scope.$applyAsync(function (apl) {
                        _this.images = _this.images.concat(resp.data);
                    });
                    // if there's no more 10 pictures to load in
                    if (resp.data.length != 10)
                        _this.hasMore = false;
                });
            }
        }
        else {
            if (this.images != null && this.images.length > 0) {
                this.ImageService.getNextTenImagesOfGroup(this.selectedGroup, this.images[this.images.length - 1].imageId).then(function (resp) {
                    _this.$scope.$applyAsync(function (apl) {
                        _this.images = _this.images.concat(resp.data);
                    });
                    // if there's no more 10 pictures to load in
                    if (resp.data.length != 10)
                        _this.hasMore = false;
                });
            }
        }
    };
    ///<summary>
    ///Sets the image size trough jquery to small medium or large 
    ///</summary>
    ///<param name="selectedSize">A string that specifies the wished display size of the image, "small","large" or by default medium <param>
    ImageListController.prototype.setImageSize = function (selectedSize) {
        switch (selectedSize) {
            case 'large':
                $('.grid-sizer').width("100%");
                break;
            case 'small':
                $('.grid-sizer').width("33.33%");
                break;
            default:
                $('.grid-sizer').width("50%");
        }
        this.refreshImagesGrid();
    };
    ///<summary>
    ///Shows a popup window for changing the description of a given image, trough the PopupDialogService
    ///</summary>
    ///<param name="imageId">Specifies the image <param>
    ///<param name="event">Specifies the target event <param>
    ImageListController.prototype.showChangeDescriptionDialog = function (event, imageId) {
        var _this = this;
        var useFullScreen = (this.$mdMedia('xs') || this.$mdMedia('sm') || this.$mdMedia('md') || this.$mdMedia('lg'));
        this.PopupDialogService.showChangeImageDescriptionDialog(event, useFullScreen).then(function (newDescription) {
            _this.ImageService.changeDescription(imageId, newDescription).then(function (resp) { }, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg7') + " " + _this.$translate.instant('errY'), _this.$translate.instant('err6'));
            });
        });
    };
    ///<summary>
    ///Shows a popup window for deleting a given image, trough the PopupDialogService
    ///</summary>
    ///<param name="imageId">Specifies the image <param>
    ///<param name="event">Specifies the target event <param>
    ImageListController.prototype.showDeleteImageDialog = function (event, imageId) {
        var _this = this;
        this.PopupDialogService.showConfirmDialog(this.$translate.instant('que1'), this.$translate.instant('que2'), event).then(function () {
            _this.ImageService.deleteImage(imageId).then(function (resp) { }, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg7') + " " + _this.$translate.instant('errY'), _this.$translate.instant('err7'));
            });
        });
    };
    ImageListController.$inject = ["$scope", "$rootScope", "$mdDialog", "$mdMedia", "SharedProperties", "ImageService", "GroupService", "$translate", "PopupDialogService"];
    return ImageListController;
})();
//# sourceMappingURL=ImageListController.js.map